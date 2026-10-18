"use client";

import React from "react";
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Download,
  Scale,
} from "lucide-react";
import type { Claim, AdjudicationVerdict, AgentDebateStep } from "@/lib/sample-claims";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: Claim;
  verdict: AdjudicationVerdict;
  steps: AgentDebateStep[];
}

export function ReportModal({
  isOpen,
  onClose,
  claim,
  verdict,
  steps,
}: ReportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify({ claim, verdict, steps }, null, 2)
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `VeriClaim-Audit-${claim.claimNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-slate-200">
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">
              Official Claims Adjudication Dossier
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON Dossier</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Document Content */}
        <div className="space-y-6 text-xs" id="printable-report">
          {/* Document Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold">
                PAK-TAKAFUL AUTO UNDERWRITING & CLAIMS AUDIT
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1">
                ADJUDICATED CLAIM AUDIT REPORT
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Multi-Agent Forensic Adjudication Engine • Google AI Builder Cup (BFSI)
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-300 block">
                Ref: {claim.claimNumber}
              </span>
              <span className="text-[11px] text-slate-400">
                Audited: {new Date(verdict.auditTimestamp).toLocaleDateString()}
              </span>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-950 text-indigo-300 border border-indigo-800">
                {verdict.verdictStatus.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Dossier Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Insured</span>
              <p className="font-semibold text-slate-200">{claim.policyHolder}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Policy</span>
              <p className="font-semibold text-slate-200 font-mono">{claim.policyNumber}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Vehicle</span>
              <p className="font-semibold text-slate-200">{claim.vehicleYear} {claim.vehicleMakeModel}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Registration</span>
              <p className="font-semibold text-slate-200 font-mono">{claim.vehicleRegNumber}</p>
            </div>
          </div>

          {/* Incident & Forensic Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Forensic Executive Summary
            </h4>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 leading-relaxed">
              <p>{verdict.executiveSummary}</p>
            </div>
          </div>

          {/* Financial Settlement Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Itemized Line-Item Settlement
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-right">Billed (PKR)</th>
                    <th className="p-2.5 text-right">Approved (PKR)</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {verdict.lineItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/30">
                      <td className="p-2.5">
                        <p className="font-medium text-slate-200">{item.item}</p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {item.reasonAndCitation}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-400">{item.category}</td>
                      <td className="p-2.5 text-right font-mono text-slate-300">
                        {item.claimedPkr.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-400">
                        {item.approvedPkr.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                            item.status === "APPROVED"
                              ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                              : item.status === "REJECTED"
                              ? "bg-rose-950 text-rose-300 border-rose-800"
                              : "bg-amber-950 text-amber-300 border-amber-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Totals Reconciliation */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono">
            <div>
              <span className="text-[10px] text-slate-400 font-sans uppercase block mb-1">
                Claimed Workshop Total
              </span>
              <p className="text-sm font-bold text-slate-200">
                PKR {verdict.claimedTotalPkr.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 font-sans uppercase block mb-1">
                Approved Payout
              </span>
              <p className="text-sm font-bold text-emerald-400">
                PKR {verdict.approvedPayoutPkr.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-rose-400 font-sans uppercase block mb-1">
                Fraud Prevented
              </span>
              <p className="text-sm font-bold text-rose-400">
                PKR {verdict.totalSavedFromFraudPkr.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-4 border-t border-slate-800 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-semibold text-xs text-slate-200">
                  {verdict.adjudicatorSignoff}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Cryptographically logged to audit ledger • Powered by Google Antigravity & Gemini 2.5 Flash
              </p>
            </div>

            <div className="text-center p-2 rounded-xl border border-indigo-500/40 bg-indigo-950/30">
              <span className="text-[9px] uppercase font-mono tracking-widest text-indigo-300 block">
                VERICLAIM OFFICIAL SEAL
              </span>
              <span className="text-[11px] font-bold text-white font-mono">
                RISK: {verdict.fraudRiskScore}/100
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
