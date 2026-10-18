"use client";

import React, { useState, useEffect, useCallback } from "react";
import { StudioNavbar } from "@/components/StudioNavbar";
import { LiveVisionStudio } from "@/components/LiveVisionStudio";
import {
  SpokenHeroAndConversation,
  type SignGlossCardItem,
} from "@/components/SpokenHeroAndConversation";
import {
  TelemetryAndHistory,
  type TelemetryStep,
  type ConversationLogEntry,
} from "@/components/TelemetryAndHistory";
import {
  type ScenarioContext,
  type DemoPreset,
  DEMO_PRESETS,
  synthesizeDeterministicEnglish,
} from "@/lib/gesture-tokens";
import { fetchLiveUrduTranslation } from "@/lib/mymemory-translate";
import { isFirebaseConfigured, logIsharaSession } from "@/lib/firebase";

export default function IsharaAIStudio() {
  const [currentScenario, setCurrentScenario] = useState<ScenarioContext>("🏥 Medical Triage");
  const [engineMode, setEngineMode] = useState<"FREE_DEMO_API" | "GEMINI_25_FLASH">("FREE_DEMO_API");
  const [customApiKey, setCustomApiKey] = useState<string>("");
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(30);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);

  // Gesture builder tokens
  const [tokens, setTokens] = useState<string[]>([
    "Hello / Excuse Me",
    "My Chest / Heart",
    "No / Experiencing Pain",
    "Two / Urgent Check",
    "Please Help Me",
  ]);

  // Output states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [englishSentence, setEnglishSentence] = useState<string>(
    "Hello, excuse me. I am experiencing severe chest and heart pain that has persisted for two days. Please help me urgently."
  );
  const [urduScript, setUrduScript] = useState<string>(
    "ہیلو، معاف کیجیئے گا۔ مجھے سینے میں شدید درد ہو رہا ہے جو دو دن سے جاری ہے۔ براہ کرم فوری مدد کریں۔"
  );
  const [romanUrdu, setRomanUrdu] = useState<string>(
    "Hello, maaf kijiye ga. Mujhay seenay mein shadeed dard ho raha hai jo do din se jaari hai. Barah-e-karam fori madad karein."
  );
  const [urgencyLevel, setUrgencyLevel] = useState<string>("HIGH");

  // Reverse Sign-Gloss cards & quick replies
  const [reverseCards, setReverseCards] = useState<SignGlossCardItem[]>([
    { id: "1", glossText: "[YOU]", meaning: "Addressee (You)", emoji: "🫵" },
    { id: "2", glossText: "[CHEST PAIN]", meaning: "Sternum Discomfort", emoji: "💔" },
    { id: "3", glossText: "[SPREAD LEFT ARM?]", meaning: "Pain Radiating", emoji: "🫲" },
    { id: "4", glossText: "[BREATHING HARD?]", meaning: "Shortness of Breath", emoji: "🫁" },
  ]);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "YES, SPREADS TO LEFT ARM",
    "NO, ONLY CHEST SORENESS",
    "HARD TO BREATHE",
  ]);

  // Telemetry & History
  const [telemetrySteps, setTelemetrySteps] = useState<TelemetryStep[]>([
    {
      id: "t-1",
      name: "MediaPipe 21 3D Hand Rig",
      service: "Client-side WASM & GPU Delegate",
      latencyMs: 14,
      status: "COMPLETED",
      summary: "30 FPS tracking with neon skeleton overlay and 600ms hold lock.",
    },
    {
      id: "t-2",
      name: "Free MyMemory REST Translation",
      service: "api.mymemory.translated.net",
      latencyMs: 82,
      status: "COMPLETED",
      summary: "Deterministic English grammar + live Urdu REST API translation.",
    },
    {
      id: "t-3",
      name: "Web Speech TTS & 24-Bar Soundwave",
      service: "window.speechSynthesis & AudioEqualizer",
      latencyMs: 8,
      status: "COMPLETED",
      summary: "Synthesized natural spoken voice audio with animated frequency bars.",
    },
  ]);
  const [totalLatencyMs, setTotalLatencyMs] = useState<number>(104);
  const [historyLogs, setHistoryLogs] = useState<ConversationLogEntry[]>([
    {
      id: "h-init-1",
      timestamp: "11:50:12",
      sender: "SIGNER",
      textEnglish:
        "Hello, excuse me. I am experiencing severe chest and heart pain that has persisted for two days. Please help me urgently.",
      textUrdu:
        "ہیلو، معاف کیجیئے گا۔ مجھے سینے میں شدید درد ہو رہا ہے جو دو دن سے جاری ہے۔ براہ کرم فوری مدد کریں۔",
      tokens: [
        "Hello / Excuse Me",
        "My Chest / Heart",
        "No / Experiencing Pain",
        "Two / Urgent Check",
        "Please Help Me",
      ],
      engineUsed: "⚡ Free Demo API (Zero-Key)",
    },
  ]);

  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(false);
  const [lastCapturedSnapshot, setLastCapturedSnapshot] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsFirebaseActive(isFirebaseConfigured());
  }, []);

  // Web Speech helper
  const triggerAutoSpeech = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore audio error
    }
  }, []);

  // Run Translation Pipeline (handles Mode A and Mode B)
  const executePipeline = async (
    currentTokens: string[],
    scenario: ScenarioContext,
    hearingReply?: string
  ) => {
    if (currentTokens.length === 0) return;
    setIsProcessing(true);
    const startMs = Date.now();

    try {
      if (engineMode === "FREE_DEMO_API") {
        // Mode A: Free Instant Demo API
        const synthesizedEnglish = synthesizeDeterministicEnglish(currentTokens, scenario);
        const transRes = await fetchLiveUrduTranslation(synthesizedEnglish);

        const isUrgent =
          synthesizedEnglish.toLowerCase().includes("pain") ||
          synthesizedEnglish.toLowerCase().includes("chest") ||
          synthesizedEnglish.toLowerCase().includes("help");

        setEnglishSentence(synthesizedEnglish);
        setUrduScript(transRes.urduText);
        setRomanUrdu(transRes.romanUrdu);
        setUrgencyLevel(isUrgent ? "HIGH" : "NORMAL");

        // Set reverse cards based on scenario
        if (scenario === "🏥 Medical Triage") {
          setReverseCards([
            { id: "1", glossText: "[YOU]", meaning: "Addressee (You)", emoji: "🫵" },
            { id: "2", glossText: "[CHEST PAIN]", meaning: "Chest/Heart Discomfort", emoji: "💔" },
            { id: "3", glossText: "[SPREAD TO ARM?]", meaning: "Pain Radiating", emoji: "🫲" },
            { id: "4", glossText: "[BREATHING HARD?]", meaning: "Shortness of Breath", emoji: "🫁" },
          ]);
          setQuickReplies([
            "YES, RADIATES TO LEFT ARM",
            "NO, ONLY CENTER CHEST",
            "DIFFICULTY BREATHING",
          ]);
        } else if (scenario === "🏦 Bank / Office") {
          setReverseCards([
            { id: "1", glossText: "[CNIC / ID]", meaning: "Identification", emoji: "🪪" },
            { id: "2", glossText: "[PASSBOOK]", meaning: "Account Book", emoji: "📖" },
            { id: "3", glossText: "[SIGNATURE]", meaning: "Verify", emoji: "✍️" },
          ]);
          setQuickReplies(["HERE IS MY CNIC", "HAVE PASSBOOK WITH ME", "NEED FORM HELP"]);
        } else {
          setReverseCards([
            { id: "1", glossText: "[QUESTION]", meaning: "Inquiry", emoji: "❓" },
            { id: "2", glossText: "[HOW ASSIST?]", meaning: "Assistance", emoji: "🤝" },
          ]);
          setQuickReplies(["THANK YOU", "WHERE IS PLATFORM?", "YES I AGREE"]);
        }

        const totalElapsed = Date.now() - startMs;
        setTotalLatencyMs(totalElapsed);

        setTelemetrySteps([
          {
            id: "t-1",
            name: "MediaPipe 21 3D Landmarks",
            service: "WASM / GPU Rig",
            latencyMs: 14,
            status: "COMPLETED",
            summary: `Locked ${currentTokens.length} gestures with 600ms hold debounce.`,
          },
          {
            id: "t-2",
            name: "Free MyMemory REST Translation",
            service: transRes.source,
            latencyMs: transRes.latencyMs,
            status: "COMPLETED",
            summary: `English smoothed via deterministic grammar. Urdu via ${transRes.source}.`,
          },
          {
            id: "t-3",
            name: "Web Speech TTS Audio",
            service: "SpeechSynthesis Engine",
            latencyMs: 8,
            status: "COMPLETED",
            summary: "Vocalized spoken translation with 24-bar soundwave visualizer.",
          },
        ]);

        if (autoSpeak) {
          triggerAutoSpeech(synthesizedEnglish);
        }

        // Add history log
        const newLog: ConversationLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          sender: "SIGNER",
          textEnglish: synthesizedEnglish,
          textUrdu: transRes.urduText,
          tokens: currentTokens,
          engineUsed: "⚡ Free Demo API (Zero-Key)",
        };
        setHistoryLogs((prev) => [newLog, ...prev.slice(0, 15)]);
      } else {
        // Mode B: Gemini 2.5 Flash Agentic Mode
        const res = await fetch("/api/gemini-interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tokens: currentTokens,
            scenario,
            webcamSnapshotBase64: lastCapturedSnapshot,
            customApiKey,
            hearingReply,
          }),
        });

        const data = await res.json();
        const totalElapsed = Date.now() - startMs;
        setTotalLatencyMs(totalElapsed);

        if (data.success) {
          setEnglishSentence(data.englishSentence);
          setUrduScript(data.urduScript);
          setRomanUrdu(data.romanUrdu);
          setUrgencyLevel(data.urgencyLevel || "NORMAL");
          if (data.reverseCards) setReverseCards(data.reverseCards);
          if (data.quickReplies) setQuickReplies(data.quickReplies);

          if (data.steps && data.steps.length > 0) {
            setTelemetrySteps(
              data.steps.map((s: any, idx: number) => ({
                id: `gemini-step-${idx}`,
                name: s.agentName,
                service: "Gemini 2.5 Flash (@google/genai)",
                latencyMs: Math.round(totalElapsed / data.steps.length),
                status: "COMPLETED",
                summary: s.summary,
                details: s.detailedAnalysis ? { analysis: s.detailedAnalysis } : undefined,
              }))
            );
          }

          if (autoSpeak && data.englishSentence) {
            triggerAutoSpeech(data.englishSentence);
          }

          const newLog: ConversationLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            sender: "SIGNER",
            textEnglish: data.englishSentence,
            textUrdu: data.urduScript,
            tokens: currentTokens,
            engineUsed: data.modelUsed,
          };
          setHistoryLogs((prev) => [newLog, ...prev.slice(0, 15)]);
        }
      }
      setIsProcessing(false);
    } catch (err) {
      console.error("Pipeline failure:", err);
      setIsProcessing(false);
    }
  };

  // Add locked token from camera or cheat sheet and finalize in real time with text & audio
  const handleLockGestureToken = (token: string) => {
    setTokens((prev) => {
      const updated = [...prev, token];
      // Immediately finalize text and audio in real time
      executePipeline(updated, currentScenario);
      return updated;
    });
  };

  const handleClearTokens = () => {
    setTokens([]);
    setEnglishSentence("");
    setUrduScript("");
    setRomanUrdu("");
    setUrgencyLevel("NORMAL");
  };

  // Apply one of the 4 demo simulation presets
  const handleApplyPreset = (preset: DemoPreset) => {
    setCurrentScenario(preset.scenario);
    setTokens([...preset.tokens]);
    executePipeline(preset.tokens, preset.scenario, preset.defaultDoctorReply);
  };

  // When hearing doctor replies
  const handleSendHearingReply = (reply: string) => {
    const hearingLog: ConversationLogEntry = {
      id: `hearing-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      sender: "HEARING_PARTNER",
      textEnglish: reply,
      engineUsed: "Two-Way Speech Recognition",
    };
    setHistoryLogs((prev) => [hearingLog, ...prev.slice(0, 15)]);
    executePipeline(tokens, currentScenario, reply);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <StudioNavbar
        currentScenario={currentScenario}
        onSelectScenario={setCurrentScenario}
        isCameraActive={isCameraActive}
        fps={fps}
        engineMode={engineMode}
        onToggleEngineMode={setEngineMode}
        customApiKey={customApiKey}
        onSaveCustomApiKey={setCustomApiKey}
      />

      {/* Main 12-Column Responsive Bento Grid Dashboard */}
      <main className="flex-1 max-w-[1780px] w-full mx-auto p-3 sm:p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* Left Bento Panel (5 Columns): Live Vision Studio */}
        <section className="lg:col-span-5 flex flex-col min-w-0">
          <LiveVisionStudio
            currentScenario={currentScenario}
            onLockGestureToken={handleLockGestureToken}
            onApplyPreset={handleApplyPreset}
            autoSpeak={autoSpeak}
            onToggleAutoSpeak={() => setAutoSpeak(!autoSpeak)}
            onCaptureSnapshot={setLastCapturedSnapshot}
            onUpdateFps={setFps}
            onCameraStatusChange={setIsCameraActive}
          />
        </section>

        {/* Center Bento Panel (4 Columns): Live Text, Audio & Translation Stage */}
        <section className="lg:col-span-4 flex flex-col min-w-0">
          <SpokenHeroAndConversation
            tokens={tokens}
            onClearTokens={handleClearTokens}
            onInterpret={() => executePipeline(tokens, currentScenario)}
            isProcessing={isProcessing}
            englishSentence={englishSentence}
            urduScript={urduScript}
            romanUrdu={romanUrdu}
            urgencyLevel={urgencyLevel}
            reverseCards={reverseCards}
            quickReplies={quickReplies}
            onSelectQuickReply={handleLockGestureToken}
            onSendHearingReply={handleSendHearingReply}
          />
        </section>

        {/* Right Bento Panel (3 Columns): Live AI Agent Telemetry & History */}
        <section className="lg:col-span-3 flex flex-col min-w-0">
          <TelemetryAndHistory
            telemetrySteps={telemetrySteps}
            historyLogs={historyLogs}
            totalLatencyMs={totalLatencyMs}
            isFirebaseActive={isFirebaseActive}
            engineMode={engineMode}
          />
        </section>
      </main>

      {/* Footer for Google AI Builder Cup */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-3 text-center text-xs text-slate-500">
        <div className="max-w-[1780px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            IsharaAI Studio • Google AI Builder Cup (Sustainability & Social Impact Track) • Engineered with{" "}
            <span className="text-cyan-400 font-medium">Google Antigravity</span>
          </p>
          <p className="font-mono text-[11px]">
            CV: <span className="text-slate-400">MediaPipe Vision WASM</span> | AI:{" "}
            <span className="text-slate-400">Free MyMemory API & Gemini 2.5 Flash</span> | Cloud:{" "}
            <span className="text-slate-400">Firebase App Hosting / Cloud Run</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
