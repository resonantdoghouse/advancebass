const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Extracts an 11-char YouTube video ID from a raw ID or any common YouTube
 * URL shape (watch, youtu.be, embed, shorts, live). Returns null if the
 * input doesn't resolve to a valid ID.
 */
export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (YOUTUBE_ID_PATTERN.test(trimmed)) return trimmed;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.hostname === "youtu.be" || url.hostname === "www.youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return YOUTUBE_ID_PATTERN.test(id) ? id : null;
  }

  if (url.hostname.endsWith("youtube.com")) {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
    }
    const match = url.pathname.match(/\/(?:embed|shorts|live)\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }

  return null;
}
