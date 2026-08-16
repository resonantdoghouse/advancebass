"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useToolKeyboard } from "@/hooks/useToolKeyboard";
import { KeyboardHints } from "./KeyboardHints";
import dynamic from "next/dynamic";
import {
  Mic,
  Activity,
  Info,
  Maximize2,
  Minimize2,
  Play,
  Square,
  Minus,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useMetronome } from "@/hooks/useMetronome";
import { useWakeLock } from "@/hooks/useWakeLock";
import { getNoteFromFrequency, detectChord } from "@/lib/music-theory";
import { autoCorrelate } from "@/lib/tuner-utils";
import { BPMDetector } from "@/lib/bpm-detector";
import { createAudioContext } from "@/lib/audio-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { VIDEO_PRESETS, VideoPreset } from "@/lib/video-presets";
import { extractYouTubeId } from "@/lib/youtube";
import { loadSavedLoop, saveLoop } from "@/lib/loop-storage";
import { VideoControls } from "./video-looper/VideoControls";
import { VideoTimeline } from "./video-looper/VideoTimeline";
import { VideoLibrary } from "./video-looper/VideoLibrary";
import { Visualizer } from "./video-looper/Visualizer";
import type ReactPlayerType from "react-player";
import type { ReactPlayerProps } from "react-player";

interface OnProgressProps {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

// Chromium-only getDisplayMedia extensions not yet in lib.dom.d.ts.
interface ChromiumDisplayMediaStreamOptions extends DisplayMediaStreamOptions {
  selfBrowserSurface?: "include" | "exclude";
  preferCurrentTab?: boolean;
}

// Dynamically import ReactPlayer to avoid hydration issues
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
}) as React.ComponentType<ReactPlayerProps & { ref?: React.Ref<ReactPlayerType> }>;

