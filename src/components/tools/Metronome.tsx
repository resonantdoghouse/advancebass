"use client";

import { useMetronome } from "@/hooks/useMetronome";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Square, GripHorizontal, Music, Zap, VolumeX, FastForward, Rewind } from "lucide-react";

interface MetronomeProps {
  compact?: boolean;
}

export function Metronome({ compact = false }: MetronomeProps) {
  const {
    isPlaying,
    start,
    stop,
    bpm,
    setBpm,
    beatsPerMeasure,
    setBeatsPerMeasure,
    currentBeat,
    subdivision,
    setSubdivision,
    tone,
    setTone,
    accentPattern,
    toggleAccent
  } = useMetronome();

  const handleBpmChange = (value: number[]) => {
    setBpm(value[0]);
  };

  const BeatsDisplay = () => (
    <div className="flex justify-center gap-1.5 mb-2 h-6 items-center">
      {accentPattern.map((level, i) => (
        <button
          key={i}
          onClick={() => toggleAccent(i)}
          className={`rounded-full transition-all duration-100 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring
            ${level === 2 ? 'h-4 w-4 shadow-[0_0_8px_theme(colors.primary.DEFAULT)]' : level === 1 ? 'h-3 w-3' : 'h-2 w-2 opacity-30'} // Size based on accent
            ${currentBeat === i && isPlaying && level !== 0 
                ? "bg-primary scale-125" 
                : level === 0 ? "bg-muted-foreground" : level === 2 ? "bg-primary" : "bg-primary/60"
            }
          `}
          title={level === 2 ? "Accent" : level === 1 ? "Normal" : "Mute"}
        />
      ))}
    </div>
  );

  return (
    <Card className={`shadow-lg border-2 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 ${compact ? "w-64" : "w-full max-w-md mx-auto"}`}>
      {compact && (
        <div className="flex justify-center h-5 items-center cursor-move text-muted-foreground/50 hover:text-foreground/80 transition-colors" title="Drag to move">
            <GripHorizontal className="h-4 w-4" />
        </div>
      )}
      
      <CardContent className={`p-4 ${compact ? "pt-0 space-y-3" : "space-y-6 pt-6"}`}>
        
        {/* Top Controls: BPM & Play */}
        <div className="flex justify-between items-center">
           <div className="flex flex-col">
               <div className="text-3xl font-bold tabular-nums leading-none tracking-tight">{bpm}</div>
               <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">BPM</span>
           </div>
           
           <div className="flex items-center gap-2">
                {!compact && (
                    <div className="flex gap-1 mr-2">
                         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setBpm(Math.floor(bpm / 2))} title="Half Time"><Rewind className="h-3 w-3" /></Button>
                         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setBpm(Math.min(300, bpm * 2))} title="Double Time"><FastForward className="h-3 w-3" /></Button>
                    </div>
                )}
                <Button
                    size={compact ? "sm" : "lg"}
                    variant={isPlaying ? "destructive" : "default"}
                    onClick={isPlaying ? stop : start}
                    aria-label={isPlaying ? "Stop Metronome" : "Start Metronome"}
                    className={`${compact ? "h-10 w-10 text-lg" : "h-14 w-14 text-2xl"} rounded-full shadow-md`}
                >
                    {isPlaying ? <Square className="fill-current" /> : <Play className="fill-current ml-1" />}
                </Button>
           </div>
        </div>

        {/* Beats Visualizer */}
        <BeatsDisplay />

        {/* BPM Slider */}
        <Slider
            value={[bpm]}
            onValueChange={handleBpmChange}
            min={30}
            max={300}
            step={1}
            className="w-full"
            aria-label="Tempo Slider"
        />

        {/* Bottom Controls: Time Sig, Subdivision, Tone */}
        <div className="space-y-3 pt-1">
             {/* Time Sig & Subdivision Row */}
             <div className="flex justify-between items-center">
                 <div className="flex items-center gap-1 bg-muted/40 rounded-lg p-1">
                   <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-background" onClick={() => setBeatsPerMeasure(Math.max(1, beatsPerMeasure - 1))}>-</Button>
                   <span className="tabular-nums w-4 text-center font-bold text-sm">{beatsPerMeasure}</span>
                   <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-background" onClick={() => setBeatsPerMeasure(Math.min(16, beatsPerMeasure + 1))}>+</Button>
                   <span className="text-xs text-muted-foreground pr-1">/ 4</span>
                 </div>

                 <Button 
                    variant={subdivision === 3 ? "secondary" : "ghost"} 
                    size="sm" 
                    className={`h-7 px-2 text-xs gap-1 ${subdivision === 3 ? "bg-primary/20 text-primary hover:bg-primary/30" : ""}`}
                    onClick={() => setSubdivision(subdivision === 3 ? 1 : 3)}
                 >
                    <Music className="h-3 w-3" />
                    <span>Triplet</span>
                 </Button>
             </div>

             {/* Tone Selection (Only visible if space permits or expanded) */}
             <div className="flex justify-between items-center pt-2 border-t text-xs">
                 <span className="text-muted-foreground font-medium">Sound</span>
                 <div className="flex gap-1">
                    {(['digital', 'woodblock', 'drum'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTone(t)}
                            className={`px-2 py-1 rounded-md transition-colors ${tone === t ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                 </div>
             </div>
             
             {compact && (
                <div className="flex justify-between pt-1">
                   <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setBpm(Math.floor(bpm / 2))}>1/2x</Button>
                   <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setBpm(Math.min(300, bpm * 2))}>2x</Button>
                </div>
             )}
        </div>

      </CardContent>
    </Card>
  );
}
