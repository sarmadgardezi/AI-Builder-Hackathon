"use client";

import React, { useEffect, useState } from "react";

interface AudioEqualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export function AudioEqualizer({ isPlaying, barCount = 24 }: AudioEqualizerProps) {
  const [barHeights, setBarHeights] = useState<number[]>(
    Array.from({ length: barCount }, () => 15)
  );

  useEffect(() => {
    if (!isPlaying) {
      setBarHeights(Array.from({ length: barCount }, () => 12));
      return;
    }

    const interval = setInterval(() => {
      setBarHeights(
        Array.from({ length: barCount }, (_, i) => {
          // Create parabolic bell-curve frequency distribution with randomized jitter
          const center = barCount / 2;
          const distFromCenter = Math.abs(i - center);
          const baseHeight = Math.max(25, 95 - distFromCenter * 4.5);
          const jitter = Math.floor(Math.random() * 45) - 20;
          return Math.min(100, Math.max(15, baseHeight + jitter));
        })
      );
    }, 75);

    return () => clearInterval(interval);
  }, [isPlaying, barCount]);

  return (
    <div className="flex items-end justify-center gap-[3px] h-10 w-full px-2 py-1 bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-hidden">
      {barHeights.map((height, idx) => (
        <div
          key={idx}
          className={`flex-1 rounded-full transition-all duration-75 ${
            isPlaying
              ? "bg-gradient-to-t from-emerald-500 via-teal-400 to-cyan-300 shadow-sm shadow-emerald-500/20"
              : "bg-slate-800"
          }`}
          style={{
            height: `${height}%`,
            opacity: isPlaying ? 0.9 + (idx % 2) * 0.1 : 0.35,
          }}
        />
      ))}
    </div>
  );
}
