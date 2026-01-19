import { Timer, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { GameState } from "./types";

interface GameStatusProps {
  gameState: GameState;
  score: number;
  timeLeft: number;
  gameDuration: number;
  targetNoteName: string;
  onStartGame: () => void;
}

export function GameStatus({
  gameState,
  score,
  timeLeft,
  gameDuration,
  targetNoteName,
  onStartGame,
}: GameStatusProps) {
  return (
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
                <span className="text-4xl font-black text-primary">
                  {targetNoteName}
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
                <span className="text-primary font-bold text-2xl">{score}</span>
              </p>
            </div>
            <Button
              onClick={onStartGame}
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
              onClick={onStartGame}
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
          value={(timeLeft / gameDuration) * 100}
          className="h-2 w-full transition-all duration-1000 ease-linear"
        />
      )}
    </div>
  );
}
