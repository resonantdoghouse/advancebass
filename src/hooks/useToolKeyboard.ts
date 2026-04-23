import { useEffect, useRef } from "react";

type ShortcutMap = Record<string, (e: KeyboardEvent) => void>;

/**
 * Registers keyboard shortcuts for a tool page.
 *
 * - Handlers are silently skipped when focus is inside an <input>, <textarea>, or <select>.
 * - Keys are matched by e.code first (e.g. "Space", "ArrowUp") then e.key as fallback.
 * - The event listener is only re-registered when `enabled` changes; a ref tracks the
 *   latest handler map so callers don't need to memoize the shortcuts object.
 */
export function useToolKeyboard(shortcuts: ShortcutMap, enabled = true) {
  const shortcutsRef = useRef(shortcuts);

  // Keep ref in sync with the latest handlers after every render
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  });

  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      const fn = shortcutsRef.current[e.code] ?? shortcutsRef.current[e.key];
      fn?.(e);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled]);
}
