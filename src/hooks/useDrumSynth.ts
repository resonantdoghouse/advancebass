"use client";

import { useRef, useCallback, useEffect, useState } from "react";

export function useDrumSynth() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (
      !audioContextRef.current ||
      audioContextRef.current.state === "closed"
    ) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const [currentKit, setCurrentKit] = useState<"electronic" | "techno" | "acoustic" | "funk" | "percussion">("electronic");
  const kitRef = useRef(currentKit);
  const buffersRef = useRef<Record<string, AudioBuffer | null>>({
    kick: null,
    snare: null,
    hihat: null,
    openhat: null,
    ride: null,
    tom: null
  });
  const [samplesLoaded, setSamplesLoaded] = useState(false);

  useEffect(() => { kitRef.current = currentKit; }, [currentKit]);

  // Load Samples (Wes Bos Kit)
  useEffect(() => {
    const loadSamples = async () => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const urls = {
            kick: "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/kick.wav",
            snare: "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/snare.wav",
            hihat: "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/hihat.wav",
            openhat: "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/openhat.wav",
            ride: "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/ride.wav",
            tom: "https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/tom.wav"
        };
        try {
            const keys = Object.keys(urls) as (keyof typeof urls)[];
            await Promise.all(keys.map(async (key) => {
                const response = await fetch(urls[key]);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
                buffersRef.current[key] = audioBuffer;
            }));
            setSamplesLoaded(true);
        } catch (e) {
            console.error("Failed to load drum samples", e);
        }
    };
    loadSamples();
  }, []);

  const playSample = useCallback((key: string, time: number, rate: number = 1.0) => {
      const ctx = getContext();
      const buffer = buffersRef.current[key];
      if (!buffer) return;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = rate;
      source.connect(ctx.destination);
      source.start(time);
  }, [getContext]);

  // --- Synthesis Helpers ---
  const play808Kick = (ctx: AudioContext, now: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
      gain.gain.setValueAtTime(1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
  };

  const play909Kick = (ctx: AudioContext, now: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.05); // Click
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.4);
      gain.gain.setValueAtTime(1, now); // Punchier
      gain.gain.exponentialRampToValueAtTime(0.5, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
      // Add transient click
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.type = "square";
      click.frequency.setValueAtTime(500, now);
      clickGain.gain.setValueAtTime(0.2, now);
      clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
      click.start(now);
      click.stop(now + 0.02);
  };

  const playPercussionKick = (ctx: AudioContext, now: number) => {
      // Low Conga
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.1); // Pitch bend
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
  };

  // --- Main Play Functions ---
  const playKick = useCallback((time: number) => {
    const ctx = getContext();
    const now = time || ctx.currentTime;
    switch (kitRef.current) {
        case "acoustic": if (buffersRef.current.kick) playSample("kick", now, 1.0); break;
        case "funk": if (buffersRef.current.kick) playSample("kick", now, 1.2); break; // Tighter
        case "techno": play909Kick(ctx, now); break;
        case "percussion": playPercussionKick(ctx, now); break;
        case "electronic": default: play808Kick(ctx, now); break;
    }
  }, [getContext, playSample]);

  const playSnare = useCallback((time: number) => {
      const ctx = getContext();
      const now = time || ctx.currentTime;
      if ((kitRef.current === "acoustic" || kitRef.current === "funk") && buffersRef.current.snare) {
          playSample("snare", now, kitRef.current === "funk" ? 1.3 : 1.0);
          return;
      }
      if (kitRef.current === "percussion") {
          // Bongo Slap (High)
           const osc = ctx.createOscillator();
           const gain = ctx.createGain();
           osc.connect(gain);
           gain.connect(ctx.destination);
           osc.frequency.setValueAtTime(400, now);
           osc.frequency.exponentialRampToValueAtTime(550, now + 0.05); // Slap up
           gain.gain.setValueAtTime(0.8, now);
           gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
           osc.start(now);
           osc.stop(now + 0.15);
           return;
      }
      // Electronic / Techno
      const is909 = kitRef.current === "techno";
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = is909 ? "lowpass" : "highpass"; // 909 Snare is noise-heavy but bodied
      if (is909) noiseFilter.frequency.value = 800;
      else noiseFilter.frequency.value = 1000;
      
      const noiseGain = ctx.createGain();
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseGain.gain.setValueAtTime(1, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + (is909 ? 0.25 : 0.2));
      noise.start(now);
      noise.stop(now + 0.25);
      
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      const oscGain = ctx.createGain();
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.frequency.setValueAtTime(is909 ? 200 : 250, now); 
      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);

    }, [getContext, playSample]);

  const playHiHat = useCallback((time: number) => {
      const ctx = getContext();
      const now = time || ctx.currentTime;
      if ((kitRef.current === "acoustic" || kitRef.current === "funk") && buffersRef.current.hihat) {
          playSample("hihat", now, kitRef.current === "funk" ? 1.4 : 1.0);
          return;
      }
      if (kitRef.current === "percussion") {
          // Shaker
          const bufferSize = ctx.sampleRate * 2;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.value = 6000;
          const gain = ctx.createGain();
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          noise.start(now);
          noise.stop(now + 0.05);
          return;
      }
      
      // Elec/Techno Hats
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = kitRef.current === "techno" ? 8000 : 10000; 
      const gain = ctx.createGain();
      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      noise.start(now);
      noise.stop(now + 0.05);
    }, [getContext, playSample]);

  const playOpenHat = useCallback((time: number) => {
    const ctx = getContext();
    const now = time || ctx.currentTime;
    if ((kitRef.current === "acoustic" || kitRef.current === "funk") && buffersRef.current.openhat) {
        playSample("openhat", now, kitRef.current === "funk" ? 1.4 : 1.0);
        return;
    }
    if (kitRef.current === "percussion") {
        // Cowbell (2 Square waves)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = "square";
        osc2.type = "square";
        osc1.frequency.value = 800; // 808 cowbell low
        osc2.frequency.value = 540; // 808 cowbell high
        osc1.connect(gain);
        osc2.connect(gain);
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1000;
        gain.connect(filter);
        filter.connect(ctx.destination);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.3);
        osc2.stop(now + 0.3);
        return;
    }
    // Synth Open Hat
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 9000;
    const gain = ctx.createGain();
    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    noise.start(now);
    noise.stop(now + 0.3);
  }, [getContext, playSample]);

  const playRide = useCallback((time: number) => {
    const ctx = getContext();
    const now = time || ctx.currentTime;
    if ((kitRef.current === "acoustic" || kitRef.current === "funk") && buffersRef.current.ride) {
        playSample("ride", now, kitRef.current === "funk" ? 1.1 : 1.0);
        return;
    }
    // Synth Ride
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc2.type = "square";
    osc.frequency.value = 500;
    osc2.frequency.value = 800;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "highpass";
    bandpass.frequency.value = 8000;
    osc.connect(bandpass);
    osc2.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
    osc.start(now);
    osc2.start(now);
    osc.stop(now + 1.0);
    osc2.stop(now + 1.0);
  }, [getContext, playSample]);

  const playTom = useCallback((time: number) => {
      const ctx = getContext();
      const now = time || ctx.currentTime;
      if ((kitRef.current === "acoustic" || kitRef.current === "funk") && buffersRef.current.tom) {
          playSample("tom", now, kitRef.current === "funk" ? 1.2 : 1.0);
          return;
      }
      if (kitRef.current === "percussion") {
          // High Conga
          playPercussionKick(ctx, now); // Re-use simple synth but maybe higher pitch
          return;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
  }, [getContext, playSample]);

  const resumeContext = useCallback(() => {
    const ctx = getContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
  }, [getContext]);

  const getCurrentTime = useCallback(() => {
    return getContext().currentTime;
  }, [getContext]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return { playKick, playSnare, playHiHat, playOpenHat, playRide, playTom, resumeContext, getCurrentTime, currentKit, setKit: setCurrentKit, samplesLoaded };
}
