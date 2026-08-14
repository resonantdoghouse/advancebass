const STORAGE_PREFIX = "video-looper:loop:";

export interface SavedLoop {
  startTime: number;
  endTime: number;
  loop: boolean;
}

export function loadSavedLoop(videoId: string): SavedLoop | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + videoId);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.startTime === "number" &&
      typeof parsed.endTime === "number" &&
      typeof parsed.loop === "boolean"
    ) {
      return parsed;
    }
  } catch {
    // Malformed entry or localStorage unavailable (private mode, quota) — ignore.
  }
  return null;
}

export function saveLoop(videoId: string, loop: SavedLoop): void {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + videoId, JSON.stringify(loop));
  } catch {
    // localStorage unavailable — practice session just won't persist.
  }
}
