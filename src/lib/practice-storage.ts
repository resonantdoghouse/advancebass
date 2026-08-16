export type RoutineBlock = {
  id: string;
  label: string;
  minutes: number;
  toolHref?: string;
};

export type Routine = {
  id: string;
  name: string;
  blocks: RoutineBlock[];
};

export type SessionLogEntry = {
  id: string;
  dateKey: string; // local YYYY-MM-DD, for streak/day-bucketing
  routineName: string;
  totalMinutes: number;
  completedAt: string; // ISO timestamp
};

const ROUTINES_KEY = "advancebass:practice-routines";
const LOG_KEY = "advancebass:practice-log";

export const STARTER_ROUTINES: Routine[] = [
  {
    id: "starter-warmup",
    name: "Quick Warm-Up",
    blocks: [
      { id: "b1", label: "Chromatic / stretching warm-up", minutes: 5, toolHref: "/tools/metronome" },
      { id: "b2", label: "Scale review", minutes: 5, toolHref: "/tools/scale-visualizer" },
      { id: "b3", label: "Groove with metronome", minutes: 5, toolHref: "/tools/metronome" },
    ],
  },
  {
    id: "starter-technique",
    name: "Technique Session",
    blocks: [
      { id: "b1", label: "Warm-up", minutes: 5, toolHref: "/tools/metronome" },
      { id: "b2", label: "Scales & arpeggios", minutes: 10, toolHref: "/tools/fretboard-lab" },
      { id: "b3", label: "Metronome practice", minutes: 10, toolHref: "/tools/metronome" },
      { id: "b4", label: "Ear training", minutes: 5, toolHref: "/tools/ear-training" },
    ],
  },
  {
    id: "starter-theory",
    name: "Sight & Theory",
    blocks: [
      { id: "b1", label: "Circle of Fifths review", minutes: 5, toolHref: "/tools/circle-of-fifths" },
      { id: "b2", label: "Scale visualizer drilling", minutes: 10, toolHref: "/tools/scale-visualizer" },
      { id: "b3", label: "Ear training", minutes: 5, toolHref: "/tools/ear-training" },
    ],
  },
];

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadRoutines(): Routine[] {
  if (typeof window === "undefined") return STARTER_ROUTINES;
  const stored = safeParse<Routine[] | null>(window.localStorage.getItem(ROUTINES_KEY), null);
  return stored ?? STARTER_ROUTINES;
}

export function saveRoutines(routines: Routine[]): void {
  try {
    window.localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
  } catch {
    // localStorage unavailable (private mode, quota) — routines just won't persist.
  }
}

export function loadLog(): SessionLogEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse<SessionLogEntry[]>(window.localStorage.getItem(LOG_KEY), []);
}

export function appendLogEntry(entry: SessionLogEntry): SessionLogEntry[] {
  const next = [entry, ...loadLog()].slice(0, 500);
  try {
    window.localStorage.setItem(LOG_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable — session just won't persist.
  }
  return next;
}

export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dateKeyToDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Consecutive-day streak ending today or yesterday (a day's still "alive" until it's fully missed). */
export function computeStreak(log: SessionLogEntry[]): { current: number; longest: number } {
  const uniqueDays = Array.from(new Set(log.map((e) => e.dateKey))).sort();
  if (uniqueDays.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = dateKeyToDate(uniqueDays[i - 1]);
    const cur = dateKeyToDate(uniqueDays[i]);
    const diffDays = Math.round((cur.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      run += 1;
    } else {
      longest = Math.max(longest, run);
      run = 1;
    }
  }
  longest = Math.max(longest, run);

  const today = todayKey();
  const yesterday = todayKey(new Date(Date.now() - 86400000));
  const lastDay = uniqueDays[uniqueDays.length - 1];

  if (lastDay !== today && lastDay !== yesterday) {
    return { current: 0, longest };
  }

  // Walk backward from the most recent logged day counting consecutive days.
  let current = 1;
  for (let i = uniqueDays.length - 1; i > 0; i--) {
    const cur = dateKeyToDate(uniqueDays[i]);
    const prev = dateKeyToDate(uniqueDays[i - 1]);
    const diffDays = Math.round((cur.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) current += 1;
    else break;
  }

  return { current, longest };
}
