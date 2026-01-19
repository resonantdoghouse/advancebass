import { useState, useEffect, useRef, useCallback } from "react";

interface MetronomeState {
  bpm: number;
  beatsPerMeasure: number;
  isPlaying: boolean;
  currentBeat: number;
}

type ToneType = "digital" | "woodblock" | "drum";

export const useMetronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [noteValue, setNoteValue] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [subdivision, setSubdivision] = useState(1);
  const [tone, setTone] = useState<ToneType>("digital");
  const [accentPattern, setAccentPattern] = useState<number[]>([2, 1, 1, 1]); // 0: mute, 1: normal, 2: accent
  const [volume, setVolume] = useState(0.8);

  const tapTimes = useRef<number[]>([]);

  const audioContext = useRef<AudioContext | null>(null);
  const nextNoteTime = useRef(0);
  const timerID = useRef<number | null>(null);
  const lookahead = 25.0;
  const scheduleAheadTime = 0.1;
  const tickRef = useRef(0);

  // Refs for current state values to be accessed inside the scheduler closure
  const bpmRef = useRef(bpm);
  const beatsPerMeasureRef = useRef(beatsPerMeasure);
  const subdivisionRef = useRef(subdivision);
  const toneRef = useRef(tone);
  const accentPatternRef = useRef(accentPattern);
  const volumeRef = useRef(volume);

  // Sync refs with state
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);
  useEffect(() => {
    beatsPerMeasureRef.current = beatsPerMeasure;
  }, [beatsPerMeasure]);
  useEffect(() => {
    subdivisionRef.current = subdivision;
  }, [subdivision]);
  useEffect(() => {
    toneRef.current = tone;
  }, [tone]);
  useEffect(() => {
    accentPatternRef.current = accentPattern;
  }, [accentPattern]);
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Sync accent pattern length with beatsPerMeasure
  useEffect(() => {
    setAccentPattern((prev) => {
      if (prev.length === beatsPerMeasure) return prev;

      const newPattern = [...prev];
      if (newPattern.length < beatsPerMeasure) {
        while (newPattern.length < beatsPerMeasure) {
          newPattern.push(1);
        }
      } else {
        newPattern.length = beatsPerMeasure;
      }
      return newPattern;
    });
  }, [beatsPerMeasure]);

  const nextNote = useCallback(() => {
    const secondsPerBeat = 60.0 / bpmRef.current;
    const secondsPerTick = secondsPerBeat / subdivisionRef.current;

    nextNoteTime.current += secondsPerTick;
    tickRef.current = tickRef.current + 1;
  }, []);

  const scheduleNote = useCallback((tickIndex: number, time: number) => {
    if (!audioContext.current) return;

    const currentSubdivision = subdivisionRef.current;
    const currentBeatsPerMeasure = beatsPerMeasureRef.current;
    const currentAccentPattern = accentPatternRef.current;
    const currentTone = toneRef.current;
    const currentVolume = volumeRef.current;

    const beatIndex =
      Math.floor(tickIndex / currentSubdivision) % currentBeatsPerMeasure;
    const subIndex = tickIndex % currentSubdivision;

    let level = 1;
    let frequency = 800;
    let duration = 0.03;

    if (subIndex === 0) {
      level =
        currentAccentPattern[beatIndex] !== undefined
          ? currentAccentPattern[beatIndex]
          : 1;
    } else {
      level = 0.5;
      frequency = 600;
    }

    if (level === 0) return; // Mute

    const osc = audioContext.current.createOscillator();
    const envelope = audioContext.current.createGain();

    if (currentTone === "digital") {
      if (subIndex === 0) {
        frequency = level === 2 ? 1000 : 800;
      }
      osc.frequency.value = frequency;
      osc.type = "sine";
    } else if (currentTone === "woodblock") {
      osc.frequency.value = level === 2 ? 1200 : 800;
      osc.type = "square";
      duration = 0.01;
    } else if (currentTone === "drum") {
      osc.frequency.value = level === 2 ? 150 : 100;
      osc.type = "triangle";
    }

    const baseVolume = level === 2 ? 1.0 : 0.6;
    const finalVolume = baseVolume * currentVolume;

    if (subIndex !== 0) {
      envelope.gain.value = 0.3 * currentVolume;
    } else {
      envelope.gain.value = finalVolume;
    }

    envelope.gain.exponentialRampToValueAtTime(finalVolume, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(envelope);
    envelope.connect(audioContext.current.destination);

    osc.start(time);
    osc.stop(time + duration);

    if (subIndex === 0) {
      const timeUntilNote = (time - audioContext.current.currentTime) * 1000;
      setTimeout(() => {
        setCurrentBeat(beatIndex);
      }, Math.max(0, timeUntilNote));
    }
  }, []);

  const schedulerRef = useRef<() => void>(() => {});

  const scheduler = useCallback(() => {
    if (!audioContext.current) return;

    while (
      nextNoteTime.current <
      audioContext.current.currentTime + scheduleAheadTime
    ) {
      scheduleNote(tickRef.current, nextNoteTime.current);
      nextNote();
    }
    timerID.current = window.setTimeout(() => schedulerRef.current(), lookahead);
  }, [nextNote, scheduleNote]);

  useEffect(() => {
    schedulerRef.current = scheduler;
  }, [scheduler]);

  const start = useCallback(() => {
    if (isPlaying) return;

    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    if (audioContext.current.state === "suspended") {
      audioContext.current.resume();
    }

    setIsPlaying(true);
    tickRef.current = 0;
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

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const toggleAccent = (index: number) => {
    setAccentPattern((prev) => {
      const next = [...prev];
      const val = next[index];
      if (val === 1) next[index] = 2;
      else if (val === 2) next[index] = 0;
      else next[index] = 1;
      return next;
    });
  };

  const tapTempo = () => {
    const now = performance.now();
    const times = tapTimes.current;

    // Reset if > 2 seconds since last tap
    if (times.length > 0 && now - times[times.length - 1] > 2000) {
      times.length = 0;
    }

    times.push(now);
    if (times.length > 4) times.shift(); // Keep last 4 taps

    if (times.length > 1) {
      const intervals = [];
      for (let i = 1; i < times.length; i++) {
        intervals.push(times[i] - times[i - 1]);
      }
      const avgInterval =
        intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const newBpm = Math.round(60000 / avgInterval);
      if (newBpm >= 30 && newBpm <= 300) {
        setBpm(newBpm);
      }
    }
  };

  return {
    isPlaying,
    start,
    stop,
    bpm,
    setBpm,
    beatsPerMeasure,
    setBeatsPerMeasure,
    noteValue,
    setNoteValue,
    currentBeat,
    subdivision,
    setSubdivision,
    tone,
    setTone,
    accentPattern,
    toggleAccent,
    volume,
    setVolume,
    tapTempo,
  };
};
