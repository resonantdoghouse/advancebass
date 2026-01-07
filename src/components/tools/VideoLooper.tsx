"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Mic, Activity, Info } from "lucide-react";
import { getNoteFromFrequency, detectChord } from "@/lib/music-theory";
import { autoCorrelate } from "@/lib/tuner-utils";
import { BPMDetector } from "@/lib/bpm-detector";
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
import { VideoControls } from "./video-looper/VideoControls";
import { VideoTimeline } from "./video-looper/VideoTimeline";
import { VideoLibrary } from "./video-looper/VideoLibrary";
import { Visualizer } from "./video-looper/Visualizer";

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
  const [detectedBpm, setDetectedBpm] = useState(0);
  const bpmDetectorRef = useRef<BPMDetector | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
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

  useEffect(() => {
    setStartTime(0);
    setEndTime(0);
    setPlayed(0);
    setPlaying(false);
  }, [videoId]);

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
      setStartTime(Math.round(currentTime * 100) / 100);
    }
  };

  const setEndTimeToCurrent = () => {
    const currentTime = playerRef.current?.getCurrentTime();
    if (currentTime !== undefined) {
      setEndTime(Math.round(currentTime * 100) / 100);
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
      } as any);

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

  const lastNoteUpdateRef = useRef<number>(0);
  const lastChordUpdateRef = useRef<number>(0);

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

    // BPM Detection
    if (bpmDetectorRef.current) {
      const buf = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buf);
      const bpm = bpmDetectorRef.current.process(buf);
      if (bpm > 0) {
        setDetectedBpm(bpm);
      }
    }

    requestRef.current = requestAnimationFrame(updatePitch);
  }, []);

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
          </div>
        </div>

        {/* Right Column: Settings & Info */}
        <div className="w-full md:w-80 space-y-6">
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
