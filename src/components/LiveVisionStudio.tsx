"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Camera,
  CameraOff,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Aperture,
  Zap,
  Hand,
  Activity,
  Sparkles,
  Layers,
  HelpCircle,
  Play,
} from "lucide-react";
import { GestureCheatSheet } from "./GestureCheatSheet";
import {
  GESTURE_CATALOG,
  DEMO_PRESETS,
  type DemoPreset,
  type ScenarioContext,
} from "@/lib/gesture-tokens";

interface LiveVisionStudioProps {
  currentScenario: ScenarioContext;
  onLockGestureToken: (token: string) => void;
  onApplyPreset: (preset: DemoPreset) => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  onCaptureSnapshot?: (base64: string) => void;
  onUpdateFps?: (fps: number) => void;
  onCameraStatusChange?: (isActive: boolean) => void;
}

export function LiveVisionStudio({
  currentScenario,
  onLockGestureToken,
  onApplyPreset,
  autoSpeak,
  onToggleAutoSpeak,
  onCaptureSnapshot,
  onUpdateFps,
  onCameraStatusChange,
}: LiveVisionStudioProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(30);
  const [handedness, setHandedness] = useState<"Right Hand" | "Left Hand" | "Scanning">("Scanning");
  const [currentRawGesture, setCurrentRawGesture] = useState<string>("Open_Palm");
  const [currentConcept, setCurrentConcept] = useState<string>("Hello / Excuse Me");
  const [holdProgress, setHoldProgress] = useState<number>(0); // 0 to 100%
  const [cameraError, setCameraError] = useState<string | null>(null);

  // References to keep gesture hold timer and MediaPipe recognizer stable
  const gestureRecognizerRef = useRef<any>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const activeHoldGestureRef = useRef<string | null>(null);
  const holdStartTimeRef = useRef<number>(0);
  const lastLockedGestureRef = useRef<string | null>(null);

  // Monotonic timestamp references for MediaPipe
  const lastVideoTimeRef = useRef<number>(-1);
  const lastTimestampRef = useRef<number>(-1);

  const HOLD_DURATION_MS = 600; // 600ms hold to lock

  // Draw glowing neon-cyan & emerald skeleton
  const drawSkeletonOnCanvas = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      landmarks?: any[]
    ) => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 + 10;

      // If camera is OFF, draw an ambient aura and simulated 21-point hand rig
      if (!isCameraActive) {
        const aura = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 130);
        aura.addColorStop(0, "rgba(56, 189, 248, 0.2)");
        aura.addColorStop(0.6, "rgba(16, 185, 129, 0.1)");
        aura.addColorStop(1, "rgba(2, 6, 23, 0)");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 130, 0, Math.PI * 2);
        ctx.fill();
      }

      let pointsToDraw: { x: number; y: number }[] = [];

      if (landmarks && landmarks.length > 0) {
        pointsToDraw = landmarks.map((lm: any) => ({
          x: lm.x * width,
          y: lm.y * height,
        }));
      } else if (!isCameraActive) {
        // Simulated hand rig for idle preview
        const wrist = { x: centerX, y: centerY + 65 };
        const thumb = [
          { x: centerX - 25, y: centerY + 30 },
          { x: centerX - 45, y: centerY + 10 },
          { x: centerX - 60, y: centerY - 10 },
          { x: centerX - 75, y: centerY - 25 },
        ];
        const index = [
          { x: centerX - 15, y: centerY },
          { x: centerX - 25, y: centerY - 35 },
          { x: centerX - 30, y: centerY - 65 },
          { x: centerX - 35, y: centerY - 95 },
        ];
        const middle = [
          { x: centerX, y: centerY - 5 },
          { x: centerX, y: centerY - 45 },
          { x: centerX, y: centerY - 80 },
          { x: centerX, y: centerY - 110 },
        ];
        const ring = [
          { x: centerX + 15, y: centerY },
          { x: centerX + 22, y: centerY - 35 },
          { x: centerX + 26, y: centerY - 65 },
          { x: centerX + 30, y: centerY - 95 },
        ];
        const pinky = [
          { x: centerX + 30, y: centerY + 10 },
          { x: centerX + 42, y: centerY - 20 },
          { x: centerX + 48, y: centerY - 45 },
          { x: centerX + 52, y: centerY - 70 },
        ];
        pointsToDraw = [wrist, ...thumb, ...index, ...middle, ...ring, ...pinky];
      }

      if (!showSkeleton || pointsToDraw.length < 21) return;

      // Draw skeleton bone segments
      ctx.strokeStyle = "#38bdf8"; // Neon cyan
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 8;

      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [0, 9], [9, 10], [10, 11], [11, 12], // Middle
        [0, 13], [13, 14], [14, 15], [15, 16], // Ring
        [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
        [5, 9], [9, 13], [13, 17], // Palm base
      ];

      connections.forEach(([i, j]) => {
        if (pointsToDraw[i] && pointsToDraw[j]) {
          ctx.beginPath();
          ctx.moveTo(pointsToDraw[i].x, pointsToDraw[i].y);
          ctx.lineTo(pointsToDraw[j].x, pointsToDraw[j].y);
          ctx.stroke();
        }
      });

      // Reset shadow blur before drawing joints
      ctx.shadowBlur = 0;

      // Draw landmark joints
      pointsToDraw.forEach((pt, idx) => {
        const isFingertip = [4, 8, 12, 16, 20].includes(idx);
        ctx.fillStyle = idx === 0 ? "#38bdf8" : isFingertip ? "#10b981" : "#34d399";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isFingertip ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw bounding box if real hand is detected
      if (landmarks && landmarks.length > 0) {
        let minX = width;
        let maxX = 0;
        let minY = height;
        let maxY = 0;

        pointsToDraw.forEach((p) => {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        });

        const pad = 16;
        ctx.strokeStyle = "rgba(16, 185, 129, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(
          Math.max(0, minX - pad),
          Math.max(0, minY - pad),
          Math.min(width, maxX - minX + pad * 2),
          Math.min(height, maxY - minY + pad * 2)
        );
        ctx.setLineDash([]);
      }
    },
    [showSkeleton, isCameraActive]
  );

  // Initialize MediaPipe Vision Tasks
  useEffect(() => {
    let isMounted = true;

    async function initMediaPipe() {
      try {
        const vision = await import("@mediapipe/tasks-vision");
        const { FilesetResolver, GestureRecognizer } = vision;

        const wasmFileset = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );

        if (!isMounted) return;

        const recognizer = await GestureRecognizer.createFromOptions(wasmFileset, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });

        if (!isMounted) return;
        gestureRecognizerRef.current = recognizer;
      } catch (err) {
        console.warn("MediaPipe model loading notice (canvas simulation active):", err);
      }
    }

    initMediaPipe();

    return () => {
      isMounted = false;
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  // Camera start
  const handleStartCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            setIsCameraActive(true);
            onCameraStatusChange?.(true);
          } catch (playErr) {
            console.warn("Video play error:", playErr);
          }
        };
      }
    } catch (err: any) {
      console.warn("Webcam access notice:", err);
      setCameraError(
        "Camera stream unavailable or permission denied. Interactive simulator is active."
      );
      setIsCameraActive(false);
      onCameraStatusChange?.(false);
    }
  };

  // Camera stop
  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    onCameraStatusChange?.(false);
    setHoldProgress(0);
    lastVideoTimeRef.current = -1;
    lastTimestampRef.current = -1;

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Continuous animation loop for camera & landmark tracking
  useEffect(() => {
    let lastTime = Date.now();
    let frameCount = 0;

    const render = () => {
      const now = performance.now();
      const wallClock = Date.now();

      frameCount++;
      if (wallClock - lastTime >= 1000) {
        setFps(frameCount);
        onUpdateFps?.(frameCount);
        frameCount = 0;
        lastTime = wallClock;
      }

      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (
            isCameraActive &&
            video &&
            video.readyState >= 2 &&
            !video.paused &&
            video.videoWidth > 0 &&
            video.videoHeight > 0
          ) {
            // Keep canvas dimensions matched to video
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
            }

            // Only call MediaPipe if video has advanced to a new frame and timestamp is strictly increasing
            if (
              gestureRecognizerRef.current &&
              video.currentTime !== lastVideoTimeRef.current &&
              now > lastTimestampRef.current
            ) {
              lastVideoTimeRef.current = video.currentTime;
              lastTimestampRef.current = now;

              try {
                const results = gestureRecognizerRef.current.recognizeForVideo(video, now);
                let recognizedConcept = "Scanning...";
                let detectedHand = "Right Hand";

                if (results.handedness && results.handedness.length > 0) {
                  detectedHand = `${results.handedness[0][0].displayName} Hand`;
                  setHandedness(detectedHand as any);
                }

                if (results.landmarks && results.landmarks.length > 0) {
                  const lm = results.landmarks[0];

                  // Custom Rule 1: Index tip (landmark[8]) near head / upper frame (y < 0.32)
                  if (lm[8] && lm[8].y < 0.32) {
                    recognizedConcept = "Headache / Fever";
                    setCurrentRawGesture("Custom_Rule_Head");
                  }
                  // Custom Rule 2: Hand center (landmark[9]) near lower chest area (y > 0.40)
                  else if (lm[9] && lm[9].y > 0.40 && lm[9].y < 0.85 && lm[9].x > 0.28 && lm[9].x < 0.72) {
                    recognizedConcept = "My Chest / Heart";
                    setCurrentRawGesture("Custom_Rule_Chest");
                  }
                  // Standard MediaPipe gestures
                  else if (results.gestures && results.gestures.length > 0) {
                    const topG = results.gestures[0][0].categoryName;
                    setCurrentRawGesture(topG);
                    const match = GESTURE_CATALOG.find((g) => g.name === topG);
                    if (match) recognizedConcept = match.tokenText;
                  }

                  drawSkeletonOnCanvas(ctx, canvas.width, canvas.height, lm);
                } else {
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                }

                if (recognizedConcept && recognizedConcept !== "Scanning...") {
                  setCurrentConcept(recognizedConcept);

                  // Hold-to-lock logic (600ms hold timer)
                  if (activeHoldGestureRef.current === recognizedConcept) {
                    const elapsed = wallClock - holdStartTimeRef.current;
                    const progress = Math.min(100, Math.round((elapsed / HOLD_DURATION_MS) * 100));
                    setHoldProgress(progress);

                    if (elapsed >= HOLD_DURATION_MS) {
                      if (lastLockedGestureRef.current !== recognizedConcept) {
                        onLockGestureToken(recognizedConcept);
                        lastLockedGestureRef.current = recognizedConcept;
                      }
                      // Reset hold timer
                      activeHoldGestureRef.current = null;
                      setHoldProgress(0);
                    }
                  } else {
                    activeHoldGestureRef.current = recognizedConcept;
                    holdStartTimeRef.current = wallClock;
                    setHoldProgress(0);
                  }
                } else {
                  activeHoldGestureRef.current = null;
                  setHoldProgress(0);
                }
              } catch (e) {
                // Ignore per-frame error
              }
            }
          } else if (!isCameraActive) {
            // Draw simulated skeleton on idle
            drawSkeletonOnCanvas(ctx, canvas.width, canvas.height);
          }
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    animationFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [isCameraActive, drawSkeletonOnCanvas, onLockGestureToken, onUpdateFps]);

  // Snapshot capture
  const handleCaptureSnapshot = () => {
    if (videoRef.current && onCaptureSnapshot) {
      const snapCanvas = document.createElement("canvas");
      snapCanvas.width = videoRef.current.videoWidth || 640;
      snapCanvas.height = videoRef.current.videoHeight || 480;
      const snapCtx = snapCanvas.getContext("2d");
      if (snapCtx) {
        snapCtx.drawImage(videoRef.current, 0, 0);
        const dataUrl = snapCanvas.toDataURL("image/jpeg", 0.85);
        onCaptureSnapshot(dataUrl);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Viewport Card */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 relative overflow-hidden flex flex-col">
        {/* HUD Top Bar */}
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              30 FPS Live Vision Studio
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
              {handedness}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-slate-800">
              {fps} FPS
            </span>
          </div>
        </div>

        {/* Live Camera & Neon Skeleton Viewport (Shows face & background with skeleton overlay) */}
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/3] flex items-center justify-center">
          {/* Real live webcam video feed showing user's face, body, and background */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`w-full h-full object-cover -scale-x-100 ${
              isCameraActive ? "block" : "hidden"
            }`}
          />

          {/* Transparent neon-cyan & emerald skeleton overlay on top of video */}
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className={`w-full h-full object-cover ${
              isCameraActive ? "absolute inset-0 pointer-events-none -scale-x-100" : "block"
            }`}
          />

          {/* Neon radar scanline */}
          <div className="scanline pointer-events-none" />

          {/* Start Camera Overlay Prompt if camera is OFF */}
          {!isCameraActive && (
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-3 shadow-xl animate-pulse">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1">Live Camera Ready</h3>
              <p className="text-xs text-slate-400 max-w-xs mb-4">
                Click below to start your webcam. Your live face, upper body, and neon hand skeleton will appear right here.
              </p>
              <button
                onClick={handleStartCamera}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Live Camera</span>
              </button>
            </div>
          )}

          {/* HUD Top-Left: Active Detected Gesture Badge */}
          {isCameraActive && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-2 pointer-events-none z-20">
              <div className="px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 flex items-center gap-2 shadow-lg">
                <span className="text-sm">
                  {GESTURE_CATALOG.find((g) => g.tokenText === currentConcept)?.emoji || "🖐️"}
                </span>
                <div>
                  <span className="text-[9px] uppercase font-mono text-emerald-400 block -mb-0.5">
                    Detected Concept
                  </span>
                  <span className="text-xs font-bold text-white font-mono">
                    {currentConcept}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* HUD Top-Right: Hold-to-Lock Radial Ring */}
          {isCameraActive && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 pointer-events-none z-20">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 shadow-lg">
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      strokeDasharray={`${holdProgress}, 100`}
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="#10b981"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-slate-300">
                  {holdProgress > 0 ? `Locking ${holdProgress}%` : "Hold 600ms"}
                </span>
              </div>
            </div>
          )}

          {/* Mode Pill Bottom */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900/85 text-cyan-300 border border-cyan-800/50 backdrop-blur-md">
              {isCameraActive ? "Webcam Live • Face & Hand Skeleton Active" : "Interactive Simulation Active"}
            </span>
          </div>
        </div>

        {/* Camera Warning notification if unavailable */}
        {cameraError && (
          <div className="mt-2.5 p-2 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">{cameraError}</span>
          </div>
        )}

        {/* Floating Camera Toolbar */}
        <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
          <button
            onClick={isCameraActive ? handleStopCamera : handleStartCamera}
            className={`py-2 px-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isCameraActive
                ? "bg-rose-950/80 text-rose-300 border border-rose-800/60 hover:bg-rose-900"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
            }`}
          >
            {isCameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
            <span>{isCameraActive ? "Stop" : "Live Cam"}</span>
          </button>

          <button
            onClick={() => setShowSkeleton(!showSkeleton)}
            className={`py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
              showSkeleton
                ? "bg-slate-900 text-cyan-300 border-cyan-800/60"
                : "bg-slate-950 text-slate-500 border-slate-800"
            }`}
            title="Toggle Skeleton Overlay"
          >
            {showSkeleton ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Skeleton</span>
          </button>

          <button
            onClick={onToggleAutoSpeak}
            className={`py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
              autoSpeak
                ? "bg-slate-900 text-emerald-300 border-emerald-800/60"
                : "bg-slate-950 text-slate-500 border-slate-800"
            }`}
            title="Auto-speak when token locks"
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Auto-TTS</span>
          </button>

          <button
            onClick={handleCaptureSnapshot}
            disabled={!isCameraActive}
            className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            title="Capture frame snapshot for Gemini"
          >
            <Aperture className="w-3.5 h-3.5" />
            <span>Snapshot</span>
          </button>
        </div>
      </div>

      {/* Visual Gesture Cheat Sheet Drawer */}
      <GestureCheatSheet onSelectGesture={onLockGestureToken} />

      {/* 4 One-Click Demo Simulation Buttons */}
      <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-800/80">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
            4 One-Click Demo Simulations
          </h3>
        </div>
        <p className="text-[11px] text-slate-400 mb-2">
          Zero-webcam testing across clinical, pharmacy, and banking domains:
        </p>

        <div className="space-y-1.5 overflow-y-auto">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset)}
              className="w-full text-left p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-xs text-white group-hover:text-amber-300">
                  {preset.title}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-300">
                  {preset.scenario.split(" ")[1]}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1 mb-1">
                {preset.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {preset.tokens.slice(0, 3).map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-950 text-slate-300 border border-slate-800"
                  >
                    {t.split(" / ")[0]}
                  </span>
                ))}
                {preset.tokens.length > 3 && (
                  <span className="text-[9px] font-mono text-slate-500">
                    +{preset.tokens.length - 3} more
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
