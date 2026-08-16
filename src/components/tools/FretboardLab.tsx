"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WESTERN_ROOTS } from "@/lib/music-theory";
import { ScaleVisualizer } from "@/components/tools/ScaleVisualizer";
import { ArpeggioVisualizer } from "@/components/tools/ArpeggioVisualizer";
import CircleOfFifths from "@/components/tools/CircleOfFifths";
import { cn } from "@/lib/utils";

const TUNING_OPTIONS = [
  { id: "4-string-standard", name: "4 String (Standard)" },
  { id: "5-string-standard-low-b", name: "5 String (Low B)" },
  { id: "5-string-standard-high-c", name: "5 String (High C)" },
  { id: "6-string-standard", name: "6 String (Standard)" },
];

const TABS = [
  { id: "scale", label: "Scale Visualizer" },
  { id: "arpeggio", label: "Arpeggio Visualizer" },
  { id: "circle", label: "Circle of Fifths" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function FretboardLab() {
  const [activeTab, setActiveTab] = useState<TabId>("scale");
  const [rootNote, setRootNote] = useState("C");
  const [tuningPresetId, setTuningPresetId] = useState("4-string-standard");

  return (
    <div className="space-y-6">
      {/* Shared controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-end justify-between bg-muted/30 border border-border/50 p-5 rounded-[16px] backdrop-blur">
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase font-semibold">
            Key (shared across all three)
          </span>
          <Select value={rootNote} onValueChange={setRootNote}>
            <SelectTrigger className="w-full sm:w-[120px] bg-background/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WESTERN_ROOTS.map((note) => (
                <SelectItem key={note} value={note}>{note}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {activeTab !== "circle" && (
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase font-semibold">
              Tuning (shared across fretboard tools)
            </span>
            <Select value={tuningPresetId} onValueChange={setTuningPresetId}>
              <SelectTrigger className="w-full sm:w-[220px] bg-background/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TUNING_OPTIONS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "text-sm font-semibold px-4 py-2 rounded-full transition-colors",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active tool */}
      {activeTab === "scale" && (
        <ScaleVisualizer
          rootNote={rootNote}
          onRootNoteChange={setRootNote}
          tuningPresetId={tuningPresetId}
          onTuningPresetChange={setTuningPresetId}
          hideRootControl
          hideTuningControl
        />
      )}
      {activeTab === "arpeggio" && (
        <ArpeggioVisualizer
          rootNote={rootNote}
          onRootNoteChange={setRootNote}
          tuningPresetId={tuningPresetId}
          onTuningPresetChange={setTuningPresetId}
          hideRootControl
          hideTuningControl
        />
      )}
      {activeTab === "circle" && (
        <CircleOfFifths rootNote={rootNote} onRootNoteChange={setRootNote} />
      )}
    </div>
  );
}
