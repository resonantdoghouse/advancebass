"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

interface VideoControlsProps {
  playing: boolean;
  volume: number;
  muted: boolean;
  playbackRate: number;
  onPlayPause: () => void;
  onStop: () => void;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
  onPlaybackRateChange: (rate: number) => void;
}

export function VideoControls({
  playing,
  volume,
  muted,
  playbackRate,
  onPlayPause,
  onStop,
  onVolumeChange,
  onToggleMute,
  onPlaybackRateChange,
}: VideoControlsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-muted/40 p-3 rounded-lg border border-border/50">
      {/* Transport */}
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={onPlayPause}
        >
          {playing ? (
            <Pause className="h-5 w-5 fill-current" aria-label="Pause" />
          ) : (
            <Play className="h-5 w-5 fill-current ml-0.5" aria-label="Play" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={onStop}
        >
          <RotateCcw className="h-4 w-4" aria-label="Reset" />
        </Button>

        <div className="flex items-center gap-2 ml-2 px-2 py-1 bg-background rounded-full border shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-muted"
            onClick={onToggleMute}
          >
            {muted || volume === 0 ? (
              <VolumeX className="h-3 w-3" aria-label="Unmute" />
            ) : (
              <Volume2 className="h-3 w-3" aria-label="Mute" />
            )}
          </Button>
          <div className="w-20 shrink-0">
            <Slider
              value={[muted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={onVolumeChange}
            />
          </div>
        </div>
      </div>

      {/* Speed Controls */}
      <div className="flex flex-wrap justify-end gap-1">
        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
          <Button
            key={rate}
            variant={playbackRate === rate ? "default" : "secondary"}
            size="sm"
            className={`h-8 px-3 text-xs font-medium transition-all ${
              playbackRate === rate
                ? "shadow-md scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onPlaybackRateChange(rate)}
          >
            {rate}x
          </Button>
        ))}
      </div>
    </div>
  );
}
