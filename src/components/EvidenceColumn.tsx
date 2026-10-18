"use client";

import React, { useState } from "react";
import {
  FileText,
  Car,
  AlertCircle,
  Eye,
  Shield,
  Layers,
  Plus,
  Trash2,
  Upload,
  Info,
  Maximize2,
  X,
} from "lucide-react";
import type { Claim, InvoiceItem } from "@/lib/sample-claims";

interface EvidenceColumnProps {
  claim: Claim;
  isCustomMode: boolean;
  onUpdateCustomClaim?: (updated: Claim) => void;
  onCustomImageUpload?: (base64: string) => void;
  customImagePreview?: string;
}

export function EvidenceColumn({
  claim,
  isCustomMode,
  onUpdateCustomClaim,
  onCustomImageUpload,
  customImagePreview,
}: EvidenceColumnProps) {
  const [showPolicyAccordion, setShowPolicyAccordion] = useState<boolean>(false);
  const [showImageZoom, setShowImageZoom] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<InvoiceItem["category"]>("Body & Paint");
  const [newItemAmount, setNewItemAmount] = useState("");

  const totalBilled = claim.invoiceItems.reduce((acc, it) => acc + it.claimedPkr, 0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemAmount || !onUpdateCustomClaim) return;
    const amount = parseInt(newItemAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    const newItem: InvoiceItem = {
      id: `custom-item-${Date.now()}`,
      item: newItemName.trim(),
      category: newItemCategory,
      claimedPkr: amount,
    };

    onUpdateCustomClaim({
      ...claim,
      invoiceItems: [...claim.invoiceItems, newItem],
    });

    setNewItemName("");
    setNewItemAmount("");
  };

  const handleRemoveItem = (id: string) => {
    if (!onUpdateCustomClaim) return;
    onUpdateCustomClaim({
      ...claim,
      invoiceItems: claim.invoiceItems.filter((i) => i.id !== id),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onCustomImageUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCustomImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Claim Dossier Header Card */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-indigo-400" />
            <h2 className="font-semibold text-sm text-slate-200">Claim Dossier & Evidence</h2>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
            {claim.claimNumber}
          </span>
        </div>

        {/* Vehicle & Policy Metadata Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Vehicle</span>
            <p className="font-semibold text-slate-100 truncate">
              {claim.vehicleYear} {claim.vehicleMakeModel}
            </p>
            <span className="text-[11px] text-slate-400 font-mono">{claim.vehicleRegNumber}</span>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Policyholder</span>
            <p className="font-semibold text-slate-100 truncate">{claim.policyHolder}</p>
            <span className="text-[11px] text-indigo-300 truncate block font-mono">{claim.policyNumber}</span>
          </div>

          <div className="col-span-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">Incident Type:</span>
              <span className="font-medium text-slate-200">{claim.incidentType}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">Location:</span>
              <span className="font-medium text-slate-300 truncate max-w-[200px]">{claim.incidentLocation}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Declared Impact:</span>
              <span className="font-semibold text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
                {claim.expectedDamageZone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Damage Telemetry Card */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 relative overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Damage Telemetry & Impact Map
            </h3>
          </div>
          <button
            onClick={() => setShowImageZoom(true)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 p-1 rounded hover:bg-slate-800/60"
            title="Inspect Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Damage Graphic or Uploaded Image */}
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 aspect-[16/9] flex items-center justify-center group">
          <div className="scanline pointer-events-none" />

          {isCustomMode && customImagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={customImagePreview}
              alt="Custom damage evidence"
              className="w-full h-full object-contain"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={claim.damageSvg}
              alt="Vehicle damage telemetry map"
              className="w-full h-full object-contain select-none"
            />
          )}

          {/* Interactive Inspection Overlay Badge */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] font-mono bg-slate-900/90 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800/50 backdrop-blur-md">
              Target Zone: {claim.expectedDamageZone}
            </span>
            <span className="text-[10px] font-mono bg-slate-900/90 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
              30 FPS Vector Map
            </span>
          </div>
        </div>

        {/* Custom Image Upload Input in Custom Mode */}
        {isCustomMode && (
          <div className="mt-3 p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/40">
            <label className="text-xs text-purple-200 font-medium flex items-center gap-1.5 mb-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>Upload Custom Damage Photo / Invoice Scan:</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-slate-400">
              Supports JPEG/PNG images for Gemini 2.5 Flash multimodal inspection.
            </p>
          </div>
        )}
      </div>

      {/* Itemized Workshop Invoice Table */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex-1 flex flex-col min-h-[220px]">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
              Workshop Repair Estimate
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {claim.workshopName.split(" ")[0]} ({claim.invoiceItems.length} lines)
          </span>
        </div>

        {/* Invoice Items List */}
        <div className="overflow-y-auto max-h-[220px] pr-1 space-y-1.5 text-xs">
          {claim.invoiceItems.map((item, idx) => {
            const isSuspectItem =
              item.item.toLowerCase().includes("front") ||
              item.item.toLowerCase().includes("xenon") ||
              item.item.toLowerCase().includes("grille");

            return (
              <div
                key={item.id}
                className={`p-2 rounded-xl flex items-center justify-between gap-2 border transition-colors ${
                  isSuspectItem && claim.riskTier === "HIGH"
                    ? "bg-rose-950/25 border-rose-800/40 text-rose-200"
                    : "bg-slate-900/50 border-slate-800/60 text-slate-200 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-slate-400 font-mono w-4">{idx + 1}.</span>
                  <div className="truncate">
                    <p className="font-medium text-xs truncate">{item.item}</p>
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-mono font-semibold text-slate-100">
                    PKR {item.claimedPkr.toLocaleString()}
                  </span>
                  {isCustomMode && (
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add custom item form in custom mode */}
        {isCustomMode && (
          <form onSubmit={handleAddItem} className="mt-3 pt-2 border-t border-slate-800 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="Part / Repair Name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <input
                type="number"
                placeholder="Amount (PKR)"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              className="py-1 px-3 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Invoice Line Item</span>
            </button>
          </form>
        )}

        {/* Total Billed Summary */}
        <div className="mt-auto pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-400 uppercase tracking-wider text-[11px]">Total Claimed:</span>
          <span className="text-base font-mono text-indigo-400">
            PKR {totalBilled.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Policy Rules Accordion */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-800 text-xs">
        <button
          onClick={() => setShowPolicyAccordion(!showPolicyAccordion)}
          className="w-full flex items-center justify-between text-slate-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-xs">Contract Policy Clauses ({claim.policyRules.length})</span>
          </div>
          <span className="text-[11px] text-indigo-400 font-medium">
            {showPolicyAccordion ? "Collapse" : "View Clauses"}
          </span>
        </button>

        {showPolicyAccordion && (
          <div className="mt-3 pt-2 border-t border-slate-800 space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {claim.policyRules.map((rule) => (
              <div key={rule.clauseNumber} className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 mb-0.5">
                  <span>{rule.clauseNumber}:</span>
                  <span>{rule.clauseTitle}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">{rule.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {showImageZoom && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white">Full-Resolution Damage Telemetry Schematic</h3>
              <button
                onClick={() => setShowImageZoom(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full aspect-[16/9] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isCustomMode && customImagePreview ? customImagePreview : claim.damageSvg}
                alt="Enlarged damage view"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