export default function VideoLooper() {
  const [videoId, setVideoId] = useState("a3113eNj4IA");
  const [currentPreset, setCurrentPreset] = useState<VideoPreset | null>(null);
  const [playing, setPlaying] = useState(false);
  useWakeLock(playing);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [loop, setLoop] = useState(true);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Audio Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedNote, setDetectedNote] = useState("-");
  const [detectedChord, setDetectedChord] = useState("-");
  const [detectedFreq, setDetectedFreq] = useState(0);
  const [detectedBpm, setDetectedBpm] = useState(0);
  const bpmDetectorRef = useRef<BPMDetector | null>(null);
  const metronome = useMetronome();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number>(0);
  // We keep noteHistory in state if we want to display it, but simplified here
  // const [noteHistory, setNoteHistory] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
    // Randomize initial video
    const randomPreset =
      VIDEO_PRESETS[Math.floor(Math.random() * VIDEO_PRESETS.length)];
    setVideoId(randomPreset.id);
    setCurrentPreset(randomPreset);
  }, []);

  // Restore a previously-saved loop for this video (if any) instead of
  // always resetting to the full clip, so a practice loop survives reloads
  // and revisits.
  useEffect(() => {
    const saved = loadSavedLoop(videoId);
    if (saved) {
      setStartTime(saved.startTime);
      setEndTime(saved.endTime);
      setLoop(saved.loop);
    } else {
      setStartTime(0);
      setEndTime(0);
    }
    setPlayed(0);
    setPlaying(false);
    setHasStartedPlaying(false);
  }, [videoId]);

  // Persist loop points per video as they change so they're there next time
  // this video is loaded.
  useEffect(() => {
    if (!isMounted) return;
    saveLoop(videoId, { startTime, endTime, loop });
  }, [isMounted, videoId, startTime, endTime, loop]);

  // Release the display-media capture and audio graph on unmount so a
  // leftover analysis session doesn't keep the tab-share indicator on.
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      audioContextRef.current?.close().catch(console.error);
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Keep isFullscreen in sync with the real Fullscreen API state so Esc,
  // browser chrome, or the OS all correctly fall back to the normal layout.
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else if (document.exitFullscreen) {
      await document.exitFullscreen();
    }
  }, []);

  // Use a ref to access the player instance
  const playerRef = useRef<ReactPlayerType>(null);
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

  const [flashMarker, setFlashMarker] = useState<"start" | "end" | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashLoopMarker = (marker: "start" | "end") => {
    setFlashMarker(marker);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => setFlashMarker(null), 700);
  };

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  // Pressing I/O implies the player wants a loop, so turn it on rather than
  // silently recording points that have no visible effect until the toggle
  // is flipped separately.
  const setStartTimeToCurrent = () => {
    const currentTime = playerRef.current?.getCurrentTime();
    if (currentTime !== undefined) {
      setStartTime(Math.round(currentTime * 100) / 100);
      setLoop(true);
      flashLoopMarker("start");
    }
  };

  const setEndTimeToCurrent = () => {
    const currentTime = playerRef.current?.getCurrentTime();
    if (currentTime !== undefined) {
      setEndTime(Math.round(currentTime * 100) / 100);
      setLoop(true);
      flashLoopMarker("end");
    }
  };

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
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }
      // Closing the AudioContext doesn't release the capture itself — the
      // tracks must be stopped explicitly or the browser's "sharing this
      // tab" indicator (and the underlying capture) stays active forever.
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
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
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
        selfBrowserSurface: "include",
        preferCurrentTab: true,
      } as ChromiumDisplayMediaStreamOptions);

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        stream.getTracks().forEach((track) => track.stop());
        alert("No audio track found. Please make sure to share audio.");
        return;
      }

      mediaStreamRef.current = stream;

      const audioContext = createAudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser); // We don't connect to destination to avoid feedback loop if not careful, or maybe we should? Usually for analysis we don't output audio if it's implicitly system audio.

      bpmDetectorRef.current = new BPMDetector(audioContext.sampleRate);

      setIsAnalyzing(true);
      updatePitch();

      stream.getVideoTracks()[0].onended = () => {
        toggleAudioAnalysis();
      };
    } catch (err) {
      console.error("Error starting audio analysis:", err);
      setIsAnalyzing(false);
    }
  };

  const SPEED_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const lastNoteUpdateRef = useRef<number>(0);
  const lastChordUpdateRef = useRef<number>(0);
  const lastDetectedBpmRef = useRef<number>(0);
  const bpmBufferRef = useRef<Float32Array<ArrayBuffer> | null>(null);

  const updatePitch = useCallback(() => {
    if (!audioContextRef.current || !analyserRef.current) return;

    const now = performance.now();
    const analyser = analyserRef.current;

    // Note Detection
    if (now - lastNoteUpdateRef.current > 125) {
      const buf = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buf);

      const ac = autoCorrelate(buf, audioContextRef.current.sampleRate);

      if (ac !== -1) {
        const { note, octave } = getNoteFromFrequency(ac);
        const noteName = `${note}${octave}`;
        setDetectedFreq(Math.round(ac));
        setDetectedNote(noteName);
      }
      lastNoteUpdateRef.current = now;
    }

    // Chord Detection
    if (now - lastChordUpdateRef.current > 250) {
      const byteBuf = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(byteBuf);
      const chord = detectChord(byteBuf, audioContextRef.current.sampleRate);
      if (chord !== "-") {
        setDetectedChord(chord);
      }
      lastChordUpdateRef.current = now;
    }

    // BPM Detection. BPMDetector.process() self-throttles its expensive
    // peak-detection work to ~2Hz internally and is cheap to call every
    // frame otherwise, but committing React state every frame regardless of
    // whether the estimate changed would re-render the whole tree (incl.
    // the YouTube iframe) at 60fps — only setState when the value moves.
    if (bpmDetectorRef.current) {
      if (
        !bpmBufferRef.current ||
        bpmBufferRef.current.length !== analyser.fftSize
      ) {
        bpmBufferRef.current = new Float32Array(analyser.fftSize);
      }
      const buf = bpmBufferRef.current;
      analyser.getFloatTimeDomainData(buf);
      const bpm = bpmDetectorRef.current.process(buf);
      if (bpm > 0 && bpm !== lastDetectedBpmRef.current) {
        lastDetectedBpmRef.current = bpm;
        setDetectedBpm(bpm);
      }
    }

    requestRef.current = requestAnimationFrame(updatePitch);
  }, []);

  const videoShortcuts = useMemo(
    () => ({
      Space: (e: KeyboardEvent) => {
        e.preventDefault();
        handlePlayPause();
      },
      ArrowLeft: (e: KeyboardEvent) => {
        e.preventDefault();
        const current = playerRef.current?.getCurrentTime() ?? 0;
        playerRef.current?.seekTo(Math.max(0, current - 5), "seconds");
      },
      ArrowRight: (e: KeyboardEvent) => {
        e.preventDefault();
        const current = playerRef.current?.getCurrentTime() ?? 0;
        playerRef.current?.seekTo(current + 5, "seconds");
      },
      KeyI: () => setStartTimeToCurrent(),
      KeyO: () => setEndTimeToCurrent(),
      KeyM: () => handleToggleMute(),
      KeyF: () => toggleFullscreen(),
      BracketLeft: () => {
        setPlaybackRate((prev) => {
          const idx = SPEED_STEPS.indexOf(prev);
          return idx > 0 ? SPEED_STEPS[idx - 1] : prev;
        });
      },
      BracketRight: () => {
        setPlaybackRate((prev) => {
          const idx = SPEED_STEPS.indexOf(prev);
          return idx < SPEED_STEPS.length - 1 ? SPEED_STEPS[idx + 1] : prev;
        });
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handlePlayPause, handleToggleMute, toggleFullscreen],
  );

  useToolKeyboard(videoShortcuts);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? "fixed inset-0 z-50 bg-background overflow-y-auto"
          : "container mx-auto p-4 max-w-5xl space-y-6"
      }
    >
      <div
        className={
          isFullscreen
            ? "w-full max-w-[1800px] mx-auto flex flex-col xl:flex-row gap-4 p-4 xl:p-6 xl:min-h-full"
            : "flex flex-col md:flex-row gap-6"
        }
      >
        {/* Left Column: Video & Controls */}
        <div
          className={
            isFullscreen
              ? "flex-1 min-w-0 flex flex-col gap-4 xl:justify-center"
              : "flex-1 space-y-4"
          }
        >
          <div className="flex flex-col gap-4 bg-background rounded-lg border p-4 shadow-sm">
            {/* Video Player */}
            <div
              className={
                isFullscreen
                  ? "flex flex-col items-center"
                  : undefined
              }
            >
              <div
                className={
                  isFullscreen
                    ? "relative bg-black rounded-lg overflow-hidden border border-border shadow-md w-full"
                    : "relative pt-[56.25%] bg-black rounded-lg overflow-hidden border border-border shadow-md"
                }
                style={
                  isFullscreen
                    ? {
                        aspectRatio: "16 / 9",
                        maxHeight: "min(70vh, 850px)",
                        maxWidth: "100%",
                      }
                    : undefined
                }
              >
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
                    onPlay={() => {
                      setPlaying(true);
                      setHasStartedPlaying(true);
                    }}
                    onPause={() => setPlaying(false)}
                    onEnded={() => setPlaying(false)}
                    controls={false}
                    config={{
                      youtube: {
                        playerVars: {
                          modestbranding: 1,
                          rel: 0,
                          iv_load_policy: 3,
                          disablekb: 1,
                        },
                      },
                    }}
                  />
                </div>

                {!hasStartedPlaying && (
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    aria-label="Play video"
                    className="absolute inset-0 z-[5] flex items-center justify-center bg-black/60 hover:bg-black/70 transition-colors group"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
                      <Play className="h-7 w-7 fill-current ml-1" />
                    </span>
                  </button>
                )}

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70 border border-white/10 text-white z-10"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <VideoTimeline
              played={played}
              duration={duration}
              startTime={startTime}
              endTime={endTime}
              loop={loop}
              onSeek={handleSeekChange}
              onSeekCommit={handleSeekMouseUp}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
              onLoopChange={setLoop}
              onSetStartTimeToCurrent={setStartTimeToCurrent}
              onSetEndTimeToCurrent={setEndTimeToCurrent}
              formatTime={formatTime}
              flashMarker={flashMarker}
            />

            <VideoControls
              playing={playing}
              volume={volume}
              muted={muted}
              playbackRate={playbackRate}
              onPlayPause={handlePlayPause}
              onStop={handleStop}
              onVolumeChange={handleVolumeChange}
              onToggleMute={handleToggleMute}
              onPlaybackRateChange={handlePlaybackRateChange}
            />

            <KeyboardHints
              hints={[
                { keys: ["Space"], label: "play / pause" },
                { keys: ["←", "→"], label: "seek 5s" },
                { keys: ["I"], label: "set in" },
                { keys: ["O"], label: "set out" },
                { keys: ["[", "]"], label: "speed" },
                { keys: ["M"], label: "mute" },
                { keys: ["F"], label: "fullscreen" },
              ]}
            />
          </div>
        </div>

        {/* Right Column: Settings & Info */}
        <div
          className={
            isFullscreen
              ? "w-full xl:w-96 shrink-0 space-y-6"
              : "w-full md:w-80 space-y-6"
          }
        >
          {/* Library & Info Column */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Current Track</span>
                <VideoLibrary
                  onSelect={(preset) => {
                    setVideoId(preset.id);
                    setCurrentPreset(preset);
                  }}
                />
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
                  Or paste a YouTube URL / ID
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g. a3113eNj4IA or a youtube.com link"
                    value={videoId}
                    onChange={(e) => {
                      const val = e.target.value;
                      const extractedId = extractYouTubeId(val);
                      if (extractedId) {
                        setVideoId(extractedId);
                        setCurrentPreset(null);
                        return;
                      }
                      if (val === "" || /^[a-zA-Z0-9_-]{0,11}$/.test(val)) {
                        setVideoId(val);
                        setCurrentPreset(null);
                      }
                    }}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audio Analysis Panel */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Audio Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-2xl font-bold font-mono tracking-tight flex items-baseline gap-2">
                    {detectedNote}
                    <span className="text-xs font-sans text-muted-foreground font-normal">
                      {detectedFreq > 0 ? `${detectedFreq}Hz` : ""}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Detected Note
                  </div>
                </div>
                {detectedBpm > 0 && (
                  <div className="text-right space-y-1">
                    <div className="text-xl font-bold font-mono">
                      {Math.round(detectedBpm)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Est. BPM
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 p-2 bg-background/50 rounded border">
                <div className="flex items-center gap-2 min-w-0">
                  <Button
                    variant={metronome.isPlaying ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={metronome.isPlaying ? metronome.stop : metronome.start}
                    title={metronome.isPlaying ? "Stop click track" : "Start click track"}
                  >
                    {metronome.isPlaying ? (
                      <Square className="h-3.5 w-3.5 fill-current" />
                    ) : (
                      <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                    )}
                  </Button>
                  <div className="leading-tight min-w-0">
                    <div className="font-mono font-bold text-sm">
                      {metronome.bpm} BPM
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      Click Track
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => metronome.setBpm(Math.max(30, metronome.bpm - 1))}
                    title="Decrease BPM"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => metronome.setBpm(Math.min(300, metronome.bpm + 1))}
                    title="Increase BPM"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                  {detectedBpm > 0 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => metronome.setBpm(Math.round(detectedBpm))}
                      title="Sync to detected BPM"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {detectedChord !== "-" && (
                <div className="p-2 bg-background/50 rounded border text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    Potential Chord
                  </div>
                  <div className="font-bold text-primary">{detectedChord}</div>
                </div>
              )}

              <Visualizer analyser={analyserRef.current} />

              <Button
                variant={isAnalyzing ? "destructive" : "default"}
                className={`w-full gap-2 ${isAnalyzing ? "" : "animate-pulse"}`}
                onClick={toggleAudioAnalysis}
              >
                <Mic className="h-4 w-4" />
                {isAnalyzing ? "Stop Listening" : "Start Analysis (Mic/Tab)"}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Help */}
          <Card className="text-xs text-muted-foreground">
            <CardContent className="pt-4 space-y-2">
              <p className="flex gap-2">
                <Info className="h-4 w-4 shrink-0 text-primary" />
                <span>
                  Select &quot;Tab&quot; when sharing screen to analyze the
                  video&apos;s audio directly.
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
