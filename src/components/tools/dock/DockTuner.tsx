"use client";

import { useState } from "react";
import Link from "next/link";
import { Mic, Square, ExternalLink } from "lucide-react";
import { useTuner } from "@/hooks/useTuner";
import { useWakeLock } from "@/hooks/useWakeLock";
import { cn } from "@/lib/utils";

export function DockTuner() {
  const { isListening, startListening, stopListening, detectedNote } = useTuner();
  const [micConsentGiven, setMicConsentGiven] = useState(false);

  useWakeLock(isListening);

  const handleToggle = () => {
    if (isListening) {
      stopListening();
      return;
    }
    if (!micConsentGiven) {
      setMicConsentGiven(true);
    }
    startListening();
  };

  const isInTune = detectedNote && Math.abs(detectedNote.cents) < 5;

  return (
    <div className="py-3 px-1 space-y-2">
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          aria-label={isListening ? "Stop tuner" : "Start tuner"}
          className="shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          {isListening ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-4 w-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground font-medium">Tuner</div>
          {isListening && detectedNote ? (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "font-mono font-bold text-sm",
                  isInTune ? "text-emerald-500" : "text-foreground",
                )}
              >
                {detectedNote.note}
                {detectedNote.octave}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {detectedNote.cents > 0 ? "+" : ""}
                {Math.round(detectedNote.cents)}&cent;
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">
              {isListening ? "Listening…" : "Tap mic to start"}
            </span>
          )}
        </div>

        <Link
          href="/tools/tuner"
          aria-label="Open full tuner"
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {!micConsentGiven && !isListening && (
        <p className="text-[11px] text-muted-foreground leading-snug pl-12 pr-2">
          Uses your microphone to detect pitch — analyzed locally, never recorded.
        </p>
      )}
    </div>
  );
}
