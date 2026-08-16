import { useEffect, useRef } from "react";

/**
 * Keeps the screen awake while `active` is true. Practice tools run timers
 * and audio that should survive the phone's idle-sleep — without this,
 * iOS/Android will dim and lock mid-metronome or mid-tuning.
 */
export function useWakeLock(active: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active || typeof navigator === "undefined" || !("wakeLock" in navigator)) {
      return;
    }

    let cancelled = false;

    const requestLock = async () => {
      try {
        const lock = await navigator.wakeLock.request("screen");
        if (cancelled) {
          lock.release().catch(() => {});
          return;
        }
        wakeLockRef.current = lock;
      } catch {
        // Request can fail (low battery, backgrounded tab, unsupported) —
        // practice just continues without the lock.
      }
    };

    requestLock();

    // The lock is released automatically when the tab loses visibility;
    // re-acquire it when the user comes back if we're still active.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    };
  }, [active]);
}
