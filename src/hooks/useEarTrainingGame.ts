"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { createAudioContext } from "@/lib/audio-context";

export const GAME_DURATION = 60;

// ─── Intervals ────────────────────────────────────────────────────────────────

type Interval = { name: string; semitones: number };

const ALL_INTERVALS: Record<Difficulty, Interval[]> = {
  easy: [
    { name: "Minor 3rd (m3)", semitones: 3 },
    { name: "Major 3rd (M3)", semitones: 4 },
    { name: "Perfect 5th (P5)", semitones: 7 },
    { name: "Octave (P8)", semitones: 12 },
  ],
  medium: [
    { name: "Major 2nd (M2)", semitones: 2 },
    { name: "Minor 3rd (m3)", semitones: 3 },
    { name: "Major 3rd (M3)", semitones: 4 },
    { name: "Perfect 4th (P4)", semitones: 5 },
    { name: "Perfect 5th (P5)", semitones: 7 },
    { name: "Major 6th (M6)", semitones: 9 },
    { name: "Minor 7th (m7)", semitones: 10 },
    { name: "Octave (P8)", semitones: 12 },
  ],
  hard: [
    { name: "Minor 2nd (m2)", semitones: 1 },
    { name: "Major 2nd (M2)", semitones: 2 },
    { name: "Minor 3rd (m3)", semitones: 3 },
    { name: "Major 3rd (M3)", semitones: 4 },
    { name: "Perfect 4th (P4)", semitones: 5 },
    { name: "Tritone (TT)", semitones: 6 },
    { name: "Perfect 5th (P5)", semitones: 7 },
    { name: "Minor 6th (m6)", semitones: 8 },
    { name: "Major 6th (M6)", semitones: 9 },
    { name: "Minor 7th (m7)", semitones: 10 },
    { name: "Major 7th (M7)", semitones: 11 },
    { name: "Octave (P8)", semitones: 12 },
  ],
};

// ─── Chord Qualities ─────────────────────────────────────────────────────────

type ChordQuality = { name: string; intervals: number[] };

