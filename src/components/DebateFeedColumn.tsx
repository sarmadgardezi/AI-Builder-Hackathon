"use client";

import React, { useState } from "react";
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Clock,
  Code2,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import type { AgentDebateStep } from "@/lib/sample-claims";

interface DebateFeedColumnProps {
  steps: AgentDebateStep[];
  isRunningAudit: boolean;
  activeAgentIndex: number;
}

export function DebateFeedColumn({
  steps,
  isRunningAudit,
  activeAgentIndex,
}: DebateFeedColumnProps) {
  const [expandedJsonIndex, setExpandedJsonIndex] = useState<number | null>(null);
  const [expandedDetailsIndex, setExpandedDetailsIndex] = useState<number | null>(null);

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case "inspector":
        return <Search className="w-4 h-4 text-cyan-400" />;
      case "advocate":
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case "auditor":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "adjudicator":
      default:
        return <Scale className="w-4 h-4 text-purple-400" />;
    }
  };

  const getAgentTheme = (agentId: string) => {
    switch (agentId) {
      case "inspector":
        return {
          border: "border-cyan-500/30",
          glow: "shadow-cyan-500/10",
          badgeBg: "bg-cyan-950/70 text-cyan-300 border-cyan-800/50",
          accentColor: "text-cyan-400",
          bgGradient: "from-cyan-950/20 to-transparent",
        };
      case "advocate":
        return {
          border: "border-emerald-500/30",
          glow: "shadow-emerald-500/10",
          badgeBg: "bg-emerald-950/70 text-emerald-300 border-emerald-800/50",
          accentColor: "text-emerald-400",
          bgGradient: "from-emerald-950/20 to-transparent",
        };
      case "auditor":
        return {
          border: "border-amber-500/40",
          glow: "shadow-amber-500/10",
          badgeBg: "bg-amber-950/70 text-amber-300 border-amber-800/50",
          accentColor: "text-amber-400",
          bgGradient: "from-amber-950/20 to-transparent",
        };
      case "adjudicator":
      default:
        return {
          border: "border-purple-500/40",
          glow: "shadow-purple-500/15",
          badgeBg: "bg-purple-950/70 text-purple-300 border-purple-800/50",
          accentColor: "text-purple-400",
          bgGradient: "from-purple-950/25 to-transparent",
        };
    }
  };

  const renderFindingBadge = (finding: { label: string; value: string; type?: string }, idx: number) => {
    let style = "bg-slate-800/70 text-slate-300 border-slate-700/60";
    if (finding.type === "positive") {
      style = "bg-emerald-950/60 text-emerald-300 border-emerald-700/40";
    } else if (finding.type === "danger") {
      style = "bg-rose-950/60 text-rose-300 border-rose-700/50";
    } else if (finding.type === "warning") {
      style = "bg-amber-950/60 text-amber-300 border-amber-700/40";
    }

    return (
      <div
        key={idx}
        className={`px-2 py-1 rounded-lg text-[11px] font-mono border flex items-center justify-between gap-2 ${style}`}
      >
        <span className="opacity-75">{finding.label}:</span>
        <span className="font-semibold truncate">{finding.value}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Courtroom Chamber Header & Stepper */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-400" />
            <h2 className="font-semibold text-sm text-slate-200">Adversarial Courtroom Chamber</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
              {isRunningAudit ? "Active Deliberation" : steps.length > 0 ? "Verdict In Record" : "Awaiting Audit"}
            </span>
          </div>
        </div>

        {/* 4-Agent Stage Stepper */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          {[
            { id: "inspector", label: "1. Inspector", color: "cyan" },
            { id: "advocate", label: "2. Advocate", color: "emerald" },
            { id: "auditor", label: "3. Auditor", color: "amber" },
            { id: "adjudicator", label: "4. Ruling", color: "purple" },
          ].map((agent, index) => {
            const isCompleted = steps.length > index;
            const isCurrent = isRunningAudit && activeAgentIndex === index;

            return (
              <div
                key={agent.id}
                className={`py-1.5 px-1 rounded-xl text-[11px] font-medium border transition-all ${
                  isCurrent
                    ? "bg-indigo-600/30 text-white border-indigo-500 shadow-md animate-pulse"
                    : isCompleted
                    ? "bg-slate-900/80 text-slate-200 border-slate-700/70"
                    : "bg-slate-950/40 text-slate-500 border-slate-800/50"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  ) : null}
                  <span className="truncate">{agent.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Debate Scroll Feed */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Cross-Examination Transcript
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {steps.length} of 4 Agents Argued
          </span>
        </div>

        <div className="overflow-y-auto flex-1 pr-1 space-y-3.5">
          {/* Empty State before audit */}
          {steps.length === 0 && !isRunningAudit && (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-6 text-slate-400 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-center text-indigo-400 mb-3 shadow-lg">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-200 text-sm mb-1">
                Courtroom In Recess
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
                Click <strong className="text-indigo-400">&quot;Run 4-Agent Audit&quot;</strong> in the top header or select a sample claim to watch the Evidence Inspector, Policy Advocate, Fraud Auditor, and Chief Adjudicator debate in real time.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  ⚡ Multimodal Vision
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  📜 Policy Cross-Checks
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  💰 PKR Fraud Triage
                </span>
              </div>
            </div>
          )}

          {/* Render Active Agent Arguments */}
          {steps.map((step, idx) => {
            const theme = getAgentTheme(step.agentId);
            const isJsonExpanded = expandedJsonIndex === idx;
            const isDetailsExpanded = expandedDetailsIndex === idx;

            return (
              <div
                key={step.agentId + idx}
                className={`rounded-2xl border p-3.5 bg-gradient-to-b ${theme.bgGradient} ${theme.border} shadow-lg ${theme.glow} transition-all`}
              >
                {/* Agent Header Row */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      {getAgentIcon(step.agentId)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold text-xs text-white">
                          {step.agentName}
                        </h4>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${theme.badgeBg}`}>
                          {step.agentRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{step.timestamp}</span>
                  </div>
                </div>

                {/* Agent Summary Argument */}
                <p className="text-xs text-slate-200 font-medium leading-relaxed mb-2.5">
                  &ldquo;{step.summary}&rdquo;
                </p>

                {/* Key Findings Chips */}
                {step.findings && step.findings.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2.5">
                    {step.findings.map((f, fIdx) => renderFindingBadge(f, fIdx))}
                  </div>
                )}

                {/* Policy Citations Pills */}
                {step.citations && step.citations.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                      Citations:
                    </span>
                    {step.citations.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-indigo-300 border border-indigo-900/60 font-mono truncate max-w-[260px]"
                        title={c}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expand Detailed Analysis Accordion */}
                {step.detailedAnalysis && (
                  <div className="mt-1 pt-2 border-t border-slate-800/40 text-xs">
                    <button
                      onClick={() =>
                        setExpandedDetailsIndex(isDetailsExpanded ? null : idx)
                      }
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {isDetailsExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Hide In-Depth Legal & Technical Argument</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Read Complete In-Depth Argument</span>
                        </>
                      )}
                    </button>

                    {isDetailsExpanded && (
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed space-y-1">
                        <p>{step.detailedAnalysis}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Expand Raw JSON Drawer */}
                <div className="mt-2 text-right">
                  <button
                    onClick={() =>
                      setExpandedJsonIndex(isJsonExpanded ? null : idx)
                    }
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-indigo-300 transition-colors"
                  >
                    <Code2 className="w-3 h-3" />
                    <span>{isJsonExpanded ? "Hide Structured Payload" : "Inspect Agent JSON"}</span>
                  </button>

                  {isJsonExpanded && (
                    <div className="mt-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-left overflow-x-auto text-[10px] font-mono text-indigo-200">
                      <pre>{JSON.stringify(step, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Running State Pulse indicator */}
          {isRunningAudit && activeAgentIndex < 4 && (
            <div className="p-4 rounded-2xl border border-indigo-500/40 bg-indigo-950/20 animate-pulse flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-indigo-200">
                  Agent #{activeAgentIndex + 1} Deliberating...
                </p>
                <span className="text-[11px] text-slate-400">
                  {activeAgentIndex === 0 && "Cross-examining impact zone against workshop invoice line items..."}
                  {activeAgentIndex === 1 && "Constructing customer coverage defense under Clause 4.2 & 6.1..."}
                  {activeAgentIndex === 2 && "Cross-auditing pre-existing damages and padded parts exclusions..."}
                  {activeAgentIndex === 3 && "Synthesizing final binding judgment and PKR financial triage..."}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
