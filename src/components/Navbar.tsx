"use client";

import React from "react";
import {
  Sparkles,
  Database,
  Radio,
  Play,
  Volume2,
  Building2,
  Stethoscope,
  Train,
  MessageSquare,
  Flame,
} from "lucide-react";
import type { Scenario } from "@/lib/gesture-types";

interface NavbarProps {
  currentScenario: Scenario;
  onSelectScenario: (scenario: Scenario) => void;
  onRunJudgeDemo: () => void;
  isRunningDemo: boolean;
  isLiveGemini: boolean;
  isFirebaseActive: boolean;
}

export function Navbar({
  currentScenario,
  onSelectScenario,
  onRunJudgeDemo,
  isRunningDemo,
  isLiveGemini,
  isFirebaseActive,
}: NavbarProps) {
  const scenarios: { id: Scenario; label: string; icon: React.ReactNode }[] = [
    { id: "Hospital Triage", label: "Hospital Triage", icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { id: "Bank Counter", label: "Bank Counter", icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: "Public Transit", label: "Public Transit", icon: <Train className="w-3.5 h-3.5" /> },
    { id: "Daily Conversation", label: "Daily Chat", icon: <MessageSquare className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-2.5">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  Ishara <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Live</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Sustainability & Social Impact
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Agentic Multimodal Sign & Gesture Bridge
              </p>
            </div>
          </div>

          {/* Model Status Pills */}
          <div className="hidden xl:flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                isLiveGemini
                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30"
                  : "bg-cyan-950/40 text-cyan-300 border-cyan-500/30"
              }`}
            >
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>{isLiveGemini ? "Gemini 2.5 Flash (Live SDK)" : "Gemini 2.5 Flash (Adaptive Mode)"}</span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                isFirebaseActive
                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30"
                  : "bg-slate-900/60 text-slate-400 border-slate-700/50"
              }`}
            >
              <Database className="w-3 h-3 text-slate-400" />
              <span>{isFirebaseActive ? "Firestore Connected" : "Local State Active"}</span>
            </div>
          </div>
        </div>

        {/* Center / Right: Scenario Selector & 1-Click Judge Demo */}
        <div className="flex items-center flex-wrap md:flex-nowrap gap-2.5 w-full md:w-auto justify-end">
          {/* Scenario Selector Pills */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center text-xs overflow-x-auto">
            {scenarios.map((s) => {
              const isSelected = currentScenario === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectScenario(s.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  {s.icon}
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* 1-Click Judge Demo Button */}
          <button
            onClick={onRunJudgeDemo}
            disabled={isRunningDemo}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all ${
              isRunningDemo
                ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
                : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-slate-950 font-extrabold shadow-emerald-500/30 border border-emerald-400/40 active:scale-[0.98]"
            }`}
          >
            {isRunningDemo ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Running Demo...</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 fill-slate-950 text-slate-950 animate-bounce" />
                <span>1-Click Judge Demo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
