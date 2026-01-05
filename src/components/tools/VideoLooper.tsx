"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  Search,
  User,
  Music,
  Filter,
  ChevronRight,
  Info,
  Activity, // Added back
} from "lucide-react";
import { getNoteFromFrequency, detectChord } from "@/lib/music-theory";
import { autoCorrelate } from "@/lib/tuner-utils";
import { BPMDetector } from "@/lib/bpm-detector";
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
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VIDEO_PRESETS, BASSISTS, VideoPreset } from "@/lib/video-presets";

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

export default function VideoLooper() {
  const [videoId, setVideoId] = useState("a3113eNj4IA");
  const [currentPreset, setCurrentPreset] = useState<VideoPreset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [loop, setLoop] = useState(true);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Audio Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedNote, setDetectedNote] = useState("-");
  const [detectedChord, setDetectedChord] = useState("-");
  const [detectedFreq, setDetectedFreq] = useState(0);
  const [noteHistory, setNoteHistory] = useState<string[]>([]);
  const [detectedBpm, setDetectedBpm] = useState(0);
  const bpmDetectorRef = useRef<any>(null); // Type 'any' to avoid strict BPMDetector type dependency here for now, or import it.
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    setIsMounted(true);
    // Randomize initial video
    const randomPreset =
      VIDEO_PRESETS[Math.floor(Math.random() * VIDEO_PRESETS.length)];
    setVideoId(randomPreset.id);
    setCurrentPreset(randomPreset);
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

  const toggleAudioAnalysis = async () => {
    if (isAnalyzing) {
      // Stop Analysis
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      setIsAnalyzing(false);
      setDetectedNote("-");
      setDetectedFreq(0);
      setDetectedBpm(0);
      return;
    }

    try {
      // Start Analysis
      // selfBrowserSurface: "include" and preferCurrentTab: true help Edge/Chrome show the current tab option
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
        selfBrowserSurface: "include",
        preferCurrentTab: true,
      } as any);

      // We only need audio
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        alert("No audio track found. Please make sure to share audio.");
        return;
      }

      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      // Initialize BPM Detector
      bpmDetectorRef.current = new BPMDetector(audioContext.sampleRate);

      setIsAnalyzing(true);
      updatePitch();

      // Handle stream end (user stops sharing)
      stream.getVideoTracks()[0].onended = () => {
        toggleAudioAnalysis();
      };
    } catch (err) {
      console.error("Error starting audio analysis:", err);
      setIsAnalyzing(false);
    }
  };

  // Throttling refs
  const lastNoteUpdateRef = useRef<number>(0);
  const lastChordUpdateRef = useRef<number>(0);

  const updatePitch = () => {
    if (!audioContextRef.current || !analyserRef.current) return;

    const now = Date.now();
    const analyser = analyserRef.current;

    // Note Detection (Throttled to ~125ms / 16th notes @ 120bpm)
    if (now - lastNoteUpdateRef.current > 125) {
      const buf = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buf);

      const ac = autoCorrelate(buf, audioContextRef.current.sampleRate);

      if (ac !== -1) {
        const { note, octave, cents } = getNoteFromFrequency(ac);
        const noteName = `${note}${octave}`;
        setDetectedFreq(Math.round(ac));
        setDetectedNote(noteName);

        setNoteHistory((prev) => {
          const last = prev[prev.length - 1];
          if (last !== noteName) {
            // Keep last 10 notes
            return [...prev, noteName].slice(-10);
          }
          return prev;
        });
      }
      lastNoteUpdateRef.current = now;
    }

    // Chord Detection (Throttled to ~250ms / 8th notes @ 120bpm)
    if (now - lastChordUpdateRef.current > 250) {
      const byteBuf = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(byteBuf);
      const chord = detectChord(byteBuf, audioContextRef.current.sampleRate);
      if (chord !== "-") {
        setDetectedChord(chord);
      }
      lastChordUpdateRef.current = now;
    }

    // BPM Detection
    if (bpmDetectorRef.current) {
      const buf = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buf);
      const bpm = bpmDetectorRef.current.process(buf);
      if (bpm > 0) {
        setDetectedBpm(bpm);
      }
    }

    // Visualizer Drawing
    drawVisualizer();

    requestRef.current = requestAnimationFrame(updatePitch);
  };

  // Visualizer State & Logic
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frequencyBufferRef = useRef<Uint8Array | null>(null);
  const timeBufferRef = useRef<Uint8Array | null>(null);
  const [visualizerMode, setVisualizerMode] = useState<
    "waveform" | "frequency"
  >("frequency");
  // Ref to track mode inside the animation loop
  const visualizerModeRef = useRef<"waveform" | "frequency">("frequency");

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const analyser = analyserRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (visualizerModeRef.current === "frequency") {
      const bufferLength = analyser.frequencyBinCount;
      if (
        !frequencyBufferRef.current ||
        frequencyBufferRef.current.length !== bufferLength
      ) {
        frequencyBufferRef.current = new Uint8Array(bufferLength);
      }
      const dataArray = frequencyBufferRef.current;
      analyser.getByteFrequencyData(dataArray as any);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height;

        // Use a gradient or theme color
        ctx.fillStyle = `hsl(${(i / bufferLength) * 360}, 70%, 50%)`;
        // Or simpler theme match:
        // ctx.fillStyle = "rgb(250, 204, 21)"; // Yellowish

        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    } else {
      // Waveform
      const bufferLength = analyser.fftSize;
      if (
        !timeBufferRef.current ||
        timeBufferRef.current.length !== bufferLength
      ) {
        timeBufferRef.current = new Uint8Array(bufferLength);
      }
      const dataArray = timeBufferRef.current;
      analyser.getByteTimeDomainData(dataArray as any);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgb(250, 204, 21)"; // Yellow
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    }
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
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => setPlaying(false)}
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
                    <Pause
                      className="h-5 w-5 fill-current"
                      aria-label="Pause"
                    />
                  ) : (
                    <Play
                      className="h-5 w-5 fill-current ml-0.5"
                      aria-label="Play"
                    />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={handleStop}
                >
                  <RotateCcw className="h-4 w-4" aria-label="Reset" />
                </Button>

                <div className="flex items-center gap-2 ml-2 px-2 py-1 bg-background rounded-full border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-muted"
                    onClick={handleToggleMute}
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
          {/* Library & Info Column */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Current Track</span>
                <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="h-8 gap-2">
                      <Search className="h-4 w-4" />
                      Browse Library
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Video Library</DialogTitle>
                      <DialogDescription>
                        Browse our collection of bass lines and solos.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center gap-2 py-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by song, artist, or bassist..."
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto border rounded-md">
                      <div className="divide-y">
                        {VIDEO_PRESETS.filter((preset) => {
                          const q = searchQuery.toLowerCase();
                          return (
                            preset.title.toLowerCase().includes(q) ||
                            preset.artist.toLowerCase().includes(q) ||
                            preset.bassist.toLowerCase().includes(q) ||
                            preset.genre.some((g) =>
                              g.toLowerCase().includes(q)
                            )
                          );
                        }).map((preset) => (
                          <div
                            key={preset.id}
                            className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => {
                              setVideoId(preset.id);
                              setCurrentPreset(preset);
                              setIsLibraryOpen(false);
                            }}
                          >
                            <div className="space-y-1">
                              <div className="font-medium flex items-center gap-2">
                                {preset.title}
                                {preset.difficulty === "Expert" && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold">
                                    Expert
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {preset.artist} •{" "}
                                <span className="text-primary">
                                  {preset.bassist}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription>
                {currentPreset ? (
                  <span>
                    Playing{" "}
                    <span className="font-medium text-foreground">
                      {currentPreset.title}
                    </span>{" "}
                    by {currentPreset.artist}
                  </span>
                ) : (
                  "Load a preset or enter a custom ID"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Custom ID Input */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-xs text-muted-foreground">
                  Or load by YouTube ID
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g. a3113eNj4IA"
                    value={videoId}
                    onChange={(e) => {
                      setVideoId(e.target.value);
                      setCurrentPreset(null); // Clear preset if manual ID
                    }}
                    className="font-mono text-sm h-9"
                  />
                </div>
              </div>

              <div className="pt-2 text-center">
                <a
                  href="mailto:contact@advancebass.com?subject=Video%20Loop%20Request&body=Hi%2C%20I%27d%20like%20to%20request%20the%20following%20video%20to%20be%20added%20to%20the%20looper%20presets%3A%0A%0AArtist%3A%20%0ASong%3A%20%0AYoutube%20URL%3A%20"
                  className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors"
                >
                  Request a song to be added
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Bassist Info Card */}
          {currentPreset && BASSISTS[currentPreset.bassist] && (
            <Card className="bg-muted/30 border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    Bass Player Spotlight
                  </span>
                </div>
                <CardTitle className="text-lg">
                  {BASSISTS[currentPreset.bassist].name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground leading-relaxed">
                  {BASSISTS[currentPreset.bassist].bio}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {BASSISTS[currentPreset.bassist].style.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-full bg-background border text-[10px] font-medium text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audio Analysis Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  AI Audio Tools
                </CardTitle>
                <CardDescription>
                  Real-time analysis to detect notes, chords, and tempo from
                  audio.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-muted/50 rounded-lg p-0.5 max-[400px]:hidden">
                  <Button
                    variant={
                      visualizerMode === "frequency" ? "secondary" : "ghost"
                    }
                    size="sm"
                    className="h-7 text-[10px] px-2"
                    onClick={() => {
                      setVisualizerMode("frequency");
                      visualizerModeRef.current = "frequency";
                    }}
                  >
                    Spectrum
                  </Button>
                  <Button
                    variant={
                      visualizerMode === "waveform" ? "secondary" : "ghost"
                    }
                    size="sm"
                    className="h-7 text-[10px] px-2"
                    onClick={() => {
                      setVisualizerMode("waveform");
                      visualizerModeRef.current = "waveform";
                    }}
                  >
                    Wave
                  </Button>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Instructions</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>How to use</DialogTitle>
                      <DialogDescription>
                        Follow these steps to get the most out of the Looper and
                        AI Tools.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                          Playback & Looping
                        </h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                          <li>Select a track or enter a YouTube ID.</li>
                          <li>Use Spacebar to Play/Pause.</li>
                          <li>
                            Enable <strong>Loop Section</strong> to repeat a
                            specific part.
                          </li>
                          <li>
                            Drag the yellow markers on the timeline to set loop
                            points.
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                          AI Audio Analysis
                        </h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                          <li>
                            Click <strong>Start Analysis</strong> to enable
                            detection.
                          </li>
                          <li>
                            Select the <strong>Current Tab</strong> and check{" "}
                            <strong>Share Audio</strong> in the browser prompt.
                          </li>
                          <li>
                            The AI will detect the fundamental{" "}
                            <strong>Note</strong>, <strong>Chord</strong>{" "}
                            function, and <strong>BPM</strong>.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  className={`w-full ${
                    isAnalyzing
                      ? "bg-destructive hover:bg-destructive/90"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                  onClick={toggleAudioAnalysis}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  {isAnalyzing ? "Stop Analysis" : "Start Audio Analysis"}
                </Button>

                {/* Analysis Display */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-background rounded-md p-2 border shadow-sm">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                      Note
                    </span>
                    <div className="text-2xl font-bold text-primary">
                      {detectedNote}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {detectedFreq > 0 ? `${detectedFreq} Hz` : "--"}
                    </div>
                  </div>
                  <div className="bg-background rounded-md p-2 border shadow-sm">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                      Chord
                    </span>
                    <div className="text-2xl font-bold text-primary">
                      {detectedChord}
                    </div>
                  </div>
                  <div className="bg-background rounded-md p-2 border shadow-sm">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                      BPM
                    </span>
                    <div className="text-2xl font-bold text-primary">
                      {detectedBpm > 0 ? Math.round(detectedBpm) : "--"}
                    </div>
                  </div>
                </div>

                {/* Visualizer Canvas */}
                <div className="relative h-24 bg-black/90 rounded-md border border-primary/20 overflow-hidden shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={100}
                    className="w-full h-full"
                  />
                  {!isAnalyzing && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/50">
                      Visualizer Off
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
