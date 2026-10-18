"use client";

import React from "react";
import {
  Scale,
  ShieldCheck,
  Sparkles,
  Database,
  Play,
  RotateCcw,
  Zap,
} from "lucide-react";
import type { Claim } from "@/lib/sample-claims";

interface HeaderProps {
  claims: Claim[];
  selectedClaimId: string;
  onSelectClaim: (claimId: string) => void;
  isCustomMode: boolean;
  onToggleCustomMode: (custom: boolean) => void;
  isRunningAudit: boolean;
  onRunAudit: () => void;
  onReset: () => void;
  isLiveGemini: boolean;
  isFirestoreConnected: boolean;
}

export function Header({
  claims,
  selectedClaimId,
  onSelectClaim,
  isCustomMode,
  onToggleCustomMode,
  isRunningAudit,
  onRunAudit,
  onReset,
  isLiveGemini,
  isFirestoreConnected,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Subtitle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  VeriClaim <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">AI</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  BFSI Track
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Adversarial 4-Agent Insurance Claim & Fraud Triage Engine
              </p>
            </div>
          </div>

          {/* Model & DB Status Pills */}
          <div className="hidden lg:flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                isLiveGemini
                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30"
                  : "bg-indigo-950/40 text-indigo-300 border-indigo-500/30"
              }`}
            >
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
              <span>{isLiveGemini ? "Gemini 2.5 Flash (Live SDK)" : "Gemini 2.5 Flash (Adaptive Mode)"}</span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                isFirestoreConnected
                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30"
                  : "bg-slate-900/60 text-slate-400 border-slate-700/50"
              }`}
            >
              <Database className="w-3 h-3 text-slate-400" />
              <span>{isFirestoreConnected ? "Firestore Live" : "Local State Cache"}</span>
            </div>
          </div>
        </div>

        {/* Claim Selector & Primary Action */}
        <div className="flex items-center flex-wrap md:flex-nowrap gap-2.5 w-full md:w-auto justify-end">
          {/* Claim Selector Pills */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            {claims.map((claim) => {
              const isSelected = !isCustomMode && selectedClaimId === claim.id;
              const isHighRisk = claim.riskTier === "HIGH";
              return (
                <button
                  key={claim.id}
                  onClick={() => {
                    onToggleCustomMode(false);
                    onSelectClaim(claim.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isHighRisk ? "bg-rose-400" : "bg-emerald-400"
                    }`}
                  />
                  <span>
                    #{claim.id.replace("claim-", "")} {claim.vehicleMakeModel.split(" ")[0]}
                  </span>
                  <span
                    className={`text-[10px] px-1 rounded ${
                      isHighRisk
                        ? "bg-rose-950/80 text-rose-300 border border-rose-800/50"
                        : "bg-emerald-950/80 text-emerald-300 border border-emerald-800/50"
                    }`}
                  >
                    {isHighRisk ? "Fraud Risk" : "Clean"}
                  </span>
                </button>
              );
            })}

            {/* Custom Claim Toggle */}
            <button
              onClick={() => onToggleCustomMode(true)}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
                isCustomMode
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-purple-300" />
              <span>Custom Upload</span>
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={onReset}
            disabled={isRunningAudit}
            title="Reset Audit Courtroom"
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800/80 transition-all disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Run 4-Agent Audit Button */}
          <button
            onClick={onRunAudit}
            disabled={isRunningAudit}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg transition-all ${
              isRunningAudit
                ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
                : "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 text-white shadow-indigo-500/25 border border-indigo-400/30 active:scale-[0.98]"
            }`}
          >
            {isRunningAudit ? (
              <>
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span>Courtroom in Session...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-white" />
                <span>Run 4-Agent Audit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
