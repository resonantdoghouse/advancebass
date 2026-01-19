import { useState, useCallback, useRef, useEffect } from "react";
import { FretboardNote, GameState } from "@/components/tools/fretboard-trainer/types";
import { useBassSynth } from "@/hooks/useBassSynth";
import { getNoteName } from "@/lib/music-theory";

const GAME_DURATION = 60; // seconds

export function useFretboardGame() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targetNoteIndex, setTargetNoteIndex] = useState<number | null>(null);
  const [tuningId] = useState("4-string-standard");
  const [feedback, setFeedback] = useState<{
    type: "correct" | "incorrect";
    message: string;
  } | null>(null);
  const [lastClickedFret, setLastClickedFret] = useState<{
    string: number;
    fret: number;
  } | null>(null);

  const { playTone } = useBassSynth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNewTarget = useCallback(() => {
    // Basic random note (0-11)
    const nextNote = Math.floor(Math.random() * 12);
    setTargetNoteIndex(nextNote);
  }, []);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("finished");
    setTargetNoteIndex(null);
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState("playing");
    setFeedback(null);
    setLastClickedFret(null);
    generateNewTarget();
  }, [generateNewTarget]);

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

  const handleNoteClick = useCallback(
    (noteData: FretboardNote) => {
      playTone(noteData.frequency);

      if (gameState !== "playing" || targetNoteIndex === null) return;

      setLastClickedFret({ string: noteData.stringIndex, fret: noteData.fret });

      if (noteData.noteIndex === targetNoteIndex) {
        // Correct
        setScore((s) => s + 10);
        setFeedback({ type: "correct", message: "Nice!" });
        setTimeout(() => setFeedback(null), 800);
        generateNewTarget();
      } else {
        // Incorrect
        setFeedback({ type: "incorrect", message: "Try again!" });
        setTimeout(() => setFeedback(null), 800);
      }
    },
    [gameState, targetNoteIndex, playTone, generateNewTarget]
  );

  const getTargetNoteName = useCallback(() => {
    if (targetNoteIndex === null) return "?";
    return getNoteName(targetNoteIndex, "C");
  }, [targetNoteIndex]);

  const getNoteStyle = useCallback(
    (noteData: FretboardNote) => {
      const isLastClicked =
        lastClickedFret?.string === noteData.stringIndex &&
        lastClickedFret?.fret === noteData.fret;

      if (isLastClicked && feedback) {
        if (feedback.type === "correct") {
          return "bg-green-500 text-white border-green-600 scale-125 shadow-lg ring-4 ring-green-500/20 z-50 opacity-100";
        }
        return "bg-red-500 text-white border-red-600 animate-shake z-50 opacity-100";
      }

      // Default hover style for game
      return "bg-transparent border-transparent w-8 h-8 hover:bg-primary/40 hover:border-primary opacity-0 hover:opacity-100 transition-all duration-100 rounded-full";
    },
    [lastClickedFret, feedback]
  );

  return {
    gameState,
    score,
    timeLeft,
    tuningId,
    lastClickedFret,
    feedback,
    startGame,
    handleNoteClick,
    getTargetNoteName,
    getNoteStyle,
    GAME_DURATION
  };
}
