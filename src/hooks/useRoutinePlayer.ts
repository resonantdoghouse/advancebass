import { useCallback, useEffect, useRef, useState } from "react";
import { createAudioContext } from "@/lib/audio-context";
import type { Routine } from "@/lib/practice-storage";

type PlayerState = "idle" | "running" | "paused" | "finished";

export function useRoutinePlayer(routine: Routine | null, onFinish: (totalMinutes: number) => void) {
  const [blockIndex, setBlockIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [state, setState] = useState<PlayerState>("idle");

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const finishedNotifiedRef = useRef(false);

  const playChime = useCallback(() => {
    try {
      if (!audioContextRef.current || audioContextRef.current.state === "closed") {
        audioContextRef.current = createAudioContext();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio unavailable — the visual transition still happens.
    }
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (!routine || routine.blocks.length === 0) return;
    finishedNotifiedRef.current = false;
    setBlockIndex(0);
    setSecondsRemaining(routine.blocks[0].minutes * 60);
    setState("running");
  }, [routine]);

  const pause = useCallback(() => setState((s) => (s === "running" ? "paused" : s)), []);
  const resume = useCallback(() => setState((s) => (s === "paused" ? "running" : s)), []);

  const skipToNext = useCallback(() => {
    if (!routine) return;
    setBlockIndex((i) => {
      const next = i + 1;
      if (next >= routine.blocks.length) {
        setState("finished");
        return i;
      }
      setSecondsRemaining(routine.blocks[next].minutes * 60);
      playChime();
      return next;
    });
  }, [routine, playChime]);

  const reset = useCallback(() => {
    clearTimer();
    setState("idle");
    setBlockIndex(0);
    setSecondsRemaining(0);
  }, [clearTimer]);

  // Tick loop
  useEffect(() => {
    if (state !== "running") {
      clearTimer();
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setSecondsRemaining((s) => {
        if (s > 1) return s - 1;
        // Block finished — advance or finish the routine.
        skipToNext();
        return 0;
      });
    }, 1000);
    return clearTimer;
  }, [state, clearTimer, skipToNext]);

  // Fire completion callback once, when transitioning into "finished".
  useEffect(() => {
    if (state === "finished" && !finishedNotifiedRef.current && routine) {
      finishedNotifiedRef.current = true;
      const totalMinutes = routine.blocks.reduce((sum, b) => sum + b.minutes, 0);
      onFinish(totalMinutes);
    }
    if (state === "idle") finishedNotifiedRef.current = false;
  }, [state, routine, onFinish]);

  useEffect(() => {
    return () => {
      clearTimer();
      audioContextRef.current?.close().catch(() => {});
    };
  }, [clearTimer]);

  const currentBlock = routine?.blocks[blockIndex] ?? null;
  const nextBlock = routine?.blocks[blockIndex + 1] ?? null;

  return {
    state,
    blockIndex,
    currentBlock,
    nextBlock,
    secondsRemaining,
    isRunning: state === "running",
    isPaused: state === "paused",
    isFinished: state === "finished",
    start,
    pause,
    resume,
    skipToNext,
    reset,
  };
}
