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
// import { OnProgressProps } from "react-player/base";

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
  {
    label: "Jaco Pastorius - Portrait of Tracy (Live)",
    url: "https://www.youtube.com/watch?v=Getj2Q4C-8I",
  },
  {
    label: "Marcus Miller - Run for Cover (Live)",
    url: "https://www.youtube.com/watch?v=7-4A1C8jM6M",
  },
  {
    label: "Hadrien Feraud - Strasbourg St Denis (Solo)",
    url: "https://www.youtube.com/watch?v=pG7_gceIFL4",
  },
  {
    label: "James Jamerson - Ain't No Mountain High Enough (Isolated)",
    url: "https://www.youtube.com/watch?v=Kq-r4ZUpels",
  },
  {
    label: "John Patitucci - Electric Bass Solo (Minor Lament)",
    url: "https://www.youtube.com/watch?v=DimqT08xQcE",
  },
  {
    label: "Gary Willis - Tribal Tech 'Big Wave'",
    url: "https://www.youtube.com/watch?v=HaFiP6uG8Xll",
  },
  {
    label: "Christian McBride - Cherokee (Solo)",
    url: "https://www.youtube.com/watch?v=Qc1XjK-8_kE",
  },
];

export default function VideoLooper() {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=Getj2Q4C-8I");
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
  const [isSeeking, setIsSeeking] = useState(false);

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

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const setStartTimeToCurrent = () => {
    const currentTime = playerRef.current?.getCurrentTime();
    if (currentTime !== undefined) {
      setStartTime(currentTime);
    }
  };

  const setEndTimeToCurrent = () => {
    const currentTime = playerRef.current?.getCurrentTime();
    if (currentTime !== undefined) {
      setEndTime(currentTime);
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3">
              <Select onValueChange={(value) => setUrl(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a preset..." />
                </SelectTrigger>
                <SelectContent>
                  {PRESETS.map((preset) => (
                    <SelectItem key={preset.url} value={preset.url}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="text"
              placeholder="Enter YouTube URL"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUrl(e.target.value)
              }
              className="flex-1"
            />
          </div>

          <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden border border-border">
            <div className="absolute top-0 left-0 w-full h-full">
              <ReactPlayer
                ref={playerRef}
                url={url}
                width="100%"
                height="100%"
                playing={playing}
                volume={volume}
                muted={muted}
                playbackRate={playbackRate}
                onProgress={handleProgress}
                onDuration={handleDuration}
                controls={true}
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(played * duration)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Slider
                value={[played]}
                max={1}
                step={0.001}
                onValueChange={handleSeekChange}
                onValueCommit={handleSeekMouseUp}
              />
            </div>

            {/* Main Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handlePlayPause}>
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
        </CardContent>
      </Card>
    </div>
  );
}
