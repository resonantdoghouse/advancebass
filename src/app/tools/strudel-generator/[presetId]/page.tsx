"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import { PRESETS, StrudelPreset } from "../presets";
import { Play, Square, Code, Music, Settings2, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// no scroll area import
import Link from "next/link";



export default function StrudelGeneratorPage() {
  const params = useParams();
  const router = useRouter();

  // Find the requested preset from the URL slug or default to teen-town
  const presetId = params?.presetId as string;
  const initialPreset = PRESETS.find(p => p.id === presetId) || PRESETS.find(p => p.id === "teen-town") || PRESETS[0];

  const [activeCode, setActiveCode] = useState<string>(initialPreset.code);
  const [activePreset, setActivePreset] = useState<StrudelPreset>(initialPreset);
  const [showDocs, setShowDocs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempo, setTempo] = useState<number>(0.5);
  const [tempoCommit, setTempoCommit] = useState<number>(0.5);
  const [effect, setEffect] = useState<string>("none");

  // Sync state if the URL changes (e.g. from browser Back/Forward navigation)
  useEffect(() => {
    const matchedPreset = PRESETS.find(p => p.id === presetId);
    if (matchedPreset && matchedPreset.id !== activePreset.id) {
      setActivePreset(matchedPreset);
      setActiveCode(matchedPreset.code);
      
      const match = matchedPreset.code.match(/setcps\(([\d.]+)\)/);
      if (match) {
        setTempo(parseFloat(match[1]));
        setTempoCommit(parseFloat(match[1]));
      }
      setEffect("none");
    }
  }, [presetId]);

  // Filter presets based on search query
  const filteredPresets = PRESETS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered presets by category
  const groupedPresets = filteredPresets.reduce((acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category].push(preset);
    return acc;
  }, {} as Record<string, StrudelPreset[]>);

  const handlePresetSelect = (preset: StrudelPreset) => {
    setActivePreset(preset);
    setActiveCode(preset.code);
    router.push(`/tools/strudel-generator/${preset.id}`, { scroll: false });
  };

  const handleTempoChange = (newTempoArr: number[]) => {
    setTempo(newTempoArr[0]);
  };

  const handleTempoCommit = (newTempoArr: number[]) => {
    const newTempo = newTempoArr[0];
    setTempoCommit(newTempo);
    setActiveCode(prev => prev.replace(/setcps\([\d.]+\)/, `setcps(${newTempo})`));
  };

  const handleEffectChange = (newEffect: string) => {
    setEffect(newEffect);
    setActiveCode(prev => {
      // Remove any previously appended effect chains
      let cleanCode = prev
        .replace(/\n\.speed\([^\)]+\)/g, "")
        .replace(/\n\.shape\([^\)]+\)/g, "")
        .replace(/\n\.crush\([^\)]+\)/g, "")
        .replace(/\n\.lpf\([^\)]+\)/g, "");
        
      if (newEffect === "none") return cleanCode;
      
      // Map selections to Strudel DSP chains
      let dspChain = "";
      if (newEffect === "chipmunk") dspChain = "\n.speed(1.5)";
      if (newEffect === "screwed") dspChain = "\n.speed(0.8)";
      if (newEffect === "lofi") dspChain = "\n.crush(4).lpf(2000)";
      if (newEffect === "overdrive") dspChain = "\n.shape(0.85)";
      
      return cleanCode + dspChain;
    });
  };

  return (
    <div className="container max-w-7xl mx-auto py-8">
      {/* Script injected to enable <strudel-repl> custom element */}
      <Script src="https://unpkg.com/@strudel/embed@latest" strategy="lazyOnload" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent flex flex-wrap items-center gap-2 sm:gap-3">
            <Settings2 className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500 shrink-0" />
            <span className="leading-tight">Strudel Music Generator</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Live code beats, loops, and polyrhythms in your browser using Strudel JS.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant={showDocs ? "default" : "outline"}
            onClick={() => setShowDocs(!showDocs)}
            className="flex items-center gap-2 transition-all"
          >
            <Info className="h-4 w-4" />
            How to use
          </Button>
          <Button asChild variant="outline">
            <Link href="/tools">Back to Tools</Link>
          </Button>
        </div>
      </div>

      {showDocs && (
        <Card className="mb-8 border-purple-500/20 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-400" /> Let&#39;s get creative
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
            <p>
              <strong>What is this?</strong> Strudel is a live-coding environment (a port of TidalCycles) designed to generate music algorithmically using simple patterns.
            </p>
            <p>
              <strong>Instructions:</strong> Select a template from the left library to set the basic code structure. To run the code, hit `Shift + Enter` inside the embedded Strudel window. If it is your first time interacting with the frame, you must click play manually inside the Strudel interface to allow the browser to initiate Web Audio.
            </p>
            <p className="text-muted-foreground">Note: When switching patterns, the Strudel workspace will update automatically but you may need to evaluate it again for complex rhythm changes.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
        {/* Preset Library Sidebar */}
        <div className="lg:col-span-1 space-y-4 flex flex-col h-full bg-muted/40 rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-2 font-semibold pb-2 border-b">
            <Music className="h-5 w-5 text-primary" />
            Starter Beats Library
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search beats or genres..."
              className="pl-8 bg-background border-muted-foreground/20 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex-1 pr-4 -mr-4 h-[500px] overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div className="space-y-6 pb-6">
              {Object.entries(groupedPresets).map(([category, presets]) => (
                <div key={category}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                    {category}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {presets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset)}
                        className={`text-left group transition-all p-3 rounded-lg border ${
                          activePreset.id === preset.id
                            ? "bg-primary/10 border-primary/40 shadow-sm"
                            : "bg-card hover:bg-muted border-transparent hover:border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`font-medium text-sm ${
                              activePreset.id === preset.id ? "text-primary" : ""
                            }`}
                          >
                            {preset.name}
                          </span>
                          {activePreset.id === preset.id && (
                            <Play className="h-3 w-3 text-primary animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {preset.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(groupedPresets).length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No beats found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Editor Environment */}
        <div className="lg:col-span-3 rounded-xl overflow-hidden border shadow-sm bg-black/5 flex flex-col">
          <div className="bg-muted p-2 flex flex-col md:flex-row md:items-center px-4 border-b gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-red-400"></span>
              <span className="flex h-3 w-3 rounded-full bg-yellow-400"></span>
              <span className="flex h-3 w-3 rounded-full bg-green-400"></span>
            </div>
            <div className="md:ml-4 text-xs font-mono text-muted-foreground mr-auto">
              {activePreset.name.toLowerCase().replace(/\\s+/g, '-')}.strudel
            </div>
            
            <div className="flex flex-wrap items-center gap-6 border-t md:border-t-0 pt-2 md:pt-0">
              <div className="flex items-center gap-3">
                <Label className="text-xs text-muted-foreground whitespace-nowrap min-w-[70px]">Tempo: {tempo.toFixed(2)}</Label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">0.2</span>
                  <div className="w-24">
                    <Slider 
                      value={[tempo]} 
                      min={0.2} 
                      max={1.5} 
                      step={0.05} 
                      onValueChange={handleTempoChange} 
                      onValueCommit={handleTempoCommit}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">1.5</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground whitespace-nowrap">Filter FX:</Label>
                <Select value={effect} onValueChange={handleEffectChange}>
                  <SelectTrigger className="w-[140px] h-7 text-xs bg-background border-muted-foreground/20">
                    <SelectValue placeholder="Standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Clean</SelectItem>
                    <SelectItem value="overdrive">Heavy Overdrive</SelectItem>
                    <SelectItem value="lofi">8-Bit Lo-Fi</SelectItem>
                    <SelectItem value="chipmunk">High Pitch Tuning</SelectItem>
                    <SelectItem value="screwed">Chopped & Screwed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="hidden lg:block ml-4">
              <Badge variant="secondary" className="font-mono text-[10px]">
                Powered by strudel.cc
              </Badge>
            </div>
          </div>
          
          <div className="flex-1 w-full h-full min-h-[500px] relative bg-background">
            {/* The web component wrapper styling ensures it expands to full bounds */}
            <div className="absolute inset-0 p-2">
              <strudel-repl
                key={`${activePreset.id}-${effect}-${tempoCommit}`}
                code={activeCode}
                style={{ width: "100%", height: "100%", border: "none" }}
              ></strudel-repl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
