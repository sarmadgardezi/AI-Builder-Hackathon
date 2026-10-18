"use client";

import React from "react";
import {
  Gavel,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Share2,
  FileSpreadsheet,
  Coins,
  TrendingDown,
  ExternalLink,
  Award,
} from "lucide-react";
import type { AdjudicationVerdict } from "@/lib/sample-claims";

interface AdjudicationColumnProps {
  verdict: AdjudicationVerdict | null;
  isRunningAudit: boolean;
  onOpenReportModal: () => void;
  persistedTo?: "FIRESTORE" | "LOCAL_STATE" | null;
}

export function AdjudicationColumn({
  verdict,
  isRunningAudit,
  onOpenReportModal,
  persistedTo,
}: AdjudicationColumnProps) {
  if (!verdict && !isRunningAudit) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 h-full flex flex-col items-center justify-center text-center text-slate-400">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 mb-3 shadow-lg">
          <Gavel className="w-7 h-7" />
        </div>
        <h3 className="font-semibold text-slate-200 text-sm mb-1">
          Binding Verdict Pending
        </h3>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
          The Chief Adjudicator issues the binding ruling, calculates the fraud risk gauge, and enforces line-item settlement upon completion of the 4-agent debate.
        </p>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5 w-full">
          <div className="flex justify-between">
            <span>Fraud Risk Gauge:</span>
            <span className="font-mono text-slate-500">Awaiting Analysis</span>
          </div>
          <div className="flex justify-between">
            <span>Financial Triage:</span>
            <span className="font-mono text-slate-500">Awaiting Analysis</span>
          </div>
          <div className="flex justify-between">
            <span>Audit Report:</span>
            <span className="font-mono text-slate-500">Awaiting Analysis</span>
          </div>
        </div>
      </div>
    );
  }

  if (isRunningAudit && !verdict) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-indigo-500/30 h-full flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4" />
        <h3 className="font-semibold text-indigo-300 text-sm mb-1">
          Adjudication In Progress
        </h3>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          The 4 specialized agents are debating evidence, policy coverage, and fraud exclusions. Formulating final binding ruling...
        </p>
      </div>
    );
  }

  if (!verdict) return null;

  const isHighRisk = verdict.fraudRiskScore >= 70;
  const isMediumRisk = verdict.fraudRiskScore >= 30 && verdict.fraudRiskScore < 70;
  const isLowRisk = verdict.fraudRiskScore < 30;

  // Gauge color parameters
  const strokeColor = isHighRisk ? "#f43f5e" : isMediumRisk ? "#f59e0b" : "#10b981";
  const statusBadgeColor = isHighRisk
    ? "bg-rose-950/70 text-rose-300 border-rose-800/60"
    : isMediumRisk
    ? "bg-amber-950/70 text-amber-300 border-amber-800/60"
    : "bg-emerald-950/70 text-emerald-300 border-emerald-800/60";

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Verdict Ruling Card */}
      <div
        className={`glass-panel rounded-2xl p-4 border transition-all ${
          isHighRisk ? "border-rose-500/40" : "border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Gavel className="w-4 h-4 text-purple-400" />
            <h2 className="font-semibold text-sm text-slate-200">Adjudication Ruling</h2>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusBadgeColor}`}>
            {verdict.verdictStatus.replace("_", " ")}
          </span>
        </div>

        {/* Risk Score Meter & Visual Radial Gauge */}
        <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/70 border border-slate-800 mb-3">
          <div className="flex items-center gap-3">
            {/* SVG Circle Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  strokeDasharray={`${verdict.fraudRiskScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke={strokeColor}
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold font-mono text-white">
                  {verdict.fraudRiskScore}
                </span>
                <span className="text-[8px] text-slate-400 font-mono -mt-0.5">/100</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Fraud Risk Index
              </span>
              <p
                className={`text-xs font-bold ${
                  isHighRisk ? "text-rose-400" : isMediumRisk ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {verdict.riskLevel}
              </p>
              <span className="text-[10px] text-slate-400">
                {isHighRisk ? "Significant padding detected" : "Admissible claims profile"}
              </span>
            </div>
          </div>

          {/* Sync Pill */}
          <div className="text-right">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/90 text-indigo-300 border border-slate-700/60 block mb-1">
              {persistedTo === "FIRESTORE" ? "Cloud Synced" : "Locally Recorded"}
            </span>
            <span className="text-[9px] text-slate-400 font-mono">
              Audit #{verdict.claimId}
            </span>
          </div>
        </div>

        {/* Financial Triage Cards */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block mb-0.5">Claimed Total</span>
            <span className="font-mono font-bold text-slate-200">
              PKR {verdict.claimedTotalPkr.toLocaleString()}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
            <span className="text-[10px] text-emerald-400 block mb-0.5">Approved Payout</span>
            <span className="font-mono font-bold text-emerald-300">
              PKR {verdict.approvedPayoutPkr.toLocaleString()}
            </span>
          </div>

          <div className={`p-2 rounded-xl border ${
            verdict.totalSavedFromFraudPkr > 0
              ? "bg-rose-950/30 border-rose-800/40"
              : "bg-slate-900/60 border-slate-800/60"
          }`}>
            <span className="text-[10px] text-rose-300 block mb-0.5">Fraud Prevented</span>
            <span className="font-mono font-bold text-rose-400">
              PKR {verdict.totalSavedFromFraudPkr.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Decision Table */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex-1 flex flex-col min-h-[220px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Line-Item Adjudication
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {verdict.lineItems.length} lines audited
          </span>
        </div>

        {/* Scrollable itemized lines */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-2 text-xs">
          {verdict.lineItems.map((item, idx) => {
            const isApproved = item.status === "APPROVED";
            const isRejected = item.status === "REJECTED";

            return (
              <div
                key={item.id + idx}
                className={`p-2.5 rounded-xl border text-xs transition-colors ${
                  isRejected
                    ? "bg-rose-950/20 border-rose-800/40"
                    : "bg-slate-900/60 border-slate-800/60"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-200 text-xs truncate">{item.item}</p>
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase flex-shrink-0 ${
                      isApproved
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                        : isRejected
                        ? "bg-rose-950 text-rose-300 border-rose-800"
                        : "bg-amber-950 text-amber-300 border-amber-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5 pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">
                    Billed: PKR {item.claimedPkr.toLocaleString()}
                  </span>
                  <span className={isApproved ? "text-emerald-400 font-bold" : isRejected ? "text-rose-400 line-through" : "text-amber-400 font-bold"}>
                    Payable: PKR {item.approvedPkr.toLocaleString()}
                  </span>
                </div>

                {/* Reason and citation */}
                <p className="text-[10px] text-slate-400 leading-relaxed bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                  {item.reasonAndCitation}
                </p>
              </div>
            );
          })}
        </div>

        {/* Executive Summary Snippet */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
          <p className="line-clamp-2 italic">
            &ldquo;{verdict.executiveSummary}&rdquo;
          </p>
        </div>

        {/* Export Approved Audit Report CTA */}
        <div className="mt-3 pt-2 border-t border-slate-800">
          <button
            onClick={onOpenReportModal}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 active:scale-[0.99] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Approved Audit Report (PDF / Print)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
