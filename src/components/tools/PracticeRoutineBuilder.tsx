"use client";

import { useEffect, useState } from "react";
import { Play, Pencil, Trash2, Plus, Clock, Info } from "lucide-react";
import {
  loadRoutines,
  saveRoutines,
  loadLog,
  appendLogEntry,
  computeStreak,
  todayKey,
  type Routine,
  type SessionLogEntry,
} from "@/lib/practice-storage";
import { RoutineBuilder } from "@/components/tools/practice-routine/RoutineBuilder";
import { RoutinePlayer } from "@/components/tools/practice-routine/RoutinePlayer";
import { PracticeStats } from "@/components/tools/practice-routine/PracticeStats";

type View = { mode: "list" } | { mode: "builder"; editing?: Routine } | { mode: "player"; routine: Routine };

export function PracticeRoutineBuilder() {
  const [mounted, setMounted] = useState(false);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [log, setLog] = useState<SessionLogEntry[]>([]);
  const [view, setView] = useState<View>({ mode: "list" });

  useEffect(() => {
    setRoutines(loadRoutines());
    setLog(loadLog());
    setMounted(true);
  }, []);

  const persistRoutines = (next: Routine[]) => {
    setRoutines(next);
    saveRoutines(next);
  };

  const handleSaveRoutine = (routine: Routine) => {
    const exists = routines.some((r) => r.id === routine.id);
    const next = exists
      ? routines.map((r) => (r.id === routine.id ? routine : r))
      : [...routines, routine];
    persistRoutines(next);
    setView({ mode: "list" });
  };

  const handleDeleteRoutine = (id: string) => {
    persistRoutines(routines.filter((r) => r.id !== id));
  };

  const handleFinishRoutine = (routine: Routine, totalMinutes: number) => {
    const entry: SessionLogEntry = {
      id: Math.random().toString(36).slice(2, 10),
      dateKey: todayKey(),
      routineName: routine.name,
      totalMinutes,
      completedAt: new Date().toISOString(),
    };
    setLog(appendLogEntry(entry));
  };

  if (!mounted) {
    return (
      <div className="w-full h-64 rounded-[22px] border border-border bg-card/50 animate-pulse" />
    );
  }

  if (view.mode === "player") {
    return (
      <RoutinePlayer
        routine={view.routine}
        onExit={() => setView({ mode: "list" })}
        onFinish={(minutes) => handleFinishRoutine(view.routine, minutes)}
      />
    );
  }

  if (view.mode === "builder") {
    return (
      <RoutineBuilder
        initial={view.editing}
        onSave={handleSaveRoutine}
        onCancel={() => setView({ mode: "list" })}
      />
    );
  }

  const streak = computeStreak(log);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 bg-muted/20 border border-border/50 rounded-[14px] px-5 py-4 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>
          Routines and practice history are saved only in this browser, on
          this device — clearing your browser data will erase them. User
          accounts with cross-device sync are coming soon.
        </p>
      </div>

      <PracticeStats log={log} streak={streak} />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Routines</h2>
        <button
          onClick={() => setView({ mode: "builder" })}
          className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <Plus className="h-4 w-4" /> New Routine
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {routines.map((routine) => {
          const totalMinutes = routine.blocks.reduce((sum, b) => sum + b.minutes, 0);
          return (
            <div
              key={routine.id}
              className="rounded-[18px] border border-border bg-card p-5 space-y-4"
            >
              <div>
                <h3 className="font-bold text-lg">{routine.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Clock className="h-3.5 w-3.5" />
                  {totalMinutes} min · {routine.blocks.length} blocks
                </p>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                {routine.blocks.map((b) => (
                  <li key={b.id}>
                    {b.label} — {b.minutes} min
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setView({ mode: "player", routine })}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Play className="h-3.5 w-3.5" /> Start
                </button>
                <button
                  onClick={() => setView({ mode: "builder", editing: routine })}
                  aria-label={`Edit ${routine.name}`}
                  className="p-2 rounded-[8px] border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteRoutine(routine.id)}
                  aria-label={`Delete ${routine.name}`}
                  className="p-2 rounded-[8px] border border-border text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
