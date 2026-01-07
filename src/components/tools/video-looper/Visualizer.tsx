"use client";

import { useEffect, useRef, useState } from "react";

interface VisualizerProps {
  analyser: AnalyserNode | null;
  className?: string;
  width?: number;
  height?: number;
}

export function Visualizer({
  analyser,
  className = "",
  width = 600,
  height = 200,
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const frequencyBufferRef = useRef<Uint8Array | null>(null);
  const timeBufferRef = useRef<Uint8Array | null>(null);

  // Could be exposed as a prop if we want user to toggle
  const [visualizerMode, setVisualizerMode] = useState<
    "waveform" | "frequency"
  >("frequency");

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      if (visualizerMode === "frequency") {
        const bufferLength = analyser.frequencyBinCount;
        if (
          !frequencyBufferRef.current ||
          frequencyBufferRef.current.length !== bufferLength
        ) {
          frequencyBufferRef.current = new Uint8Array(bufferLength);
        }
        const dataArray = frequencyBufferRef.current;
        analyser.getByteFrequencyData(dataArray as any);

        const barWidth = (w / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * h;
          // Use HSL for rainbow effect matching theme or frequency
          ctx.fillStyle = `hsl(${(i / bufferLength) * 360}, 70%, 50%)`;
          ctx.fillRect(x, h - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      } else {
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
        ctx.strokeStyle = "rgb(250, 204, 21)"; // Yellow-500 equivalent
        ctx.beginPath();

        const sliceWidth = w / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * h) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.lineTo(w, h / 2);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser, visualizerMode]);

  return (
    <div
      className={`relative rounded-lg overflow-hidden bg-black/90 border border-border shadow-inner ${className}`}
    >
      {/* Mode Toggle Overlay */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <button
          onClick={() => setVisualizerMode("frequency")}
          className={`text-[10px] px-2 py-1 rounded border ${
            visualizerMode === "frequency"
              ? "bg-primary text-primary-foreground"
              : "bg-background/50 hover:bg-background"
          }`}
        >
          FREQ
        </button>
        <button
          onClick={() => setVisualizerMode("waveform")}
          className={`text-[10px] px-2 py-1 rounded border ${
            visualizerMode === "waveform"
              ? "bg-primary text-primary-foreground"
              : "bg-background/50 hover:bg-background"
          }`}
        >
          WAVE
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full block"
      />
    </div>
  );
}
