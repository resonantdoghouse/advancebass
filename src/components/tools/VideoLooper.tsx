"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OnProgressProps {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

// Dynamically import ReactPlayer to avoid hydration issues
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
}) as unknown as React.ComponentType<any>;

const PRESETS = [
  { label: "Jaco Pastorius - Teen Town", id: "a3113eNj4IA" },
  { label: "Jaco Pastorius - Havona", id: "sMQUFvv0WRY" },
  { label: "Jaco Pastorius - Donna Lee", id: "-0NNA6w8Zk4" },
  { label: "James Jamerson - Bernadette", id: "QLDqlgRK100" },
  { label: "James Jamerson - What's Going On", id: "jEpiyY1RpRI" },
  {
    label: "James Jamerson - Ain't No Mountain High Enough",
    id: "kAT3aVj-A_E",
  },
  { label: "Hadrien Feraud - Bubbatron (Live)", id: "7fX92BSNiYw" },
];

export default function VideoLooper() {
  const [videoId, setVideoId] = useState("a3113eNj4IA");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [loop, setLoop] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use a ref to access the player instance
  const playerRef = useRef<any>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [dragging, setDragging] = useState<"start" | "end" | null>(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleStop = () => {
    setPlaying(false);
    setPlayed(0);
    playerRef.current?.seekTo(0);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setMuted(value[0] === 0);
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleProgress = (state: OnProgressProps) => {
    if (!isSeeking) {
      setPlayed(state.played);

      // Handle Looping Logic
      if (loop && endTime > 0 && state.playedSeconds >= endTime) {
        playerRef.current?.seekTo(startTime);
      }
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
    if (endTime === 0) {
      setEndTime(duration);
    }
  };

  const handleSeekChange = (value: number[]) => {
    setIsSeeking(true);
    setPlayed(value[0]);
  };

  const handleSeekMouseUp = (value: number[]) => {
    setIsSeeking(false);
    playerRef.current?.seekTo(value[0]);
  };

  const handleDragStart = (type: "start" | "end") => {
    setDragging(type);
  };

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const Percentage =
      Math.min(Math.max(0, clientX - rect.left), rect.width) / rect.width;

    const time = Percentage * duration;
    const roundedTime = Math.round(time * 100) / 100;

    if (dragging === "start") {
      setStartTime(Math.min(roundedTime, endTime));
    } else {
      setEndTime(Math.max(roundedTime, startTime));
    }
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchend", handleDragEnd);
      return () => {
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [dragging]);

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const setStartTimeToCurrent = () => {
    const currentTime = playerRef.current?.getCurrentTime();
    if (currentTime !== undefined) {
      setStartTime(Math.round(currentTime * 100) / 100);
    }
  };

  const setEndTimeToCurrent = () => {
    const currentTime = playerRef.current?.getCurrentTime();
    if (currentTime !== undefined) {
      setEndTime(Math.round(currentTime * 100) / 100);
    }
  };

  // Helper to format time
  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Video & Controls */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-4 bg-background rounded-lg border p-4 shadow-sm">
            {/* Video Player */}
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden border border-border shadow-md">
              <div className="absolute top-0 left-0 w-full h-full">
                <ReactPlayer
                  ref={playerRef}
                  url={`https://www.youtube.com/watch?v=${videoId}`}
                  width="100%"
                  height="100%"
                  playing={playing}
                  volume={volume}
                  muted={muted}
                  playbackRate={playbackRate}
                  onProgress={handleProgress}
                  onDuration={handleDuration}
                  controls={false}
                />
              </div>
            </div>

            {/* Timeline Control */}
            <div className="space-y-1 pt-2">
              <div
                className="relative h-8 flex items-center select-none group"
                ref={progressBarRef}
                onMouseMove={(e) => dragging && handleDrag(e)}
                onTouchMove={(e) => dragging && handleDrag(e)}
              >
                <Slider
                  value={[played]}
                  max={1}
                  step={0.001}
                  onValueChange={handleSeekChange}
                  onValueCommit={handleSeekMouseUp}
                  className="z-10 cursor-pointer"
                />

                {/* Visual Loop Markers */}
                {loop && duration > 0 && (
                  <>
                    {/* Start Marker */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-yellow-500 cursor-ew-resize z-20 hover:scale-x-150 transition-transform"
                      style={{ left: `${(startTime / duration) * 100}%` }}
                      onMouseDown={() => handleDragStart("start")}
                      onTouchStart={() => handleDragStart("start")}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
                        {formatTime(startTime)}
                      </div>
                    </div>

                    {/* Loop Range Highlight */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-2 bg-yellow-500/20 pointer-events-none z-0 rounded-sm"
                      style={{
                        left: `${(startTime / duration) * 100}%`,
                        width: `${((endTime - startTime) / duration) * 100}%`,
                      }}
                    />

                    {/* End Marker */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-yellow-500 cursor-ew-resize z-20 hover:scale-x-150 transition-transform"
                      style={{ left: `${(endTime / duration) * 100}%` }}
                      onMouseDown={() => handleDragStart("end")}
                      onTouchStart={() => handleDragStart("end")}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
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

            {/* Main Controls Deck */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-muted/40 p-3 rounded-lg border border-border/50">
              {/* Transport */}
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={handlePlayPause}
                >
                  {playing ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={handleStop}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2 ml-2 px-2 py-1 bg-background rounded-full border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-muted"
                    onClick={handleToggleMute}
                  >
                    {muted || volume === 0 ? (
                      <VolumeX className="h-3 w-3" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={[muted ? 0 : volume]}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
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
                    onClick={() => handlePlaybackRateChange(rate)}
                  >
                    {rate}x
                  </Button>
                ))}
              </div>
            </div>

            {/* Loop Controls */}
            <div
              className={`transition-all duration-300 rounded-lg border overflow-hidden ${
                loop
                  ? "bg-yellow-500/10 border-yellow-500/50"
                  : "bg-muted/20 border-border/50"
              }`}
            >
              <div className="p-3 flex items-center justify-between border-b border-border/10">
                <div className="flex items-center gap-3">
                  <Switch
                    id="loop-mode"
                    checked={loop}
                    onCheckedChange={setLoop}
                    className="data-[state=checked]:bg-yellow-500"
                  />
                  <Label
                    htmlFor="loop-mode"
                    className="font-semibold cursor-pointer"
                  >
                    Loop Section
                  </Label>
                </div>
                {loop && (
                  <span className="text-xs text-yellow-600 font-medium animate-pulse">
                    Loop Active
                  </span>
                )}
              </div>

              {loop && (
                <div className="grid grid-cols-2 gap-4 p-3 bg-background/50">
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
                        onChange={(e) => setStartTime(Number(e.target.value))}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={setStartTimeToCurrent}
                      >
                        Set
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      End Time
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        className="h-8 font-mono text-sm"
                        value={endTime}
                        step="0.1"
                        onChange={(e) => setEndTime(Number(e.target.value))}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={setEndTimeToCurrent}
                      >
                        Set
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Info */}
        <div className="w-full md:w-80 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Track Selection</CardTitle>
              <CardDescription>Choose a preset or enter an ID</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Suggestions</Label>
                <Select onValueChange={(value) => setVideoId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a song..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>YouTube Video ID</Label>
                <Input
                  type="text"
                  placeholder="e.g. a3113eNj4IA"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-[10px] text-muted-foreground">
                  The ID is the part after <code>v=</code> in the URL.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/10 border-none shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p>
                1. <strong>Select a track</strong> or enter a YouTube ID.
              </p>
              <p>
                2. Use <strong>Spacebar</strong> to Play/Pause (if focused).
              </p>
              <p>
                3. <strong>Enable Loop</strong> and drag the yellow markers to
                repeat a section.
              </p>
              <p>
                4. Slow down difficult parts using the <strong>Speed</strong>{" "}
                controls.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
