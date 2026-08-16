"use client";

import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TUNING_PRESETS } from "@/lib/tuner-utils";
import { estimateUnitWeight, calcTensionLbs, LBS_TO_KG } from "@/lib/string-tension";
import { Info } from "lucide-react";

const BASS_PRESET_IDS = [
  "4-string-standard",
  "5-string-standard-low-b",
  "5-string-standard-high-c",
  "6-string-standard",
  "drop-d",
] as const;

// Typical gauges (inches) for a standard medium bass set, lowest string
// first — matches the string order used in TUNING_PRESETS.
const DEFAULT_GAUGES: Record<string, number[]> = {
  "4-string-standard": [0.105, 0.085, 0.065, 0.045],
  "5-string-standard-low-b": [0.13, 0.105, 0.085, 0.065, 0.045],
  "5-string-standard-high-c": [0.105, 0.085, 0.065, 0.045, 0.03],
  "6-string-standard": [0.13, 0.105, 0.085, 0.065, 0.045, 0.03],
  "drop-d": [0.105, 0.085, 0.065, 0.045],
};

const SCALE_LENGTH_PRESETS = [
  { label: "30\" (Short)", value: 30 },
  { label: "32\" (Medium)", value: 32 },
  { label: "34\" (Long — most common)", value: 34 },
  { label: "35\"", value: 35 },
  { label: "36\" (Extra Long)", value: 36 },
];

type Construction = "wound" | "plain";

type StringState = {
  note: string;
  octave: number;
  frequency: number;
  gauge: number;
  construction: Construction;
  unitWeight: number | null; // manually entered, required for accurate wound-string tension
};

function buildStringsFromPreset(presetId: string): StringState[] {
  const preset = TUNING_PRESETS[presetId];
  const gauges = DEFAULT_GAUGES[presetId] ?? preset.strings.map(() => 0.065);
  return preset.strings.map((s, i) => ({
    note: s.note,
    octave: s.octave,
    frequency: s.frequency,
    gauge: gauges[i] ?? 0.065,
    construction: "wound",
    unitWeight: null,
  }));
}

