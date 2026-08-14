"use client";

import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Accepts "ss", "mm:ss", or "h:mm:ss" (decimals allowed on the last segment).
// Returns null for anything that doesn't parse so the caller can reject it
// without guessing at a fallback value.
function parseTimeInput(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(":");
  if (parts.length > 3 || parts.some((p) => p === "" || isNaN(Number(p)))) {
    return null;
  }

  const seconds = parts.reduce((total, part) => total * 60 + parseFloat(part), 0);
  return isNaN(seconds) || seconds < 0 ? null : seconds;
}

interface TimeInputProps {
  value: number;
  onCommit: (seconds: number) => void;
  formatTime: (seconds: number) => string;
  className?: string;
}

// Free-form mm:ss text entry that only commits (and reformats) on blur/Enter,
// so the field doesn't fight the user's cursor while they're mid-keystroke.
// `draft` is null whenever the field isn't being edited, in which case the
// displayed value is derived straight from `value` on every render.
function TimeInput({ value, onCommit, formatTime, className }: TimeInputProps) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft === null) return;
    const parsed = parseTimeInput(draft);
    if (parsed !== null) onCommit(parsed);
    setDraft(null);
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      placeholder="0:00"
      className={className}
      value={draft ?? formatTime(value)}
      onFocus={() => setDraft(formatTime(value))}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        } else if (e.key === "Escape") {
          setDraft(null);
          e.currentTarget.blur();
        }
      }}
    />
  );
}

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
  flashMarker?: "start" | "end" | null;
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
  flashMarker,
}: VideoTimelineProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"start" | "end" | null>(null);
  const [hoverPercent, setHoverPercent] = useState<number | null>(null);

  const handleDragStart = (type: "start" | "end") => {
    setDragging(type);
  };

  const handleTimelineHover = (e: React.MouseEvent) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percentage =
      Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
    setHoverPercent(percentage);
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
          onMouseMove={handleTimelineHover}
          onMouseLeave={() => setHoverPercent(null)}
        >
          <Slider
            value={[played]}
            max={1}
            step={0.001}
            onValueChange={onSeek}
            onValueCommit={onSeekCommit}
            className="z-10 cursor-pointer"
          />

          {/* Hover Time Preview */}
          {hoverPercent !== null && !dragging && duration > 0 && (
            <div
              className="absolute top-0 bottom-0 w-px bg-foreground/40 pointer-events-none z-10"
              style={{ left: `${hoverPercent * 100}%` }}
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap shadow-sm">
                {formatTime(hoverPercent * duration)}
              </div>
            </div>
          )}

          {/* Visual Loop Markers */}
          {loop && duration > 0 && (
            <>
              {/* Start Marker */}
              <div
                className={`absolute top-0 bottom-0 w-1 bg-emerald-500 cursor-ew-resize z-20 hover:scale-x-150 transition-transform ${
                  flashMarker === "start" ? "scale-x-[3] ring-2 ring-emerald-300" : ""
                }`}
                style={{ left: `${(startTime / duration) * 100}%` }}
                onMouseDown={() => handleDragStart("start")}
                onTouchStart={() => handleDragStart("start")}
              >
                <div
                  className={`absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded transition-opacity whitespace-nowrap shadow-sm ${
                    flashMarker === "start"
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
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
                className={`absolute top-0 bottom-0 w-1 bg-emerald-500 cursor-ew-resize z-20 hover:scale-x-150 transition-transform ${
                  flashMarker === "end" ? "scale-x-[3] ring-2 ring-emerald-300" : ""
                }`}
                style={{ left: `${(endTime / duration) * 100}%` }}
                onMouseDown={() => handleDragStart("end")}
                onTouchStart={() => handleDragStart("end")}
              >
                <div
                  className={`absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded transition-opacity whitespace-nowrap shadow-sm ${
                    flashMarker === "end"
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
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
                <TimeInput
                  className="h-8 font-mono text-sm"
                  value={startTime}
                  formatTime={formatTime}
                  onCommit={(time) =>
                    onStartTimeChange(
                      Math.min(Math.min(time, duration), endTime)
                    )
                  }
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
                <TimeInput
                  className="h-8 font-mono text-sm"
                  value={endTime}
                  formatTime={formatTime}
                  onCommit={(time) =>
                    onEndTimeChange(Math.max(Math.min(time, duration), startTime))
                  }
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
