"use client";

import React, { useState } from "react";
import { GESTURE_CATALOG, type GestureDefinition } from "@/lib/gesture-tokens";
import { BookOpen, Sparkles, ChevronDown, ChevronUp, Plus } from "lucide-react";

interface GestureCheatSheetProps {
  onSelectGesture: (tokenText: string) => void;
}

export function GestureCheatSheet({ onSelectGesture }: GestureCheatSheetProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 flex flex-col">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
            9 Supported Hand Signs & Custom Geometry
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/60 transition-colors"
          title="Toggle cheat sheet"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2.5">
          <p className="text-[11px] text-slate-400 mb-2">
            Hold sign for <strong className="text-emerald-400">600ms</strong> in front of camera or tap card to append:
          </p>

          <div className="grid grid-cols-3 gap-1.5 max-h-[190px] overflow-y-auto pr-1">
            {GESTURE_CATALOG.map((g) => (
              <button
                key={g.id}
                onClick={() => onSelectGesture(g.tokenText)}
                className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all group ${
                  g.isCustomRule
                    ? "bg-cyan-950/20 border-cyan-800/40 hover:border-cyan-400/60 hover:bg-cyan-950/40"
                    : "bg-slate-900/60 border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900"
                }`}
                title={`Click to add "${g.tokenText}" to sentence builder`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{g.emoji}</span>
                  {g.isCustomRule && (
                    <span className="text-[8px] font-mono uppercase px-1 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                      Rule
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-200 group-hover:text-emerald-300 line-clamp-1">
                    {g.tokenText.split(" / ")[0]}
                  </p>
                  <span className="text-[9px] text-slate-400 line-clamp-1 block">
                    {g.tokenText.split(" / ")[1] || g.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
