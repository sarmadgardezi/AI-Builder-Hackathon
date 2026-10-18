"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Eye,
  Languages,
  LayoutGrid,
  Clock,
  Code2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import type { AgentStepTrace, Scenario } from "@/lib/gesture-types";

interface AgentTraceColumnProps {
  steps: AgentStepTrace[];
  isTranslating: boolean;
  activeStepIndex: number;
  currentScenario: Scenario;
}

export function AgentTraceColumn({
  steps,
  isTranslating,
  activeStepIndex,
  currentScenario,
}: AgentTraceColumnProps) {
  const [expandedJsonIndex, setExpandedJsonIndex] = useState<number | null>(null);
  const [expandedAnalysisIndex, setExpandedAnalysisIndex] = useState<number | null>(null);

  const getAgentTheme = (agentId: string) => {
    switch (agentId) {
      case "agent1_gloss":
        return {
          icon: <Eye className="w-4 h-4 text-cyan-400" />,
          badge: "bg-cyan-950/70 text-cyan-300 border-cyan-800/50",
          border: "border-cyan-500/30",
          glow: "shadow-cyan-500/10",
          gradient: "from-cyan-950/20 to-transparent",
        };
      case "agent2_bilingual":
        return {
          icon: <Languages className="w-4 h-4 text-emerald-400" />,
          badge: "bg-emerald-950/70 text-emerald-300 border-emerald-800/50",
          border: "border-emerald-500/30",
          glow: "shadow-emerald-500/10",
          gradient: "from-emerald-950/20 to-transparent",
        };
      case "agent3_reverse":
      default:
        return {
          icon: <LayoutGrid className="w-4 h-4 text-purple-400" />,
          badge: "bg-purple-950/70 text-purple-300 border-purple-800/50",
          border: "border-purple-500/30",
          glow: "shadow-purple-500/10",
          gradient: "from-purple-950/20 to-transparent",
        };
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* 3-Agent Stepper Pipeline Card */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="font-semibold text-sm text-slate-200">
              3-Agent Contextual Intent Engine
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
            {currentScenario}
          </span>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {[
            { id: "agent1_gloss", label: "1. Spatial Gloss", color: "cyan" },
            { id: "agent2_bilingual", label: "2. Bilingual Synthesizer", color: "emerald" },
            { id: "agent3_reverse", label: "3. Reverse Sign Cards", color: "purple" },
          ].map((agent, index) => {
            const isCompleted = steps.length > index;
            const isCurrent = isTranslating && activeStepIndex === index;

            return (
              <div
                key={agent.id}
                className={`py-2 px-1.5 rounded-xl border text-[11px] font-medium transition-all ${
                  isCurrent
                    ? "bg-cyan-950/40 border-cyan-500 text-white shadow-md animate-pulse"
                    : isCompleted
                    ? "bg-slate-900/80 border-slate-700/80 text-slate-200"
                    : "bg-slate-950/40 border-slate-800/50 text-slate-500"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  ) : null}
                  <span className="truncate">{agent.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Reasoning Feed */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Live Agentic Reasoning Trace
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {steps.length} of 3 Agents Executed
          </span>
        </div>

        <div className="overflow-y-auto flex-1 pr-1 space-y-3">
          {/* Empty state */}
          {steps.length === 0 && !isTranslating && (
            <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center p-6 text-slate-400 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 mb-3 shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-200 text-sm mb-1">
                3-Agent Pipeline Idle
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
                Add gesture tokens via the camera or tap <strong className="text-emerald-400">&quot;1-Click Judge Demo&quot;</strong> above to watch Agent 1 (Gloss), Agent 2 (Bilingual Voice), and Agent 3 (Reverse Sign Cards) reason in sequence.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  ⚡ 21 Landmark 3D Rig
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  🇵🇰 English & Nastaliq Urdu
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  🫵 Reverse Sign-Gloss
                </span>
              </div>
            </div>
          )}

          {/* Active Steps */}
          {steps.map((step, idx) => {
            const theme = getAgentTheme(step.agentId);
            const isJsonExpanded = expandedJsonIndex === idx;
            const isAnalysisExpanded = expandedAnalysisIndex === idx;

            return (
              <div
                key={step.agentId + idx}
                className={`rounded-2xl border p-3.5 bg-gradient-to-b ${theme.gradient} ${theme.border} shadow-lg ${theme.glow}`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      {theme.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-white">
                        {step.agentName}
                      </h4>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${theme.badge}`}>
                        {step.agentRole}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="text-emerald-400 font-semibold">{step.confidenceScore}%</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{step.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-200 font-medium leading-relaxed mb-2.5">
                  {step.summary}
                </p>

                {/* Key Outputs */}
                {step.keyOutputs && step.keyOutputs.length > 0 && (
                  <div className="space-y-1.5 mb-2.5">
                    {step.keyOutputs.map((item, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-xl text-xs font-mono border flex flex-col gap-0.5 ${
                          item.highlight
                            ? "bg-slate-900/90 text-cyan-300 border-cyan-800/60"
                            : "bg-slate-950/60 text-slate-300 border-slate-800/80"
                        }`}
                      >
                        <span className="text-[10px] uppercase text-slate-400 font-sans tracking-wider">
                          {item.label}:
                        </span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* In-depth Analysis Accordion */}
                {step.detailedAnalysis && (
                  <div className="pt-2 border-t border-slate-800/50">
                    <button
                      onClick={() => setExpandedAnalysisIndex(isAnalysisExpanded ? null : idx)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                    >
                      {isAnalysisExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      <span>{isAnalysisExpanded ? "Hide Detailed Reasoning" : "View Agent Reasoning"}</span>
                    </button>
                    {isAnalysisExpanded && (
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                        {step.detailedAnalysis}
                      </div>
                    )}
                  </div>
                )}

                {/* Inspect Raw JSON Drawer */}
                <div className="mt-2 text-right">
                  <button
                    onClick={() => setExpandedJsonIndex(isJsonExpanded ? null : idx)}
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-cyan-300"
                  >
                    <Code2 className="w-3 h-3" />
                    <span>{isJsonExpanded ? "Hide JSON Payload" : "Inspect Raw JSON"}</span>
                  </button>
                  {isJsonExpanded && (
                    <div className="mt-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-left overflow-x-auto text-[10px] font-mono text-cyan-200">
                      <pre>{JSON.stringify(step, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Running indicator */}
          {isTranslating && (
            <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 animate-pulse flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-emerald-200">
                  Agent #{activeStepIndex + 1} Synthesizing Intent...
                </p>
                <span className="text-[11px] text-slate-400">
                  {activeStepIndex === 0 && "Parsing gesture landmarks & grammatical Sign Gloss..."}
                  {activeStepIndex === 1 && "Synthesizing polite English and Nastaliq Urdu spoken sentence..."}
                  {activeStepIndex === 2 && "Formulating reverse visual Sign-Language order cards..."}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
