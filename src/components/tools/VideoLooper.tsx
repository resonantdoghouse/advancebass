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
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Video Looper</CardTitle>
          <CardDescription>
            Loop and control speed of YouTube videos for practice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="md:w-1/3 w-full space-y-2">
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
            <div className="flex-1 space-y-2 w-full">
              <Label>YouTube Video ID</Label>
              <Input
                type="text"
                placeholder="e.g. a3113eNj4IA"
                value={videoId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setVideoId(e.target.value)
                }
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Get the ID from the URL: youtube.com/watch?v=
            <strong>ID_HERE</strong>
          </p>

          <div className="flex flex-col gap-4 bg-background rounded-lg">
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden border border-border">
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

            <div className="space-y-4">
              {/* Progress Bar */}
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(played * duration)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div
                  className="relative h-6 flex items-center select-none"
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
                    className="z-10"
                  />

                  {/* Visual Loop Markers */}
                  {loop && duration > 0 && (
                    <>
                      {/* Start Marker */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-yellow-500 cursor-ew-resize z-20 group"
                        style={{ left: `${(startTime / duration) * 100}%` }}
                        onMouseDown={() => handleDragStart("start")}
                        onTouchStart={() => handleDragStart("start")}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Start: {formatTime(startTime)}
                        </div>
                      </div>

                      {/* Loop Range Highlight */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-1 bg-yellow-500/30 pointer-events-none z-0"
                        style={{
                          left: `${(startTime / duration) * 100}%`,
                          width: `${((endTime - startTime) / duration) * 100}%`,
                        }}
                      />

                      {/* End Marker */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-yellow-500 cursor-ew-resize z-20 group"
                        style={{ left: `${(endTime / duration) * 100}%` }}
                        onMouseDown={() => handleDragStart("end")}
                        onTouchStart={() => handleDragStart("end")}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          End: {formatTime(endTime)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePlayPause}
                  >
                    {playing ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleStop}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-2 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleToggleMute}
                    >
                      {muted || volume === 0 ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="w-24">
                      <Slider
                        value={[muted ? 0 : volume]}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="loop-mode" className="cursor-pointer">
                      Loop
                    </Label>
                    <Switch
                      id="loop-mode"
                      checked={loop}
                      onCheckedChange={setLoop}
                    />
                  </div>

                  <div className="flex bg-secondary rounded-md p-1 items-center">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <Button
                        key={rate}
                        variant={playbackRate === rate ? "default" : "ghost"}
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => handlePlaybackRateChange(rate)}
                      >
                        {rate}x
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loop & Trim Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4 bg-muted/30">
                <div className="space-y-2">
                  <Label>Loop Start</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={startTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setStartTime(Number(e.target.value))
                      }
                    />
                    <Button variant="outline" onClick={setStartTimeToCurrent}>
                      Current
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Loop End</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={endTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEndTime(Number(e.target.value))
                      }
                    />
                    <Button variant="outline" onClick={setEndTimeToCurrent}>
                      Current
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
