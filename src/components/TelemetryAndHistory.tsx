"use client";

import React, { useState } from "react";
import {
  Activity,
  Cpu,
  Clock,
  Database,
  History,
  CheckCircle2,
  Code2,
  ChevronDown,
  ChevronUp,
  Radio,
  Zap,
} from "lucide-react";

export interface TelemetryStep {
  id: string;
  name: string;
  service: string;
  latencyMs: number;
  status: "COMPLETED" | "RUNNING" | "STANDBY";
  summary: string;
  details?: Record<string, unknown>;
}

export interface ConversationLogEntry {
  id: string;
  timestamp: string;
  sender: "SIGNER" | "HEARING_PARTNER";
  textEnglish: string;
  textUrdu?: string;
  tokens?: string[];
  engineUsed: string;
}

interface TelemetryAndHistoryProps {
  telemetrySteps: TelemetryStep[];
  historyLogs: ConversationLogEntry[];
  totalLatencyMs: number;
  isFirebaseActive: boolean;
  engineMode: "FREE_DEMO_API" | "GEMINI_25_FLASH";
}

export function TelemetryAndHistory({
  telemetrySteps,
  historyLogs,
  totalLatencyMs,
  isFirebaseActive,
  engineMode,
}: TelemetryAndHistoryProps) {
  const [expandedJsonId, setExpandedJsonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"TELEMETRY" | "HISTORY">("TELEMETRY");

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Telemetry & Pipeline Header */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Live AI Pipeline Telemetry
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
            {totalLatencyMs}ms Total
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("TELEMETRY")}
            className={`py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "TELEMETRY"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Telemetry Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab("HISTORY")}
            className={`py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "HISTORY"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Session History ({historyLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex-1 flex flex-col overflow-hidden">
        {activeTab === "TELEMETRY" ? (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800/80">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Execution Stages ({engineMode === "FREE_DEMO_API" ? "Free REST API" : "Gemini 2.5 Flash"})
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                {isFirebaseActive ? "Firestore Synced" : "Local State Active"}
              </span>
            </div>

            {/* Steps list */}
            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
              {telemetrySteps.map((step, idx) => {
                const isJsonExpanded = expandedJsonId === step.id;

                return (
                  <div
                    key={step.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs transition-all hover:bg-slate-900"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 font-bold">
                          0{idx + 1}.
                        </span>
                        <h4 className="font-semibold text-slate-200">{step.name}</h4>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="text-cyan-300 font-bold">{step.latencyMs}ms</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Service: {step.service}</span>
                      <span className="text-emerald-400 uppercase">{step.status}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {step.summary}
                    </p>

                    {step.details && (
                      <div className="mt-2 text-right">
                        <button
                          onClick={() => setExpandedJsonId(isJsonExpanded ? null : step.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-cyan-300"
                        >
                          <Code2 className="w-3 h-3" />
                          <span>{isJsonExpanded ? "Hide Telemetry" : "Inspect Trace"}</span>
                        </button>
                        {isJsonExpanded && (
                          <div className="mt-1 p-2 rounded-lg bg-slate-950 border border-slate-800 text-left overflow-x-auto text-[10px] font-mono text-cyan-200">
                            <pre>{JSON.stringify(step.details, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800/80">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Conversation Turns Log
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {historyLogs.length} turns
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {historyLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-4 text-slate-500 italic text-xs">
                  No conversation turns recorded in this session yet.
                </div>
              ) : (
                historyLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded-xl border text-xs ${
                      log.sender === "SIGNER"
                        ? "bg-cyan-950/20 border-cyan-800/40"
                        : "bg-purple-950/20 border-purple-800/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.2 rounded border ${
                          log.sender === "SIGNER"
                            ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                            : "bg-purple-950 text-purple-300 border-purple-800"
                        }`}
                      >
                        {log.sender === "SIGNER" ? "Deaf Signer" : "Hearing Partner"}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        {log.timestamp}
                      </span>
                    </div>

                    <p className="font-medium text-slate-200 text-xs mb-0.5">
                      {log.textEnglish}
                    </p>
                    {log.textUrdu && (
                      <p className="text-[11px] text-emerald-300 text-right font-sans" dir="rtl">
                        {log.textUrdu}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
