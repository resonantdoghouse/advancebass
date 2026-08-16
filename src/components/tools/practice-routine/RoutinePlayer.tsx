"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Pause, Play, SkipForward, X, ExternalLink, PartyPopper } from "lucide-react";
import { useRoutinePlayer } from "@/hooks/useRoutinePlayer";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useToolKeyboard } from "@/hooks/useToolKeyboard";
import { KeyboardHints } from "@/components/tools/KeyboardHints";
import type { Routine } from "@/lib/practice-storage";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function RoutinePlayer({
  routine,
  onExit,
  onFinish,
}: {
  routine: Routine;
  onExit: () => void;
  onFinish: (totalMinutes: number) => void;
}) {
  const player = useRoutinePlayer(routine, onFinish);

  useWakeLock(player.isRunning);

  useToolKeyboard(
    {
      Space: () => (player.isRunning ? player.pause() : player.resume()),
      KeyN: () => player.skipToNext(),
    },
    player.isRunning || player.isPaused,
  );

  // Auto-start on mount
  const startedRef = useRef(false);
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      player.start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routine.id]);

  if (player.isFinished) {
    const totalMinutes = routine.blocks.reduce((sum, b) => sum + b.minutes, 0);
    return (
      <div className="w-full rounded-[22px] border border-border bg-card p-8 md:p-12 text-center space-y-6">
        <PartyPopper className="h-12 w-12 text-primary mx-auto" />
        <div>
          <h2 className="text-2xl font-bold">Routine complete</h2>
          <p className="text-muted-foreground mt-1">
            {routine.name} — {totalMinutes} minutes logged.
          </p>
        </div>
        <button
          onClick={onExit}
          className="px-6 py-3 rounded-[10px] bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Routines
        </button>
      </div>
    );
  }

  if (!player.currentBlock) return null;

  const blockTotalSeconds = player.currentBlock.minutes * 60;
  const progressPercent =
    ((blockTotalSeconds - player.secondsRemaining) / blockTotalSeconds) * 100;

  return (
    <div className="w-full rounded-[22px] border border-border bg-card p-6 md:p-10 space-y-8">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
          {routine.name} — Block {player.blockIndex + 1} of {routine.blocks.length}
        </span>
        <button
          onClick={onExit}
          aria-label="Exit routine"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          {player.currentBlock.label}
        </h2>
        {player.currentBlock.toolHref && (
          <Link
            href={player.currentBlock.toolHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Open tool <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="text-center">
        <span className="font-heading font-black text-6xl md:text-7xl tabular-nums tracking-tight">
          {formatTime(player.secondsRemaining)}
        </span>
      </div>

      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {player.nextBlock && (
        <p className="text-center text-sm text-muted-foreground">
          Up next: <span className="font-medium text-foreground">{player.nextBlock.label}</span>{" "}
          ({player.nextBlock.minutes} min)
        </p>
      )}

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => (player.isRunning ? player.pause() : player.resume())}
          className="flex items-center gap-2 px-6 py-3 rounded-[10px] bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {player.isRunning ? (
            <>
              <Pause className="h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Resume
            </>
          )}
        </button>
        <button
          onClick={() => player.skipToNext()}
          className="flex items-center gap-2 px-5 py-3 rounded-[10px] border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <SkipForward className="h-4 w-4" /> Skip
        </button>
      </div>

      <KeyboardHints
        hints={[
          { keys: ["Space"], label: "pause / resume" },
          { keys: ["N"], label: "next block" },
        ]}
      />
    </div>
  );
}
