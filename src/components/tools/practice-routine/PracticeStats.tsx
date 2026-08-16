"use client";

import { Flame, Trophy, Clock } from "lucide-react";
import type { SessionLogEntry } from "@/lib/practice-storage";

export function PracticeStats({
  log,
  streak,
}: {
  log: SessionLogEntry[];
  streak: { current: number; longest: number };
}) {
  const totalMinutes = log.reduce((sum, e) => sum + e.totalMinutes, 0);
  const recent = log.slice(0, 5);

  return (
    <div className="w-full rounded-[22px] border border-border bg-card p-6 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Flame className="h-5 w-5 text-primary mx-auto mb-1.5" />
          <div className="text-2xl font-bold tabular-nums">{streak.current}</div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
            Day Streak
          </div>
        </div>
        <div className="text-center">
          <Trophy className="h-5 w-5 text-primary mx-auto mb-1.5" />
          <div className="text-2xl font-bold tabular-nums">{streak.longest}</div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
            Best Streak
          </div>
        </div>
        <div className="text-center">
          <Clock className="h-5 w-5 text-primary mx-auto mb-1.5" />
          <div className="text-2xl font-bold tabular-nums">{totalMinutes}</div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
            Total Minutes
          </div>
        </div>
      </div>

      {recent.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/40">
          <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase font-semibold">
            Recent Sessions
          </span>
          <ul className="space-y-1.5">
            {recent.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between text-sm py-1.5"
              >
                <span className="text-muted-foreground">{entry.dateKey}</span>
                <span className="font-medium">{entry.routineName}</span>
                <span className="text-muted-foreground">{entry.totalMinutes} min</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
