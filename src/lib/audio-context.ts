// Single point of contact with the Web Audio API's AudioContext constructor.
// Safari still only exposes it as `webkitAudioContext`, and this is also the
// natural seam to swap in a React Native audio backend when these tools get
// ported — every other call site should go through here instead of
// constructing an AudioContext directly.
export function createAudioContext(): AudioContext {
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  return new AudioContextClass();
}

// Returns a running AudioContext, creating one if needed (or if the previous
// one was closed) and resuming it if the browser's autoplay policy suspended it.
export async function ensureAudioContext(
  ref: React.RefObject<AudioContext | null>,
): Promise<AudioContext> {
  if (!ref.current || ref.current.state === "closed") {
    ref.current = createAudioContext();
  }
  if (ref.current.state === "suspended") {
    await ref.current.resume();
  }
  return ref.current;
}
