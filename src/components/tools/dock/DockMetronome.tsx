"use client";

import Link from "next/link";
import { Play, Square, Minus, Plus, ExternalLink } from "lucide-react";
import { useMetronome } from "@/hooks/useMetronome";
import { useWakeLock } from "@/hooks/useWakeLock";

export function DockMetronome() {
  const { isPlaying, start, stop, bpm, setBpm } = useMetronome();

  useWakeLock(isPlaying);

  return (
    <div className="flex items-center gap-3 py-3 px-1">
      <button
        onClick={isPlaying ? stop : start}
        aria-label={isPlaying ? "Stop metronome" : "Start metronome"}
        className="shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        {isPlaying ? <Square className="h-3.5 w-3.5" /> : <Play className="h-4 w-4 ml-0.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground font-medium">Metronome</div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setBpm(Math.max(30, bpm - 1))}
            aria-label="Decrease BPM"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono font-bold text-sm tabular-nums w-10 text-center">
            {bpm}
          </span>
          <button
            onClick={() => setBpm(Math.min(300, bpm + 1))}
            aria-label="Increase BPM"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <Link
        href="/tools/metronome"
        aria-label="Open full metronome"
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
