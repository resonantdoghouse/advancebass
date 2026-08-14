"use client";

import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface VideoTimelineProps {
  played: number;
  duration: number;
  startTime: number;
  endTime: number;
  loop: boolean;
  onSeek: (value: number[]) => void;
  onSeekCommit: (value: number[]) => void;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
  onLoopChange: (loop: boolean) => void;
  onSetStartTimeToCurrent: () => void;
  onSetEndTimeToCurrent: () => void;
  formatTime: (seconds: number) => string;
}

export function VideoTimeline({
  played,
  duration,
  startTime,
  endTime,
  loop,
  onSeek,
  onSeekCommit,
  onStartTimeChange,
  onEndTimeChange,
  onLoopChange,
  onSetStartTimeToCurrent,
  onSetEndTimeToCurrent,
  formatTime,
}: VideoTimelineProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"start" | "end" | null>(null);

  const handleDragStart = (type: "start" | "end") => {
    setDragging(type);
  };

  // Bound to window (not just the progress bar) so the drag keeps tracking
  // even when the pointer moves faster than it stays inside the thin bar.
  useEffect(() => {
    if (!dragging) return;

    const handleDrag = (clientX: number) => {
      if (!progressBarRef.current) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const percentage =
        Math.min(Math.max(0, clientX - rect.left), rect.width) / rect.width;

      const time = percentage * duration;
      const roundedTime = Math.round(time * 100) / 100;

      if (dragging === "start") {
        onStartTimeChange(Math.min(roundedTime, endTime));
      } else {
        onEndTimeChange(Math.max(roundedTime, startTime));
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleDrag(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleDrag(e.touches[0].clientX);
    };
    const handleDragEnd = () => setDragging(null);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchend", handleDragEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [dragging, duration, startTime, endTime, onStartTimeChange, onEndTimeChange]);

  return (
    <>
      {/* Timeline Slider & Loop Display */}
      <div className="space-y-1 pt-2">
        <div
          className="relative h-8 flex items-center select-none group"
          ref={progressBarRef}
        >
          <Slider
            value={[played]}
            max={1}
            step={0.001}
            onValueChange={onSeek}
            onValueCommit={onSeekCommit}
            className="z-10 cursor-pointer"
          />

          {/* Visual Loop Markers */}
          {loop && duration > 0 && (
            <>
              {/* Start Marker */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-emerald-500 cursor-ew-resize z-20 hover:scale-x-150 transition-transform"
                style={{ left: `${(startTime / duration) * 100}%` }}
                onMouseDown={() => handleDragStart("start")}
                onTouchStart={() => handleDragStart("start")}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
                  {formatTime(startTime)}
                </div>
              </div>

              {/* Loop Range Highlight */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-2 bg-emerald-500/20 pointer-events-none z-0 rounded-sm"
                style={{
                  left: `${(startTime / duration) * 100}%`,
                  width: `${((endTime - startTime) / duration) * 100}%`,
                }}
              />

              {/* End Marker */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-emerald-500 cursor-ew-resize z-20 hover:scale-x-150 transition-transform"
                style={{ left: `${(endTime / duration) * 100}%` }}
                onMouseDown={() => handleDragStart("end")}
                onTouchStart={() => handleDragStart("end")}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
                  {formatTime(endTime)}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground font-mono">
          <span>{formatTime(played * duration)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Loop Controls Panel */}
      <div
        className={`transition-all duration-300 rounded-lg border overflow-hidden ${
          loop
            ? "bg-emerald-500/10 border-emerald-500/50"
            : "bg-muted/20 border-border/50"
        }`}
      >
        <div className="p-3 flex items-center justify-between border-b border-border/10">
          <div className="flex items-center gap-3">
            <Switch
              id="loop-mode"
              checked={loop}
              onCheckedChange={onLoopChange}
              className="data-[state=checked]:bg-emerald-500"
            />
            <Label htmlFor="loop-mode" className="font-semibold cursor-pointer">
              Loop Section
            </Label>
          </div>
          {loop && (
            <span className="text-xs text-emerald-600 font-medium animate-pulse">
              Loop Active
            </span>
          )}
        </div>

        {loop && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-background/50">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Start Time
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  className="h-8 font-mono text-sm"
                  value={startTime}
                  step="0.1"
                  onChange={(e) => onStartTimeChange(Number(e.target.value))}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={onSetStartTimeToCurrent}
                >
                  Set
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">End Time</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  className="h-8 font-mono text-sm"
                  value={endTime}
                  step="0.1"
                  onChange={(e) => onEndTimeChange(Number(e.target.value))}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={onSetEndTimeToCurrent}
                >
                  Set
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