const ALL_CHORDS: Record<Difficulty, ChordQuality[]> = {
  easy: [
    { name: "Major", intervals: [0, 4, 7] },
    { name: "Minor", intervals: [0, 3, 7] },
  ],
  medium: [
    { name: "Major", intervals: [0, 4, 7] },
    { name: "Minor", intervals: [0, 3, 7] },
    { name: "Dominant 7", intervals: [0, 4, 7, 10] },
    { name: "Minor 7", intervals: [0, 3, 7, 10] },
  ],
  hard: [
    { name: "Major", intervals: [0, 4, 7] },
    { name: "Minor", intervals: [0, 3, 7] },
    { name: "Major 7", intervals: [0, 4, 7, 11] },
    { name: "Dominant 7", intervals: [0, 4, 7, 10] },
    { name: "Minor 7", intervals: [0, 3, 7, 10] },
    { name: "Diminished", intervals: [0, 3, 6] },
    { name: "Augmented", intervals: [0, 4, 8] },
  ],
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type GameState = "menu" | "playing" | "finished";
export type Mode = "intervals" | "chords";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  answer: string;
  options: string[];
  play: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

// Bass range root notes: E2–B2
const ROOT_MIDI = [40, 41, 42, 43, 44, 45, 46, 47];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function playNote(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration = 1.5
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(frequency, startTime);

  filter.type = "lowpass";
  filter.Q.value = 1;
  filter.frequency.setValueAtTime(frequency * 2, startTime);
  filter.frequency.exponentialRampToValueAtTime(frequency * 8, startTime + 0.05);
  filter.frequency.exponentialRampToValueAtTime(frequency * 3, startTime + 0.5);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.5, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEarTrainingGame() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [mode, setMode] = useState<Mode>("intervals");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "correct" | "incorrect";
    message: string;
  } | null>(null);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const nextQuestionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = createAudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const buildIntervalQuestion = useCallback(
    (diff: Difficulty): Question => {
      const pool = ALL_INTERVALS[diff];
      const correct = pickRandom(pool);
      const distractors = shuffle(
        pool.filter((x) => x.name !== correct.name)
      ).slice(0, 3);
      const options = shuffle([correct, ...distractors]).map((x) => x.name);
      const rootMidi = pickRandom(ROOT_MIDI);
      const rootFreq = midiToFreq(rootMidi);
      const intervalFreq = midiToFreq(rootMidi + correct.semitones);

      const play = () => {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        playNote(ctx, rootFreq, now, 1.0);
        playNote(ctx, intervalFreq, now + 0.9, 1.5);
      };

      return { answer: correct.name, options, play };
    },
    [getAudioContext]
  );

  const buildChordQuestion = useCallback(
    (diff: Difficulty): Question => {
      const pool = ALL_CHORDS[diff];
      const correct = pickRandom(pool);
      const distractors = shuffle(
        pool.filter((x) => x.name !== correct.name)
      ).slice(0, Math.min(3, pool.length - 1));
      const options = shuffle([correct, ...distractors]).map((x) => x.name);
      const rootMidi = pickRandom(ROOT_MIDI);

      const play = () => {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        correct.intervals.forEach((semitones, i) => {
          playNote(ctx, midiToFreq(rootMidi + semitones), now + i * 0.28, 1.8);
        });
      };

      return { answer: correct.name, options, play };
    },
    [getAudioContext]
  );

  const generateAndPlayQuestion = useCallback(
    (currentMode: Mode, currentDifficulty: Difficulty) => {
      const q =
        currentMode === "intervals"
          ? buildIntervalQuestion(currentDifficulty)
          : buildChordQuestion(currentDifficulty);
      setQuestion(q);
      setAnswered(false);
      setFeedback(null);
      setSelectedAnswer(null);
      q.play();
    },
    [buildIntervalQuestion, buildChordQuestion]
  );

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (nextQuestionTimerRef.current) clearTimeout(nextQuestionTimerRef.current);
    setGameState("finished");
    setQuestion(null);
  }, []);

  const startGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (nextQuestionTimerRef.current) clearTimeout(nextQuestionTimerRef.current);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFeedback(null);
    setAnswered(false);
    setSelectedAnswer(null);
    setGameState("playing");
    generateAndPlayQuestion(mode, difficulty);
  }, [mode, difficulty, generateAndPlayQuestion]);

  const resetToMenu = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (nextQuestionTimerRef.current) clearTimeout(nextQuestionTimerRef.current);
    setGameState("menu");
    setQuestion(null);
    setFeedback(null);
    setAnswered(false);
    setSelectedAnswer(null);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, endGame]);

  const handleAnswer = useCallback(
    (selected: string) => {
      if (answered || gameState !== "playing" || !question) return;
      setAnswered(true);
      setSelectedAnswer(selected);

      if (selected === question.answer) {
        setScore((s) => s + 10);
        setFeedback({ type: "correct", message: "Correct!" });
      } else {
        setFeedback({
          type: "incorrect",
          message: `The answer was: ${question.answer}`,
        });
      }

      nextQuestionTimerRef.current = setTimeout(() => {
        generateAndPlayQuestion(mode, difficulty);
      }, 1400);
    },
    [answered, gameState, question, mode, difficulty, generateAndPlayQuestion]
  );

  const replayAudio = useCallback(() => {
    question?.play();
  }, [question]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (nextQuestionTimerRef.current) clearTimeout(nextQuestionTimerRef.current);
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  return {
    gameState,
    mode,
    setMode,
    difficulty,
    setDifficulty,
    score,
    timeLeft,
    question,
    feedback,
    answered,
    selectedAnswer,
    startGame,
    resetToMenu,
    handleAnswer,
    replayAudio,
    GAME_DURATION,
  };
}
