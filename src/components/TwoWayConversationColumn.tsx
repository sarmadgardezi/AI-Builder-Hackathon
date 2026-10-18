"use client";

import React, { useState, useEffect } from "react";
import {
  Volume2,
  Mic,
  MicOff,
  Send,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Hand,
  CornerDownRight,
  MessageCircle,
} from "lucide-react";
import type { TranslationResult, SignGlossCard } from "@/lib/gesture-types";

interface TwoWayConversationColumnProps {
  translation: TranslationResult | null;
  onSendHearingReply: (replyText: string) => void;
  onQuickReplySelect: (reply: string) => void;
  isTranslating: boolean;
}

export function TwoWayConversationColumn({
  translation,
  onSendHearingReply,
  onQuickReplySelect,
  isTranslating,
}: TwoWayConversationColumnProps) {
  const [replyInput, setReplyInput] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Web Speech API: Text-to-Speech (TTS)
  const speakText = (text: string, lang: "en-US" | "ur-PK" = "en-US") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeechError("Speech synthesis is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Web Speech API: Speech-to-Text (STT) via webkitSpeechRecognition
  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Speech recognition not supported in this browser. Please type directly.");
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

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setReplyInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition event error:", event);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Recognition start failed:", err);
      setIsListening(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    onSendHearingReply(replyInput.trim());
    setReplyInput("");
  };

  // If no translation yet
  if (!translation && !isTranslating) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 h-full flex flex-col items-center justify-center text-center text-slate-400">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-3 shadow-lg">
          <MessageCircle className="w-7 h-7" />
        </div>
        <h3 className="font-semibold text-slate-200 text-sm mb-1">
          Two-Way Voice & Sign Bridge
        </h3>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
          Once the Deaf user performs gestures or a simulation preset is run, this card renders spoken English, Urdu Nastaliq, audio TTS, and reverse visual sign order cards.
        </p>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5 w-full">
          <div className="flex justify-between">
            <span>Voice Synthesizer:</span>
            <span className="font-mono text-slate-500">Ready</span>
          </div>
          <div className="flex justify-between">
            <span>Bilingual Languages:</span>
            <span className="font-mono text-emerald-400">English + اردو</span>
          </div>
          <div className="flex justify-between">
            <span>Reverse Sign Visualizer:</span>
            <span className="font-mono text-purple-400">Ready</span>
          </div>
        </div>
      </div>
    );
  }

  const isUrgent =
    translation?.urgencyLevel === "High" || translation?.urgencyLevel === "Critical";

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Signer Output Card (Voice & Bilingual Bridge) */}
      <div
        className={`glass-panel rounded-2xl p-4 border transition-all ${
          isUrgent ? "border-rose-500/40" : "border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-sm text-slate-200">Signer Spoken Translation</h2>
          </div>
          {translation && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isUrgent
                  ? "bg-rose-950/70 text-rose-300 border-rose-800/60 animate-pulse"
                  : "bg-emerald-950/70 text-emerald-300 border-emerald-800/60"
              }`}
            >
              Urgency: {translation.urgencyLevel}
            </span>
          )}
        </div>

        {translation ? (
          <div className="space-y-3">
            {/* English Sentence */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                English Spoken Output:
              </span>
              <p className="text-sm font-semibold text-white leading-relaxed">
                &ldquo;{translation.englishTranslation}&rdquo;
              </p>
            </div>

            {/* Urdu Script (Clean Nastaliq text) */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1 text-left">
                اردو ترجمہ (Urdu Nastaliq Script):
              </span>
              <p className="text-base font-medium text-emerald-300 leading-relaxed tracking-wide" dir="rtl">
                {translation.urduScript}
              </p>
              <p className="text-[11px] text-slate-400 italic text-left mt-1 font-mono">
                Pronunciation: {translation.romanUrdu}
              </p>
            </div>

            {/* TTS Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => speakText(translation.englishTranslation, "en-US")}
                disabled={isPlayingAudio}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 active:scale-[0.99]"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? "Playing..." : "Speak English (TTS)"}</span>
              </button>
              <button
                onClick={() => speakText(translation.romanUrdu, "en-US")}
                disabled={isPlayingAudio}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                title="Speak Roman Urdu"
              >
                <span>اردو بولیں</span>
              </button>
            </div>

            {/* Suggested Doctor / Desk Follow-Up Questions */}
            {translation.doctorFollowUpQuestions?.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider block mb-1.5">
                  Suggested Follow-Ups for Professional (Tap to send):
                </span>
                <div className="space-y-1">
                  {translation.doctorFollowUpQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendHearingReply(q)}
                      className="w-full text-left p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
                    >
                      <CornerDownRight className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Hearing Partner Reply Box (STT / Input) */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Hearing Partner Reply Box
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Doctor / Desk Officer
          </span>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
          <div className="relative">
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder="Doctor reply (e.g. 'Do you feel fever or difficulty breathing?')..."
              className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
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
            className="w-full py-1.5 px-3 rounded-xl bg-purple-600/90 hover:bg-purple-600 disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send & Render Visual Sign Cards</span>
          </button>
        </form>

        {speechError && (
          <p className="text-[10px] text-amber-400 mt-1.5">{speechError}</p>
        )}
      </div>

      {/* Reverse Sign-Gloss Order Cards & 1-Tap Quick Replies */}
      {translation && translation.reverseSignGlossCards?.length > 0 && (
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex-1 flex flex-col min-h-[220px]">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
                Reverse Sign-Gloss Visualizer
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Sign Language Word Order
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mb-2">
            Deconstructed topic-comment sign cards shown to the Deaf user:
          </p>

          {/* Sign Gloss Cards Grid */}
          <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[170px] pr-1 mb-3">
            {translation.reverseSignGlossCards.map((card, i) => (
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

          {/* 1-Tap Deaf Quick Replies */}
          {translation.quickReplies?.length > 0 && (
            <div className="mt-auto pt-2.5 border-t border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1.5">
                1-Tap Quick Replies for Deaf User:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {translation.quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => onQuickReplySelect(reply)}
                    className="py-1 px-2.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {reply}
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
