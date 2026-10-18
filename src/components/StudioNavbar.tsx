"use client";

import React, { useState } from "react";
import {
  Radio,
  Sparkles,
  Zap,
  Key,
  CheckCircle,
  Stethoscope,
  Building2,
  Train,
  MessageSquare,
  ShieldCheck,
  X,
} from "lucide-react";
import type { ScenarioContext } from "@/lib/gesture-tokens";

interface StudioNavbarProps {
  currentScenario: ScenarioContext;
  onSelectScenario: (scenario: ScenarioContext) => void;
  isCameraActive: boolean;
  fps: number;
  engineMode: "FREE_DEMO_API" | "GEMINI_25_FLASH";
  onToggleEngineMode: (mode: "FREE_DEMO_API" | "GEMINI_25_FLASH") => void;
  customApiKey: string;
  onSaveCustomApiKey: (key: string) => void;
}

export function StudioNavbar({
  currentScenario,
  onSelectScenario,
  isCameraActive,
  fps,
  engineMode,
  onToggleEngineMode,
  customApiKey,
  onSaveCustomApiKey,
}: StudioNavbarProps) {
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [tempKey, setTempKey] = useState<string>(customApiKey);

  const scenarioTabs: ScenarioContext[] = [
    "🏥 Medical Triage",
    "🏦 Bank / Office",
    "🚌 Public Transit",
    "💬 General Chat",
  ];

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCustomApiKey(tempKey);
    setShowKeyModal(false);
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-6 py-2.5">
      <div className="max-w-[1780px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-3">
        {/* Brand & Live Status */}
        <div className="flex items-center justify-between w-full xl:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  IsharaAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Studio</span>
                </h1>
                <span className="hidden sm:inline text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  Sustainability & Social Impact
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Real-Time Camera Hand Gesture-to-Voice & Text AI Bridge
              </p>
            </div>
          </div>

          {/* Live Status indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border ${
                isCameraActive
                  ? "bg-emerald-950/50 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-900/80 text-slate-400 border-slate-700/60"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isCameraActive ? "bg-emerald-400 animate-ping" : "bg-slate-500"
                }`}
              />
              <span>
                {isCameraActive ? `Camera Active • ${fps} FPS MediaPipe WASM` : "Standby • Ready"}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Scenario Context Tabs */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto max-w-full">
          {scenarioTabs.map((scen) => {
            const isSelected = currentScenario === scen;
            return (
              <button
                key={scen}
                onClick={() => onSelectScenario(scen)}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <span>{scen}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Dual-Mode Engine Switcher */}
        <div className="flex items-center gap-2 w-full xl:w-auto justify-end">
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => onToggleEngineMode("FREE_DEMO_API")}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                engineMode === "FREE_DEMO_API"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-300" />
              <span>⚡ Free Demo API (Zero-Key)</span>
            </button>

            <button
              onClick={() => onToggleEngineMode("GEMINI_25_FLASH")}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                engineMode === "GEMINI_25_FLASH"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>✨ Gemini 2.5 Flash</span>
            </button>

            {/* Custom API Key Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              className="p-1.5 ml-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-purple-300 transition-colors"
              title="Configure Gemini API Key"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Inline API Key Popover Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                <h3 className="font-semibold text-sm text-white">Gemini 2.5 Flash API Configuration</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Paste your Gemini API key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-purple-400 underline">Google AI Studio</a>. If left blank, the app gracefully falls back to your server <code className="text-emerald-400 font-mono text-[11px]">.env.local</code> or the simulated agentic trace.
            </p>

            <form onSubmit={handleSaveKey} className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono"
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Save Key</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
