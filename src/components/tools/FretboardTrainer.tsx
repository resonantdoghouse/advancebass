"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NOTES, getAllFretboardNotes, getNoteName } from "@/lib/music-theory";
import { useBassSynth } from "@/hooks/useBassSynth";
import { TUNING_PRESETS } from "@/lib/tuner-utils";
import {
  Play,
  RotateCcw,
  Trophy,
  Timer,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type FretboardNote = {
  stringIndex: number;
  fret: number;
  note: string;
  noteIndex: number;
  octave: number;
  frequency: number;
};

type GameState = "menu" | "playing" | "finished";

const GAME_DURATION = 60; // seconds

export function FretboardTrainer() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targetNoteIndex, setTargetNoteIndex] = useState<number | null>(null);
  const [tuningId] = useState("4-string-standard");
  const [showInstructions, setShowInstructions] = useState(false);
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

  const currentTuning = TUNING_PRESETS[tuningId as keyof typeof TUNING_PRESETS];
  const numStrings = currentTuning.strings.length;
  // Standard tuning usually: String 0 = E (Lowest), String 3 = G (Highest)
  // But we render reversed, so Top to Bottom is G -> D -> A -> E

  const numFrets = 15;
  const fretboardData = getAllFretboardNotes(currentTuning.strings, numFrets);

  const stringsData: FretboardNote[][] = Array.from(
    { length: numStrings },
    () => [],
  );
  fretboardData.forEach((pos) => {
    stringsData[pos.stringIndex][pos.fret] = pos;
  });

  const generateNewTarget = useCallback(() => {
    // Basic random note (0-11)
    const nextNote = Math.floor(Math.random() * 12);
    // Simple anti-repetition check could go here
    setTargetNoteIndex(nextNote);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState("playing");
    setFeedback(null);
    setLastClickedFret(null);
    generateNewTarget();
    setShowInstructions(false);
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("finished");
    setTargetNoteIndex(null);
  };

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
  }, [gameState]);

  const handleNoteClick = (noteData: FretboardNote) => {
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
  };

  const getTargetNoteName = () => {
    if (targetNoteIndex === null) return "?";
    return getNoteName(targetNoteIndex, "C");
  };

  // Helper to determine note visual state
  const getNoteStyle = (noteData: FretboardNote) => {
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
    // Create a larger target area visual (glow) when hovering
    return "bg-transparent border-transparent w-8 h-8 hover:bg-primary/40 hover:border-primary opacity-0 hover:opacity-100 transition-all duration-100 rounded-full";
  };

  return (
    <Card className="w-full shadow-xl border-2 bg-card/95 backdrop-blur">
      <CardContent className="p-6 space-y-8">
        {/* Header / Instructions Toggle */}
        <Collapsible
          open={showInstructions}
          onOpenChange={setShowInstructions}
          className="w-full space-y-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Fretboard Challenge
            </h2>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                {showInstructions ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <HelpCircle className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle instructions</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">How to Play:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  Locate the <strong>target note</strong> displayed on the
                  screen.
                </li>
                <li>Click the correct position on the fretboard.</li>
                <li>
                  Score points for every correct answer before time runs out!
                </li>
              </ul>
              <div className="pt-2 border-t mt-2">
                <p className="text-xs">
                  <strong>Tip:</strong> The top string shown is the{" "}
                  <strong>Highest Pitch (G)</strong>. The bottom string is the{" "}
                  <strong>Lowest Pitch (E)</strong>.
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Game HUD */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-muted/30 p-4 rounded-xl border relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />

            {gameState === "playing" ? (
              <>
                <div className="flex items-center gap-3 z-10">
                  <div className="p-2 bg-background/50 backdrop-blur rounded-full border shadow-sm">
                    <Timer className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Time
                    </span>
                    <span
                      className={cn(
                        "text-2xl font-mono font-bold leading-none",
                        timeLeft < 10 && "text-red-500 animate-pulse",
                      )}
                    >
                      {timeLeft}s
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center z-10">
                  <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                    Find Note
                  </span>
                  <div className="flex items-center justify-center w-20 h-20 bg-background rounded-full border-4 border-primary/20 shadow-xl">
                    <span
                      className="text-4xl font-black text-primary"
                      key={targetNoteIndex}
                    >
                      {getTargetNoteName()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right z-10">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Score
                    </span>
                    <span className="text-2xl font-mono font-bold leading-none text-primary">
                      {score}
                    </span>
                  </div>
                </div>
              </>
            ) : gameState === "finished" ? (
              <div className="w-full flex flex-col items-center justify-center py-4 space-y-4 z-10">
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-bold">Session Complete!</h3>
                  <p className="text-lg text-muted-foreground">
                    Final Score:{" "}
                    <span className="text-primary font-bold text-2xl">
                      {score}
                    </span>
                  </p>
                </div>
                <Button
                  onClick={startGame}
                  size="lg"
                  className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Play Again
                </Button>
              </div>
            ) : (
              <div className="w-full flex flex-col md:flex-row items-center justify-between py-2 gap-4 z-10">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="font-bold text-lg">Ready to Train?</h3>
                  <p className="text-sm text-muted-foreground">
                    Test your knowledge of the fretboard.
                  </p>
                </div>
                <Button
                  onClick={startGame}
                  size="lg"
                  className="rounded-full px-10 shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
                >
                  <Play className="mr-2 h-5 w-5 fill-current" /> Start Game
                </Button>
              </div>
            )}
          </div>

          {gameState === "playing" && (
            <Progress
              value={(timeLeft / GAME_DURATION) * 100}
              className="h-2 w-full transition-all duration-1000 ease-linear"
            />
          )}
        </div>

        {/* Fretboard Area */}
        <div className="relative pb-8 select-none">
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div
              className={cn(
                "min-w-[800px] pl-16 pr-4 py-10 rounded-xl border-y-4 border-x border-amber-900/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] relative transition-opacity duration-300",
                // Wood texture gradient background
                "bg-[#3e2723] bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:20px_20px]",
                gameState === "menu"
                  ? "opacity-80 grayscale-[0.3]"
                  : "opacity-100 ring-2 ring-primary/20",
              )}
            >
              {/* Nut (Left side bar) */}
              <div className="absolute left-16 top-0 bottom-0 w-4 bg-[#eecfa1] bg-[linear-gradient(to_right,rgba(0,0,0,0.1),transparent,rgba(0,0,0,0.2))] shadow-lg z-20 border-r border-[#8d6e63]"></div>

              {/* String Labels (Left of Nut) */}
              <div
                className="absolute left-4 top-10 bottom-10 flex flex-col justify-between items-center py-2 h-[calc(100%-80px)]"
                style={{ height: `${numStrings * 45}px` }}
              >
                {" "}
                {/* Match board height */}
                {/* Standard Tuning Labels (Hardcoded for visual clarity if standard) */}
                {/* We need to map this dynamically if tuning changes, but for now we assume labels match reversed stringsData */}
                {stringsData
                  .slice()
                  .reverse()
                  .map((stringVar, idx) => {
                    // Determine label based on open string note
                    const openNote = stringVar[0]; // Fret 0
                    return (
                      <div
                        key={idx}
                        className="h-10 flex items-center justify-center font-bold text-muted-foreground w-8"
                      >
                        {openNote.note.replace(/[0-9]/g, "")}
                      </div>
                    );
                  })}
              </div>

              {/* Fretboard Layout */}
              <div
                className="relative flex flex-col justify-between"
                style={{ height: `${numStrings * 45}px` }}
              >
                {/* 1. Fret Wires (Background Layer) */}
                <div className="absolute inset-0 w-full pointer-events-none">
                  {Array.from({ length: numFrets }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0"
                      style={{
                        left: `${(i + 1) * (100 / numFrets)}%`,
                        width: "0", // Wrapper
                      }}
                    >
                      {/* Fret Wire */}
                      <div className="absolute left-0 top-[-4px] bottom-[-4px] w-1 bg-gradient-to-r from-neutral-400 via-neutral-100 to-neutral-400 shadow-[2px_0_3px_rgba(0,0,0,0.3)] -translate-x-1/2 rounded-full z-10 opacity-90"></div>

                      {/* Fret Number */}
                      <div className="absolute -bottom-10 left-0 -translate-x-1/2 flex items-center justify-center">
                        <span
                          className={cn(
                            "text-[10px] font-mono font-bold transition-colors",
                            [3, 5, 7, 9, 12, 15].includes(i + 1)
                              ? "text-primary/70"
                              : "text-muted-foreground/30",
                          )}
                        >
                          {i + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. Frets Markers (Inlays & Side Dots) - Centered in Fret Space */}
                <div className="absolute inset-0 w-full pointer-events-none">
                  {Array.from({ length: numFrets }).map((_, i) => {
                    const fretCenterPercent = (i + 0.5) * (100 / numFrets);
                    const isMarkerFret = [3, 5, 7, 9, 12, 15].includes(i + 1);

                    if (!isMarkerFret) return null;

                    return (
                      <div
                        key={`marker-${i}`}
                        className="absolute top-0 bottom-0 flex flex-col items-center justify-center"
                        style={{
                          left: `${fretCenterPercent}%`,
                          width: "0",
                        }}
                      >
                        {/* Side Dot (Top Edge) */}
                        <div className="absolute top-[-24px] flex justify-center w-20">
                          {i + 1 === 12 ? (
                            <div className="flex gap-1">
                              <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 shadow-sm"></div>
                              <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 shadow-sm"></div>
                            </div>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 shadow-sm"></div>
                          )}
                        </div>

                        {/* Board Inlay (Middle) */}
                        <div className="absolute top-1/2 -translate-y-1/2 flex justify-center opacity-40 mix-blend-overlay">
                          {i + 1 === 12 ? (
                            <div className="flex gap-8">
                              <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm shadow-inner"></div>
                              <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm shadow-inner"></div>
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm shadow-inner"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 2. Strings & Interactive Hitboxes (Foreground Layer) */}
                {stringsData
                  .slice()
                  .reverse()
                  .map((stringVar, sIdx) => {
                    const actualStringIndex = numStrings - 1 - sIdx;
                    // Visual thickness based on string index (Index 0 is thickest/Low E)
                    const thickness = 4 - actualStringIndex * 0.6;

                    return (
                      <div
                        key={actualStringIndex}
                        className="relative w-full h-10 flex items-center"
                      >
                        {/* String Shadow (Cast on Board) */}
                        <div
                          className="absolute w-full z-0 blur-[1px] opacity-40 pointer-events-none"
                          style={{
                            height: `${thickness}px`,
                            top: `calc(50% + ${thickness}px)`,
                            backgroundColor: "black",
                          }}
                        />

                        {/* String Graphic */}
                        <div
                          className="absolute w-full z-10 pointer-events-none transition-all"
                          style={{
                            height: `${Math.max(1, thickness)}px`,
                            background:
                              actualStringIndex < 2
                                ? "repeating-linear-gradient(90deg, #9ca3af, #9ca3af 1px, #d1d5db 2px, #9ca3af 3px)" // Heavy winding (E, A)
                                : actualStringIndex === 2
                                  ? "repeating-linear-gradient(90deg, #9ca3af, #9ca3af 1px, #d1d5db 2px, #9ca3af 2px)" // Medium winding (D)
                                  : "linear-gradient(to bottom, #e5e7eb, #9ca3af)", // Smooth plain string (G)
                            boxShadow: "0 1px 1px rgba(0,0,0,0.4)",
                          }}
                        ></div>

                        {/* Interactive Note Hitboxes */}
                        {stringVar.map((noteData, fretIdx) => {
                          const fretWidthPercentage = 100 / numFrets;
                          const leftPercentage =
                            (fretIdx - 1) * fretWidthPercentage;

                          return (
                            <div
                              key={fretIdx}
                              className="absolute z-20 flex items-center justify-end pr-2 h-[120%] -top-[10%] group cursor-pointer" // Taller hitbox, right aligned
                              style={{
                                left:
                                  fretIdx === 0
                                    ? "-30px"
                                    : `${leftPercentage}%`,
                                width:
                                  fretIdx === 0
                                    ? "40px"
                                    : `${fretWidthPercentage}%`,
                              }}
                            >
                              {/* Hover Highlight Container - fills the fret space (Right aligned for fingering) */}
                              <div
                                className={cn(
                                  "absolute right-1 top-1 bottom-1 w-[70%] rounded-md transition-all duration-150",
                                  gameState === "playing"
                                    ? "group-hover:bg-primary/20 group-hover:shadow-[inset_0_0_10px_rgba(var(--primary),0.3)]"
                                    : "",
                                )}
                              ></div>

                              {/* Note Indicator (Circle) */}
                              <button
                                onClick={() => handleNoteClick(noteData)}
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-150 relative z-30",
                                  getNoteStyle(noteData),
                                )}
                              >
                                {/* Feedback Icon */}
                                {lastClickedFret?.string ===
                                  noteData.stringIndex &&
                                  lastClickedFret?.fret === noteData.fret &&
                                  (feedback?.type === "correct" ? (
                                    <CheckCircle className="h-6 w-6" />
                                  ) : feedback?.type === "incorrect" ? (
                                    <XCircle className="h-6 w-6" />
                                  ) : null)}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="absolute top-4 left-6 text-xs font-mono text-muted-foreground/50 rotate-90 origin-left">
              NUT
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {gameState === "menu"
            ? "Press Start Game to begin training."
            : "Click the fretboard location matching the requested note."}
        </div>
      </CardContent>
    </Card>
  );
}