export function StringTensionCalculator() {
  const [presetId, setPresetId] = useState<string>("4-string-standard");
  const [scaleLength, setScaleLength] = useState<number>(34);
  const [strings, setStrings] = useState<StringState[]>(() =>
    buildStringsFromPreset("4-string-standard"),
  );

  const handlePresetChange = (id: string) => {
    setPresetId(id);
    setStrings(buildStringsFromPreset(id));
  };

  const updateString = (index: number, patch: Partial<StringState>) => {
    setStrings((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  };

  const results = useMemo(() => {
    return strings.map((s) => {
      const unitWeight =
        s.construction === "plain" || s.unitWeight === null
          ? estimateUnitWeight(s.gauge)
          : s.unitWeight;
      const tensionLbs = calcTensionLbs({
        unitWeight,
        scaleLengthInches: scaleLength,
        frequencyHz: s.frequency,
      });
      const isEstimate = s.construction === "wound" && s.unitWeight === null;
      return { tensionLbs, isEstimate };
    });
  }, [strings, scaleLength]);

  const totalLbs = results.reduce((sum, r) => sum + r.tensionLbs, 0);

  return (
    <div className="w-full rounded-[22px] border border-border bg-card shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] p-6 md:p-8 space-y-8">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-end justify-between bg-muted/30 border border-border/50 p-5 rounded-[16px] backdrop-blur">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase font-semibold">
            Tuning
          </span>
          <Select value={presetId} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-full md:w-[240px] bg-background/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BASS_PRESET_IDS.map((id) => (
                <SelectItem key={id} value={id}>{TUNING_PRESETS[id].name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto">
          <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase font-semibold">
            Scale Length
          </span>
          <Select
            value={String(scaleLength)}
            onValueChange={(v) => setScaleLength(Number(v))}
          >
            <SelectTrigger className="w-full md:w-[220px] bg-background/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCALE_LENGTH_PRESETS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto">
          <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase font-semibold">
            Custom Length (in)
          </span>
          <Input
            type="number"
            step="0.1"
            min="20"
            max="40"
            value={scaleLength}
            onChange={(e) => setScaleLength(Number(e.target.value) || 0)}
            className="w-full md:w-[140px] bg-background/60"
          />
        </div>
      </div>

      {/* Per-string table */}
      <div className="space-y-3">
        <div className="hidden md:grid grid-cols-[60px_1fr_110px_120px_140px_120px] gap-3 px-2 text-[11px] font-mono uppercase tracking-[0.08em] text-muted-foreground">
          <span>String</span>
          <span>Note</span>
          <span>Gauge (in)</span>
          <span>Construction</span>
          <span>Unit Weight (lb/in)</span>
          <span className="text-right">Tension</span>
        </div>

        {strings.map((s, i) => {
          const result = results[i];
          return (
            <div
              key={i}
              className="grid grid-cols-2 md:grid-cols-[60px_1fr_110px_120px_140px_120px] gap-3 items-center bg-muted/20 border border-border/40 rounded-[12px] px-4 py-3"
            >
              <span className="font-mono text-sm font-bold text-muted-foreground">
                #{i + 1}
              </span>
              <span className="font-semibold">
                {s.note}
                <sub className="text-xs text-muted-foreground ml-0.5">{s.octave}</sub>
                <span className="block md:inline text-xs text-muted-foreground md:ml-2">
                  {s.frequency.toFixed(2)} Hz
                </span>
              </span>

              <Input
                type="number"
                step="0.001"
                min="0.005"
                max="0.2"
                value={s.gauge}
                onChange={(e) => updateString(i, { gauge: Number(e.target.value) || 0 })}
                className="bg-background/60"
              />

              <div className="flex bg-background/60 rounded-[8px] p-0.5 border border-border/50">
                {(["wound", "plain"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => updateString(i, { construction: c })}
                    className={cn(
                      "flex-1 text-xs font-medium py-1.5 rounded-[6px] capitalize transition-colors",
                      s.construction === c
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {s.construction === "wound" ? (
                <Input
                  type="number"
                  step="0.0001"
                  min="0"
                  placeholder="from spec sheet"
                  value={s.unitWeight ?? ""}
                  onChange={(e) =>
                    updateString(i, {
                      unitWeight: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  className="bg-background/60"
                />
              ) : (
                <span className="text-xs text-muted-foreground font-mono px-1">
                  {estimateUnitWeight(s.gauge).toFixed(4)} (calculated)
                </span>
              )}

              <div className="text-right">
                <span className="font-heading font-bold text-lg tabular-nums">
                  {result.tensionLbs.toFixed(1)}
                  <span className="text-xs text-muted-foreground font-normal ml-1">lbs</span>
                </span>
                {result.isEstimate && (
                  <span className="block text-[10px] text-amber-500 font-medium">estimate</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-[14px] px-6 py-4">
        <span className="font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase font-semibold">
          Total Tension on Neck
        </span>
        <span className="font-heading font-bold text-2xl tabular-nums">
          {totalLbs.toFixed(1)} lbs
          <span className="text-sm text-muted-foreground font-normal ml-2">
            ({(totalLbs * LBS_TO_KG).toFixed(1)} kg)
          </span>
        </span>
      </div>

      {/* Methodology note */}
      <div className="flex items-start gap-3 bg-muted/20 border border-border/50 rounded-[14px] px-5 py-4 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <p>
            Tension is calculated from string physics: <code className="font-mono">T = UW × (2Lf)² / 386.4</code>,
            where UW is unit weight (lb/inch), L is scale length, and f is the target pitch frequency.
          </p>
          <p>
            <strong className="text-foreground">Plain</strong> strings use an exact unit weight
            derived from solid steel wire density. <strong className="text-foreground">Wound</strong>{" "}
            strings (most bass strings) can&apos;t be derived from gauge alone — the row shows a rough
            upper-bound estimate (marked <em>estimate</em>) until you enter the manufacturer&apos;s
            published unit weight, found on the string&apos;s tension chart.
          </p>
        </div>
      </div>
    </div>
  );
}
