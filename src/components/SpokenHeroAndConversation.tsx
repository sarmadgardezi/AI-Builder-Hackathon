"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Trash2,
  Send,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  RotateCcw,
  Sliders,
  Hand,
  CheckCircle,
  CornerDownRight,
  HelpCircle,
} from "lucide-react";
import { AudioEqualizer } from "./AudioEqualizer";

export interface SignGlossCardItem {
  id: string;
  glossText: string;
  meaning: string;
  emoji: string;
}

interface SpokenHeroAndConversationProps {
  tokens: string[];
  onClearTokens: () => void;
  onInterpret: () => void;
  isProcessing: boolean;
  englishSentence: string;
  urduScript: string;
  romanUrdu: string;
  urgencyLevel: string;
  reverseCards: SignGlossCardItem[];
  quickReplies: string[];
  onSelectQuickReply: (reply: string) => void;
  onSendHearingReply: (reply: string) => void;
}

export function SpokenHeroAndConversation({
  tokens,
  onClearTokens,
  onInterpret,
  isProcessing,
  englishSentence,
  urduScript,
  romanUrdu,
  urgencyLevel,
  reverseCards,
  quickReplies,
  onSelectQuickReply,
  onSendHearingReply,
}: SpokenHeroAndConversationProps) {
  const [replyInput, setReplyInput] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [showAudioControls, setShowAudioControls] = useState<boolean>(false);

  // Play audio aloud via Web Speech API
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.lang = "en-US";

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Toggle speech recognition for hearing partner
  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Please type directly.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setReplyInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleHearingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    onSendHearingReply(replyInput.trim());
    setReplyInput("");
  };

  const isUrgent = urgencyLevel === "HIGH" || urgencyLevel === "CRITICAL";

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Captured Gesture Token Stream */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Gesture Sentence Builder Stream ({tokens.length})
            </h3>
          </div>
          {tokens.length > 0 && (
            <button
              onClick={onClearTokens}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 p-1 rounded hover:bg-slate-800/60 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Tokens horizontal scroll */}
        <div className="min-h-[50px] p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          {tokens.length === 0 ? (
            <p className="text-xs text-slate-500 italic px-2">
              Wave in front of camera, tap cheat-sheet gestures, or click a simulation preset...
            </p>
          ) : (
            tokens.map((token, idx) => (
              <div
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 font-mono text-xs whitespace-nowrap flex items-center gap-1 shadow-sm"
              >
                <span>{token}</span>
                {idx < tokens.length - 1 && (
                  <span className="text-slate-600 font-bold ml-1">+</span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Interpret & Speak Now CTA */}
        <button
          onClick={onInterpret}
          disabled={tokens.length === 0 || isProcessing}
          className={`mt-3 w-full py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
            tokens.length === 0
              ? "bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800"
              : isProcessing
              ? "bg-slate-800 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-slate-950 shadow-emerald-500/20 active:scale-[0.99]"
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span>Synthesizing Voice & Translation...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 fill-current" />
              <span>Interpret & Speak Now</span>
            </>
          )}
        </button>
      </div>

      {/* Primary Spoken Output Hero Card */}
      <div
        className={`glass-panel rounded-2xl p-4 border transition-all ${
          isUrgent ? "border-rose-500/40 shadow-lg shadow-rose-500/10" : "border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Primary Spoken Output Hero Card
            </h2>
          </div>
          {urgencyLevel && (
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isUrgent
                  ? "bg-rose-950/70 text-rose-300 border-rose-800/60 animate-pulse"
                  : "bg-emerald-950/70 text-emerald-300 border-emerald-800/60"
              }`}
            >
              Urgency: {urgencyLevel}
            </span>
          )}
        </div>

        {/* English Hero Output */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 mb-3">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
            English Spoken Translation:
          </span>
          <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
            {englishSentence ? `“${englishSentence}”` : "“Awaiting gesture sequence...”"}
          </p>
        </div>

        {/* Urdu Script Translation Card (Clean font layout) */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-right mb-3">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1 text-left">
            اردو ترجمہ (Live Urdu Script):
          </span>
          <p className="text-base sm:text-lg font-semibold text-emerald-300 leading-relaxed" dir="rtl">
            {urduScript || "اشاروں کا انتظار ہے..."}
          </p>
          {romanUrdu && (
            <p className="text-[11px] text-slate-400 italic text-left mt-1 font-mono">
              Pronunciation: {romanUrdu}
            </p>
          )}
        </div>

        {/* Audio Player Bar with Animated 24-Bar Soundwave Equalizer */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(englishSentence)}
                disabled={!englishSentence || isPlayingAudio}
                className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98]"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? "Speaking..." : "Replay Audio (TTS)"}</span>
              </button>

              <button
                onClick={() => speakText(romanUrdu || englishSentence)}
                disabled={!englishSentence || isPlayingAudio}
                className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-emerald-300 font-semibold text-xs border border-slate-700"
                title="Speak Roman Urdu"
              >
                <span>اردو بولیں</span>
              </button>
            </div>

            <button
              onClick={() => setShowAudioControls(!showAudioControls)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Voice controls"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 24-Bar Animated Audio Equalizer */}
          <AudioEqualizer isPlaying={isPlayingAudio} barCount={24} />

          {/* Audio pitch/rate controls drawer */}
          {showAudioControls && (
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-[11px] text-slate-400">
              <div>
                <label className="flex justify-between mb-1">
                  <span>Speed:</span>
                  <span className="font-mono text-white">{speechRate}x</span>
                </label>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between mb-1">
                  <span>Pitch:</span>
                  <span className="font-mono text-white">{speechPitch}</span>
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.05"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hearing Partner Reply Box (STT / Input) */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Hearing Partner Reply Box (Doctor / Clerk)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Two-Way Input
          </span>
        </div>

        <form onSubmit={handleHearingSubmit} className="flex flex-col gap-2">
          <div className="relative">
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder="Doctor reply (e.g. 'Do you have a fever or chest tightness?')..."
              className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans"
            />
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`absolute right-1.5 top-1.5 p-1 rounded-lg transition-colors ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title={isListening ? "Listening... click to stop" : "Speak reply via microphone"}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!replyInput.trim()}
            className="w-full py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send & Render Visual Sign Flashcards</span>
          </button>
        </form>
      </div>

      {/* Visual Sign-Gloss Flashcards & 1-Tap Quick Replies */}
      {reverseCards && reverseCards.length > 0 && (
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
                Visual Sign-Gloss Flashcards
              </h3>
            </div>
            <span className="text-[10px] text-purple-300 font-mono">
              Sign Language Grammar Order
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[160px] pr-1 mb-3">
            {reverseCards.map((card, i) => (
              <div
                key={card.id || i}
                className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-center flex flex-col items-center justify-center shadow-sm"
              >
                <span className="text-2xl mb-1">{card.emoji}</span>
                <span className="font-bold text-xs font-mono text-purple-300">
                  {card.glossText}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1">
                  {card.meaning}
                </span>
              </div>
            ))}
          </div>

          {/* 1-Tap Quick Replies */}
          {quickReplies && quickReplies.length > 0 && (
            <div className="mt-auto pt-2 border-t border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1.5">
                1-Tap Quick Replies for Deaf Communicator:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectQuickReply(qr)}
                    className="py-1 px-2.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
