"use client";

import { useState } from "react";
import { Ear, Play, RefreshCw, ChevronDown, ChevronUp, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  useEarTrainingGame,
  type Mode,
  type Difficulty,
} from "@/hooks/useEarTrainingGame";

const MODE_OPTIONS: { value: Mode; label: string; description: string }[] = [
  {
    value: "intervals",
    label: "Intervals",
    description: "Identify the interval between two notes",
  },
  {
    value: "chords",
    label: "Chord Quality",
    description: "Identify the quality of an arpeggiated chord",
  },
];

const DIFFICULTY_OPTIONS: {
  value: Difficulty;
  label: string;
  colorClass: string;
}[] = [
  { value: "easy", label: "Easy", colorClass: "text-green-500" },
  { value: "medium", label: "Medium", colorClass: "text-yellow-500" },
  { value: "hard", label: "Hard", colorClass: "text-red-500" },
];

export function EarTraining() {
  const [showInstructions, setShowInstructions] = useState(false);

  const {
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
  } = useEarTrainingGame();

  const timerPercent = (timeLeft / GAME_DURATION) * 100;

  const getAnswerButtonClass = (option: string) => {
    if (!answered) {
      return "border-2 border-muted hover:border-primary hover:bg-primary/10 transition-colors cursor-pointer";
    }
    if (option === question?.answer) {
      return "border-2 border-green-500 bg-green-500/20 text-green-400 font-bold";
    }
    if (option === selectedAnswer) {
      return "border-2 border-red-500 bg-red-500/20 text-red-400";
    }
    return "border-2 border-muted opacity-40 cursor-default";
  };

  // ── Menu ──────────────────────────────────────────────────────────────────

  if (gameState === "menu") {
    return (
      <Card className="w-full max-w-lg shadow-xl border-2 bg-card/95 backdrop-blur">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Ear className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h2 className="text-2xl font-bold">Ear Training</h2>
              <p className="text-sm text-muted-foreground">
                Train your musical ear — 60 seconds on the clock
              </p>
            </div>
          </div>

          {/* Mode selector */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Mode
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MODE_OPTIONS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-left transition-colors",
                    mode === m.value
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  <p className="font-semibold text-sm">{m.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {m.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty selector */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Difficulty
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={cn(
                    "py-2.5 rounded-lg border-2 text-center font-semibold text-sm transition-colors",
                    d.colorClass,
                    difficulty === d.value
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <button
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowInstructions((v) => !v)}
            >
              {showInstructions ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              How it works
            </button>
            {showInstructions && (
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                {mode === "intervals" ? (
                  <>
                    <li>Two notes play in sequence — root then the interval above.</li>
                    <li>Select the correct interval from the options.</li>
                    <li>Hit Replay to hear the notes again as many times as needed.</li>
                    <li>+10 points per correct answer. You have 60 seconds.</li>
                  </>
                ) : (
                  <>
                    <li>An arpeggiated chord plays from root to top.</li>
                    <li>Identify the chord quality from the options.</li>
                    <li>Hit Replay to hear the chord again as many times as needed.</li>
                    <li>+10 points per correct answer. You have 60 seconds.</li>
                  </>
                )}
              </ul>
            )}
          </div>

          <Button onClick={startGame} className="w-full" size="lg">
            Start Training
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Finished ──────────────────────────────────────────────────────────────

  if (gameState === "finished") {
    const rank =
      score >= 100
        ? "Elite"
        : score >= 70
        ? "Advanced"
        : score >= 40
        ? "Intermediate"
        : "Keep Practicing";

    return (
      <Card className="w-full max-w-lg shadow-xl border-2 bg-card/95 backdrop-blur">
        <CardContent className="p-6 space-y-6 text-center">
          <Ear className="h-12 w-12 text-primary mx-auto" />
          <div>
            <h2 className="text-3xl font-bold">Time&apos;s Up!</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "intervals" ? "Intervals" : "Chord Quality"} ·{" "}
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </p>
          </div>
          <div className="py-2">
            <p className="text-6xl font-bold text-primary">{score}</p>
            <p className="text-muted-foreground">points</p>
            <p className="mt-3 text-lg font-semibold">{rank}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={startGame} size="lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
            <Button variant="outline" onClick={resetToMenu} size="lg">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Playing ───────────────────────────────────────────────────────────────

  return (
    <Card className="w-full max-w-lg shadow-xl border-2 bg-card/95 backdrop-blur">
      <CardContent className="p-6 space-y-6">
        {/* Timer + Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium text-muted-foreground">
              {timeLeft}s
            </span>
            <span className="text-2xl font-bold text-primary">{score} pts</span>
          </div>
          <Progress value={timerPercent} className="h-2" />
        </div>

        {/* Prompt */}
        <div className="text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {mode === "intervals"
              ? "What interval is this?"
              : "What chord quality is this?"}
          </p>
        </div>

        {/* Replay */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={replayAudio}
            className="gap-2 px-10"
          >
            <Play className="h-5 w-5 fill-current" />
            Replay
          </Button>
        </div>

        {/* Answer grid */}
        {question && (
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option) => (
              <button
                key={option}
                disabled={answered}
                onClick={() => handleAnswer(option)}
                className={cn(
                  "p-3 rounded-lg text-sm font-medium text-center disabled:cursor-default",
                  getAnswerButtonClass(option)
                )}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Feedback */}
        <div className="h-10 flex items-center justify-center">
          {feedback && (
            <p
              className={cn(
                "text-sm font-semibold px-4 py-2 rounded-lg",
                feedback.type === "correct"
                  ? "text-green-500 bg-green-500/10"
                  : "text-red-400 bg-red-500/10"
              )}
            >
              {feedback.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
