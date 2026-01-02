"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Ear } from "lucide-react";
import { useTuner } from "@/hooks/useTuner";
import { TUNING_PRESETS, StringConfig } from "@/lib/tuner-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function Tuner() {
  const [mode, setMode] = useState<"mic" | "ear">("ear");
  const [selectedPreset, setSelectedPreset] = useState<string>("4-string-standard");
  const { 
    isListening, 
    startListening, 
    stopListening, 
    detectedNote, 
    volume,
    playTone, 
    stopTone,
    isPlayingTone 
  } = useTuner();
  const [activeString, setActiveString] = useState<number | null>(null);

  const currentPreset = TUNING_PRESETS[selectedPreset as keyof typeof TUNING_PRESETS];

  // Auto-start/stop listening based on mode
  useEffect(() => {
    if (mode === "mic" && !isListening) {
      startListening();
    } else if (mode === "ear" && isListening) {
      stopListening();
    }
  }, [mode, isListening, startListening, stopListening]);

  const handlePlayString = (stringInfo: StringConfig, index: number) => {
    if (activeString === index && isPlayingTone) {
        stopTone();
        setActiveString(null);
    } else {
        playTone(stringInfo.frequency);
        setActiveString(index);
    }
  };

  const getNeedleRotation = () => {
    if (!detectedNote) return 0;
    // Map -50 to 50 cents to -45 to 45 degrees
    let rotation = detectedNote.cents;
    if (rotation > 50) rotation = 50;
    if (rotation < -50) rotation = -50;
    return rotation * 1.8; // Scale to degrees (approx)
  };

  const isNoteInTune = detectedNote && Math.abs(detectedNote.cents) < 5;

  return (
    <Card className="w-full max-w-2xl shadow-xl border-2 bg-card/95 backdrop-blur">
      <CardContent className="p-6">
        <div className="flex flex-col gap-8">
          
          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
             <div className="flex gap-2">
                 <Button 
                    variant={mode === "mic" ? "default" : "outline"}
                    onClick={() => { setMode("mic"); stopTone(); setActiveString(null); }}
                    className="w-24"
                 >
                    <Mic className="mr-2 h-4 w-4" /> Mic
                 </Button>
                 <Button 
                    variant={mode === "ear" ? "default" : "outline"}
                    onClick={() => { setMode("ear"); stopListening(); }}
                    className="w-24"
                 >
                    <Ear className="mr-2 h-4 w-4" /> Ear
                 </Button>
             </div>

             <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Tuning" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(TUNING_PRESETS).map(([key, preset]) => (
                        <SelectItem key={key} value={key}>{preset.name}</SelectItem>
                    ))}
                </SelectContent>
             </Select>
          </div>

          {/* Main Visual Area */}
          <div className="h-64 flex flex-col items-center justify-center bg-muted/20 rounded-xl border border-dashed relative overflow-hidden transition-colors duration-500"
               style={{
                   borderColor: isNoteInTune ? "rgb(34 197 94)" : "rgba(255, 255, 255, 0.1)",
                   backgroundColor: isNoteInTune ? "rgba(34, 197, 94, 0.05)" : "rgba(255, 255, 255, 0.02)"
               }}
          >
             
             {mode === "mic" ? (
                 <>
                    {detectedNote ? (
                        <>
                            <div className="text-8xl font-black tracking-tighter mb-2 relative z-10 flex items-start">
                                {detectedNote.note.charAt(0)}
                                <span className="text-4xl mt-2">{detectedNote.note.slice(1)}</span>
                                <span className="text-4xl mt-2 ml-1 text-muted-foreground font-light">{detectedNote.octave}</span>
                            </div>
                            
                            {/* Needle / Gauge */}
                            <div className="absolute bottom-0 w-64 h-32 overflow-hidden flex justify-center items-end opacity-80">
                                {/* Ticks */}
                                <div className="absolute bottom-0 w-full h-full flex justify-center">
                                    <div className="w-1 h-4 bg-muted-foreground/30 absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-28"></div>
                                    <div className="w-0.5 h-3 bg-muted-foreground/20 absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-28 -rotate-12 origin-bottom-center" style={{ transformOrigin: "50% 100%" }}></div>
                                    <div className="w-0.5 h-3 bg-muted-foreground/20 absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-28 rotate-12 origin-bottom-center" style={{ transformOrigin: "50% 100%" }}></div>
                                </div>

                                {/* Pivot/Needle */}
                                <div 
                                    className={`w-1.5 h-24 origin-bottom transition-transform duration-100 ease-linear rounded-full ${isNoteInTune ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" : "bg-red-500"}`}
                                    style={{ transform: `translateX(-50%) rotate(${getNeedleRotation()}deg)` }}
                                ></div>
                                <div className="absolute bottom-[-10px] w-4 h-4 rounded-full bg-foreground z-20"></div>
                            </div>
                            
                            <div className="absolute bottom-4 flex justify-between w-full max-w-[200px] text-xs font-mono text-muted-foreground">
                                <span>Flat</span>
                                <span className={isNoteInTune ? "text-green-500 font-bold" : ""}>{detectedNote.cents > 0 ? "+" : ""}{Math.round(detectedNote.cents)}</span>
                                <span>Sharp</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-muted-foreground flex flex-col items-center gap-3">
                            <div className="relative">
                                <Mic className={cn("h-12 w-12 opacity-50 transition-opacity", isListening && volume > 0.1 && "opacity-100")} />
                                {/* Visual Ring for Input Level */}
                                {isListening && (
                                    <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" style={{ animationDuration: `${Math.max(0.5, 1 - volume)}s` }} />
                                )}
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-medium">Listening...</span>
                                {/* Small Input Bar */}
                                <div className="w-24 h-1 bg-muted rounded-full mt-2 overflow-hidden">
                                    <div 
                                        className="h-full bg-primary transition-all duration-75"
                                        style={{ width: `${Math.min(100, volume * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                 </>
             ) : (
                <div className="flex flex-col items-center">
                    <Ear className="h-12 w-12 mb-4 text-muted-foreground opacity-50" />
                    <span className="text-muted-foreground">Select a string below to play reference tone</span>
                </div>
             )}
          </div>

          {/* String Selection / Playback */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {currentPreset.strings.map((stringInfo, idx) => (
                  <Button
                    key={idx}
                    variant={
                        (mode === "ear" && activeString === idx) 
                        ? "default" 
                         : (mode === "mic" && detectedNote && detectedNote.note === stringInfo.note.replace(/[0-9]/g, '') && detectedNote.octave === stringInfo.octave) 
                         ? "secondary" 
                         : "outline"
                    }
                    className={`h-24 flex flex-col gap-1 relative overflow-hidden group ${mode === "mic" ? "pointer-events-none" : ""}`}
                    onClick={() => mode === "ear" && handlePlayString(stringInfo, idx)}
                  >
                      <span className="text-2xl font-bold">{stringInfo.note}</span>
                      
                      {/* String Visual */}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-muted group-hover:bg-primary/50 transition-colors"></div>
                      <div 
                        className="absolute bottom-0 left-0 w-full bg-primary transition-all duration-300" 
                        style={{ 
                            height: (mode === "ear" && activeString === idx) ? "4px" : "1px",
                            opacity: (mode === "mic" && Math.abs((detectedNote?.frequency || 0) - stringInfo.frequency) < 5) ? 1 : 0.5 
                        }}
                      />
                  </Button>
              ))}
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}
