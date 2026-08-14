"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDrumSynth } from "@/hooks/useDrumSynth";
import {
  Instrument,
  Pattern,
  MAX_STEPS,
  DEFAULT_PATTERN,
  PRESETS,
} from "@/data/drum-patterns";

const LOOKAHEAD_MS = 25.0;
const SCHEDULE_AHEAD_TIME = 0.1;

export function useDrumMachine() {
  const {
    playKick,
    playSnare,
    playHiHat,
    playOpenHat,
    playRide,
    playTom,
    resumeContext,
    getCurrentTime,
    currentKit,
    setKit,
    samplesLoaded,
  } = useDrumSynth();

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [steps, setSteps] = useState(16);
  const [swing, setSwing] = useState(0); // 0 to 100%
  const [pattern, setPattern] = useState<Pattern>(DEFAULT_PATTERN);
  const [currentStep, setCurrentStep] = useState(0);

  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  const timerIDRef = useRef<number | null>(null);

  // Refs mirror state so the scheduler loop (started once per play, driven
  // by setTimeout) always reads live values without needing to restart.
  const bpmRef = useRef(bpm);
  const stepsRef = useRef(steps);
  const swingRef = useRef(swing);
  const patternRef = useRef(pattern);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);
  useEffect(() => {
    swingRef.current = swing;
  }, [swing]);
  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  // Audio Scheduler
  const nextNote = useCallback(() => {
    const secondsPerBeat = 60.0 / bpmRef.current;
    // 'nextNoteTimeRef' tracks the theoretical straight-16th grid; swing is
    // applied as a per-note playback offset in scheduleNote, not here, so
    // the grid itself always advances at a consistent rate.
    const stepDuration = 0.25 * secondsPerBeat;
    nextNoteTimeRef.current += stepDuration;

    currentStepRef.current = (currentStepRef.current + 1) % stepsRef.current;
  }, []);

  const scheduleNote = useCallback(
    (stepNumber: number, time: number) => {
      const isOffbeat = stepNumber % 2 !== 0;
      const secondsPerBeat = 60.0 / bpmRef.current;
      const stepDuration = 0.25 * secondsPerBeat;

      const swingDelay = isOffbeat
        ? (swingRef.current / 100) * (stepDuration * 0.66)
        : 0;

      const playTime = time + swingDelay;

      // Audio
      if (patternRef.current.kick[stepNumber]) playKick(playTime);
      if (patternRef.current.snare[stepNumber]) playSnare(playTime);
      if (patternRef.current.hihat[stepNumber]) playHiHat(playTime);
      if (patternRef.current.ride[stepNumber]) playRide(playTime);
      if (patternRef.current.openhat[stepNumber]) playOpenHat(playTime);
      if (patternRef.current.tom[stepNumber]) playTom(playTime);

      // Visual (approximate)
      const drawTime = (playTime - getCurrentTime()) * 1000;
      setTimeout(
        () => {
          setCurrentStep(stepNumber);
        },
        Math.max(0, drawTime),
      );
    },
    [
      playKick,
      playSnare,
      playHiHat,
      playOpenHat,
      playRide,
      playTom,
      getCurrentTime,
    ],
  );

  const scheduler = useCallback(() => {
    const currentTime = getCurrentTime();

    while (nextNoteTimeRef.current < currentTime + SCHEDULE_AHEAD_TIME) {
      scheduleNote(currentStepRef.current, nextNoteTimeRef.current);
      nextNote();
    }
    timerIDRef.current = window.setTimeout(scheduler, LOOKAHEAD_MS);
  }, [nextNote, scheduleNote, getCurrentTime]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      if (timerIDRef.current) clearTimeout(timerIDRef.current);
      setIsPlaying(false);
    } else {
      resumeContext();
      // Start perfectly on grid
      nextNoteTimeRef.current = getCurrentTime() + 0.1;
      currentStepRef.current = 0;
      setIsPlaying(true);
      scheduler();
    }
  }, [isPlaying, resumeContext, getCurrentTime, scheduler]);

  useEffect(() => {
    return () => {
      if (timerIDRef.current) clearTimeout(timerIDRef.current);
    };
  }, []);

  const toggleStep = useCallback(
    (instrument: Instrument, stepIndex: number) => {
      setPattern((prev) => ({
        ...prev,
        [instrument]: prev[instrument].map((val, i) =>
          i === stepIndex ? !val : val,
        ),
      }));
    },
    [],
  );

  const loadPreset = useCallback((preset: (typeof PRESETS)[0]) => {
    const newPattern = { ...DEFAULT_PATTERN };
    (Object.keys(preset.pattern) as Instrument[]).forEach((inst) => {
      const p = preset.pattern[inst];
      newPattern[inst] = newPattern[inst].map((_, i) => p[i] || false);
    });

    setPattern(newPattern);
    setBpm(preset.bpm);
    setSteps(preset.steps);
    setSwing(preset.swing || 0);
  }, []);

  const clearPattern = useCallback(() => {
    setPattern({
      kick: Array(MAX_STEPS).fill(false),
      snare: Array(MAX_STEPS).fill(false),
      hihat: Array(MAX_STEPS).fill(false),
      openhat: Array(MAX_STEPS).fill(false),
      ride: Array(MAX_STEPS).fill(false),
      tom: Array(MAX_STEPS).fill(false),
    });
  }, []);

  return {
    isPlaying,
    togglePlay,
    bpm,
    setBpm,
    steps,
    setSteps,
    swing,
    setSwing,
    pattern,
    currentStep,
    toggleStep,
    loadPreset,
    clearPattern,
    currentKit,
    setKit,
    samplesLoaded,
  };
}
