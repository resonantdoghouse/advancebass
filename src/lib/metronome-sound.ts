export type ToneType = "digital" | "woodblock" | "drum" | "ping" | "blip";

export interface MetronomeTick {
  /** 0 = start of the beat (or of the whole tick if not subdividing); nonzero = a subdivision within the beat. */
  subIndex: number;
  /** 0 = muted, 0.5 = subdivision tick, 1 = normal beat, 2 = accented beat. */
  level: number;
  tone: ToneType;
  volume: number;
}

// Synthesizes and plays a single metronome tick via the Web Audio API at the
// given AudioContext time. This is the only tone-generating piece of the
// metronome tied to a specific audio backend — the tick scheduling in
// useMetronome is pure BPM/timing math and doesn't know this is Web Audio.
// Porting the metronome to React Native means replacing this one function
// with a native-module equivalent; the scheduler itself needs no changes.
export function playMetronomeTick(
  ctx: AudioContext,
  time: number,
  { subIndex, level, tone, volume }: MetronomeTick,
): void {
  if (level === 0) return; // Mute

  let frequency = subIndex === 0 ? 800 : 600;
  let duration = 0.03;

  const osc = ctx.createOscillator();
  const envelope = ctx.createGain();

  if (tone === "digital") {
    if (subIndex === 0) {
      frequency = level === 2 ? 1000 : 800;
    }
    osc.frequency.value = frequency;
    osc.type = "sine";
  } else if (tone === "woodblock") {
    osc.frequency.value = level === 2 ? 1200 : 800;
    osc.type = "square";
    duration = 0.01;
  } else if (tone === "drum") {
    osc.frequency.value = level === 2 ? 150 : 100;
    osc.type = "triangle";
  } else if (tone === "ping") {
    osc.frequency.value = level === 2 ? 1400 : 1000;
    osc.type = "sine";
    duration = 0.08;
  } else if (tone === "blip") {
    osc.frequency.value = level === 2 ? 600 : 400;
    osc.type = "sawtooth";
    duration = 0.05;
  }

  const baseVolume = level === 2 ? 1.0 : 0.6;
  const finalVolume = baseVolume * volume;

  envelope.gain.value = subIndex !== 0 ? 0.3 * volume : finalVolume;
  envelope.gain.exponentialRampToValueAtTime(finalVolume, time + 0.001);
  envelope.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc.connect(envelope);
  envelope.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + duration);
}
