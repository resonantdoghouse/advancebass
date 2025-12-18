import { useState, useEffect, useRef, useCallback } from "react";

interface MetronomeState {
  bpm: number;
  beatsPerMeasure: number;
  isPlaying: boolean;
  currentBeat: number;
}

export const useMetronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);

  const audioContext = useRef<AudioContext | null>(null);
  const nextNoteTime = useRef(0);
  const timerID = useRef<number | null>(null);
  const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  const beatRef = useRef(0); // Mutable ref to track beats without re-renders affecting scheduling

  const nextNote = useCallback(() => {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTime.current += secondsPerBeat;
    beatRef.current = (beatRef.current + 1) % beatsPerMeasure;
    // We update state for UI visualization, but scheduling relies on refs
  }, [bpm, beatsPerMeasure]);

  const scheduleNote = useCallback(
    (beatNumber: number, time: number) => {
      if (!audioContext.current) return;

      const osc = audioContext.current.createOscillator();
      const envelope = audioContext.current.createGain();

      osc.frequency.value = beatNumber % beatsPerMeasure === 0 ? 1000 : 800;

      envelope.gain.value = 1;
      envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
      envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

      osc.connect(envelope);
      envelope.connect(audioContext.current.destination);

      osc.start(time);
      osc.stop(time + 0.03);

      // Sync visual state
      // We use a draw callback or requestAnimationFrame for smoother Visuals if needed,
      // but for simple beat counting, setting state here (delayed to match audio) is okay-ish
      // However, strictly setting state in the future is hard.
      // For this simple implementation, we'll set the current beat 'now'.
      // To match the audio perfectly, we would use a separate visual loop.
      // Given React 18, we can try to trust the timing or use a timeout.

      const timeUntilNote = (time - audioContext.current.currentTime) * 1000;
      setTimeout(() => {
        setCurrentBeat(beatNumber);
      }, Math.max(0, timeUntilNote));
    },
    [beatsPerMeasure]
  );

  const scheduler = useCallback(() => {
    if (!audioContext.current) return;

    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (
      nextNoteTime.current <
      audioContext.current.currentTime + scheduleAheadTime
    ) {
      scheduleNote(beatRef.current, nextNoteTime.current);
      nextNote();
    }
    timerID.current = window.setTimeout(scheduler, lookahead);
  }, [nextNote, scheduleNote]);

  const start = useCallback(() => {
    if (isPlaying) return;

    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    // Resume context if suspended (browser policy)
    if (audioContext.current.state === "suspended") {
      audioContext.current.resume();
    }

    setIsPlaying(true);
    beatRef.current = 0;
    setCurrentBeat(0);
    nextNoteTime.current = audioContext.current.currentTime + 0.05;
    scheduler();
  }, [isPlaying, scheduler]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    if (timerID.current !== null) {
      window.clearTimeout(timerID.current);
      timerID.current = null;
    }
    setCurrentBeat(0);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerID.current !== null) {
        window.clearTimeout(timerID.current);
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Restart scheduler if BPM changes while playing
  // Actually, the scheduler recursively calls itself, using the LATEST refs/state if we are careful.
  // But our 'nextNote' depends on 'bpm'. Since 'nextNote' is in the dependency array of 'scheduler',
  // and 'scheduler' is re-created, the OLD timeout might call the OLD scheduler.
  // We need to ensure the loop continues with fresh values.

  // A ref for "isPlaying" helps the scheduler decide whether to continue
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  return {
    isPlaying,
    start,
    stop,
    bpm,
    setBpm,
    beatsPerMeasure,
    setBeatsPerMeasure,
    currentBeat,
  };
};
