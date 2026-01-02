"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { autoCorrelate, getNoteFromFrequency, Note } from "@/lib/tuner-utils";

export function useTuner() {
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState<Note | null>(null);
  const [volume, setVolume] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // For Tone Generation
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const [isPlayingTone, setIsPlayingTone] = useState(false);
  const toneTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startListening = async () => {
    try {
      // Ensure we have a valid, running context
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
         audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioCtx = audioContextRef.current;
      
      // Resume if suspended (browser autoplay policy)
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      setIsListening(true);
      updatePitch();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      // Handle error state (e.g. permission denied)
    }
  };

  const stopListening = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (sourceRef.current) sourceRef.current.disconnect();
    if (analyserRef.current) analyserRef.current.disconnect();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    
    // Close and nullify the context to free resources and reset state
    if (audioContextRef.current) {
        audioContextRef.current.close().catch(e => console.warn("Error closing context", e));
        audioContextRef.current = null;
    }
    
    setIsListening(false);
    setDetectedNote(null);
    setVolume(0);
  };

  const updatePitch = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const bufferLength = analyserRef.current.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyserRef.current.getFloatTimeDomainData(buffer);

    // Calculate volume roughly for UI feedback
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
        sum += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sum / buffer.length);
    setVolume(Math.min(1, rms * 5)); // Amplify a bit for visual

    const frequency = autoCorrelate(buffer, audioContextRef.current.sampleRate);
    
    if (frequency !== -1) {
      const note = getNoteFromFrequency(frequency);
      setDetectedNote(note);
    } 

    rafIdRef.current = requestAnimationFrame(updatePitch);
  }, []);

  const playTone = (frequency: number) => {
    // Check if context exists and is not closed
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    
    // Resume if suspended
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    
    // Stop existing tone
    stopTone();

    // Create Nodes
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // 1. Oscillator: Sawtooth wave is good for bass (rich harmonics)
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // 2. Filter: Low-pass filter to simulate the "thump" and body
    filter.type = "lowpass";
    filter.Q.value = 1; // Slight resonance
    
    // Filter Envelope: Open up quickly then close down to simulate energy loss in higher harmonics
    // Start slightly open, snap open on attack, then decay
    filter.frequency.setValueAtTime(frequency * 2, ctx.currentTime); 
    filter.frequency.exponentialRampToValueAtTime(frequency * 8, ctx.currentTime + 0.05); // Attack
    filter.frequency.exponentialRampToValueAtTime(frequency * 3, ctx.currentTime + 0.5); // Decay to a warmer tone

    // 3. Amplitude Envelope (ADSR)
    // Attack: Fast but not instant (to avoid clicking)
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.02); 
    // Decay: Long exponential decay to silence (like a plucked string ringing out)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0); 

    // Connect graph: Osc -> Filter -> Gain -> Destination
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 3.5); // Auto stop after decay

    oscillatorRef.current = osc;
    gainNodeRef.current = gain;
    filterNodeRef.current = filter;
    setIsPlayingTone(true);
    
    // Clear any existing timeout
    if (toneTimeoutRef.current) clearTimeout(toneTimeoutRef.current);
    
    // Auto reset state after playing
    toneTimeoutRef.current = setTimeout(() => {
        setIsPlayingTone(false);
    }, 3000);
  };

  const stopTone = () => {
    if (oscillatorRef.current) {
        try {
            oscillatorRef.current.stop();
        } catch (e) { /* ignore if already stopped */ }
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
    }
    if (filterNodeRef.current) {
        filterNodeRef.current.disconnect();
        filterNodeRef.current = null;
    }
    if (toneTimeoutRef.current) {
        clearTimeout(toneTimeoutRef.current);
        toneTimeoutRef.current = null;
    }
    setIsPlayingTone(false);
  };

  useEffect(() => {
    return () => {
      stopListening();
      stopTone();
    };
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    detectedNote,
    volume,
    playTone,
    stopTone,
    isPlayingTone
  };
}
