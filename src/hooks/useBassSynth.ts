"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useBassSynth() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const toneTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize context lazily
  const getContext = useCallback(() => {
     if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
     }
     return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration = 2.0) => {
    const ctx = getContext();
    
    // Resume if suspended (browser requirements)
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    
    // Stop any existing tone
    if (oscillatorRef.current) {
        try { oscillatorRef.current.stop(); } catch (e) {}
        oscillatorRef.current.disconnect();
    }

    // Create Nodes
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // 1. Oscillator: Sawtooth for string harmonics
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // 2. Filter: Low-pass to simulate body and pluck dampening
    filter.type = "lowpass";
    filter.Q.value = 1; // Slight resonance
    
    // Filter Envelope: "Pluck" effect
    // Start at 2x freq (bright), ramp to 8x (attack click), decay to 3x (sustain body)
    filter.frequency.setValueAtTime(frequency * 2, ctx.currentTime); 
    filter.frequency.exponentialRampToValueAtTime(frequency * 8, ctx.currentTime + 0.05); 
    filter.frequency.exponentialRampToValueAtTime(frequency * 3, ctx.currentTime + 0.5); 

    // 3. Amplitude Envelope (ADSR - Bass pluck style)
    // Attack: Fast linear (0.02s)
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.02); 
    // Decay/Sustain: Exponential decay to silence
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration); 

    // Connect graph
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.1);

    oscillatorRef.current = osc;
    gainNodeRef.current = gain;
    filterNodeRef.current = filter;
    setIsPlaying(true);
    
    if (toneTimeoutRef.current) clearTimeout(toneTimeoutRef.current);
    toneTimeoutRef.current = setTimeout(() => {
        setIsPlaying(false);
    }, duration * 1000);

  }, [getContext]);

  const stopTone = useCallback(() => {
    if (oscillatorRef.current) {
        try { oscillatorRef.current.stop(); } catch(e) {}
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
        stopTone();
        if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => {});
        }
    };
  }, [stopTone]);

  return { playTone, stopTone, isPlaying };
}
