"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getScaleNotes } from "@/lib/music-theory";
import { motion, AnimatePresence } from "framer-motion";

// Standard Circle of Fifths order
const FIFTHS_ORDER = [
  { root: "C", signature: "0", relativeMinor: "A" },
  { root: "G", signature: "1#", relativeMinor: "E" },
  { root: "D", signature: "2#", relativeMinor: "B" },
  { root: "A", signature: "3#", relativeMinor: "F#" },
  { root: "E", signature: "4#", relativeMinor: "C#" },
  { root: "B", signature: "5#", relativeMinor: "G#" },
  { root: "F#", label: "F#/Gb", signature: "6#/6b", relativeMinor: "D#/Eb" }, // Enharmonic overlap
  { root: "Db", signature: "5b", relativeMinor: "Bb" },
  { root: "Ab", signature: "4b", relativeMinor: "F" },
  { root: "Eb", signature: "3b", relativeMinor: "C" },
  { root: "Bb", signature: "2b", relativeMinor: "G" },
  { root: "F", signature: "1b", relativeMinor: "D" },
];

export default function CircleOfFifths() {
  const [isFourths, setIsFourths] = useState(false);
  const [selectedRoot, setSelectedRoot] = useState("C");

  // Reorder keys based on mode
  const currentOrder = useMemo(() => {
    // If Fourths, we want to go C -> F -> Bb ... which is the reverse of Fifths loop starting from C
    // Fifths: C, G, D ...
    // Fourths: C, F, Bb ...
    // To make it clockwise, we just reverse the array but keep C at top?
    // Let's standardise:
    // Fifths Clockwise: C(12), G(1), D(2)...
    // Fourths Clockwise: C(12), F(1), Bb(2)...

    if (!isFourths) return FIFTHS_ORDER;

    // Create copy, reverse everything except first C? No, standard logic:
    // [C, F, Bb, Eb, Ab, Db, Gb, B, E, A, D, G]
    const fourths = [FIFTHS_ORDER[0], ...[...FIFTHS_ORDER.slice(1)].reverse()];
    return fourths;
  }, [isFourths]);

  const selectedKeyData = useMemo(
    () => FIFTHS_ORDER.find((k) => k.root === selectedRoot) || FIFTHS_ORDER[0],
    [selectedRoot]
  );

  // Handle click on slice
  const handleSliceClick = (root: string) => {
    setSelectedRoot(root);
  };

  // Helper to generate Slice Path
  const getSlicePath = (
    index: number,
    total: number,
    outerRadius: number,
    innerRadius: number
  ) => {
    const startAngle = (index * 360) / total - 90 - 360 / total / 2; // Start shifted to center a slice at top
    const endAngle = ((index + 1) * 360) / total - 90 - 360 / total / 2;

    // Convert to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Outer points
    const x1 = (200 + outerRadius * Math.cos(startRad)).toFixed(3);
    const y1 = (200 + outerRadius * Math.sin(startRad)).toFixed(3);
    const x2 = (200 + outerRadius * Math.cos(endRad)).toFixed(3);
    const y2 = (200 + outerRadius * Math.sin(endRad)).toFixed(3);

    // Inner points
    const x3 = (200 + innerRadius * Math.cos(endRad)).toFixed(3);
    const y3 = (200 + innerRadius * Math.sin(endRad)).toFixed(3);
    const x4 = (200 + innerRadius * Math.cos(startRad)).toFixed(3);
    const y4 = (200 + innerRadius * Math.sin(startRad)).toFixed(3);

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;
  };

  const getLabelPosition = (index: number, total: number, radius: number) => {
    const angle = (index * 360) / total - 90;
    const rad = (angle * Math.PI) / 180;
    const x = (200 + radius * Math.cos(rad)).toFixed(3);
    const y = (200 + radius * Math.sin(rad)).toFixed(3);
    return { x, y };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <Card className="flex-1 w-full max-w-2xl mx-auto border-0 shadow-none bg-transparent">
        <CardContent className="p-0 flex flex-col items-center">
          {/* Controls */}
          <div className="flex items-center space-x-4 mb-6 bg-card/50 p-3 rounded-full border">
            <Label
              htmlFor="mode-toggle"
              className={`cursor-pointer ${
                !isFourths ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              Circle of Fifths
            </Label>
            <Switch
              id="mode-toggle"
              checked={isFourths}
              onCheckedChange={setIsFourths}
            />
            <Label
              htmlFor="mode-toggle"
              className={`cursor-pointer ${
                isFourths ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              Circle of Fourths
            </Label>
          </div>

          {/* SVG Visualizer */}
          <div className="relative w-full aspect-square max-w-[500px]">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full drop-shadow-2xl"
            >
              <defs>
                <mask id="inner-hole">
                  <rect x="0" y="0" width="400" height="400" fill="white" />
                  <circle cx="200" cy="200" r="60" fill="black" />
                </mask>
              </defs>

              {/* Slices */}
              {currentOrder.map((key, index) => {
                const isSelected = key.root === selectedRoot;
                const slicePath = getSlicePath(index, 12, 190, 80);

                return (
                  <g
                    key={key.root}
                    onClick={() => handleSliceClick(key.root)}
                    className="cursor-pointer transition-all duration-300 hover:opacity-90"
                    style={{ transformOrigin: "200px 200px" }}
                  >
                    <path
                      d={slicePath}
                      fill={
                        isSelected ? "hsl(var(--primary))" : "hsl(var(--card))"
                      }
                      stroke="hsl(var(--background))"
                      strokeWidth="2"
                      className="transition-colors duration-300"
                    />
                    {/* Major Key Label */}
                    <text
                      x={getLabelPosition(index, 12, 160).x}
                      y={getLabelPosition(index, 12, 160).y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-lg font-bold pointer-events-none transition-colors duration-300 ${
                        isSelected
                          ? "fill-primary-foreground"
                          : "fill-foreground"
                      }`}
                    >
                      {key.label || key.root}
                    </text>

                    {/* Minor Key Label (Inner Ring) */}
                    <text
                      x={getLabelPosition(index, 12, 110).x}
                      y={getLabelPosition(index, 12, 110).y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-sm font-medium pointer-events-none transition-colors duration-300 opacity-70 ${
                        isSelected
                          ? "fill-primary-foreground"
                          : "fill-muted-foreground"
                      }`}
                    >
                      {key.relativeMinor}m
                    </text>

                    {/* Signature (Edges) - Optional, maybe too cluttered? Let's hide for now or put very outer edge. */}
                    {/* Let's put it in the center info instead */}
                  </g>
                );
              })}

              {/* Center Information Hub */}
              <foreignObject
                x="120"
                y="120"
                width="160"
                height="160"
                className="pointer-events-none"
              >
                <div className="h-full w-full flex flex-col items-center justify-center text-center p-2 rounded-full bg-background/90 backdrop-blur-sm border-2 border-primary/20 shadow-inner">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedRoot}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="space-y-1"
                    >
                      <div className="text-3xl font-black text-primary">
                        {selectedKeyData.label || selectedKeyData.root}
                      </div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Major Scale
                      </div>
                      <div className="text-sm font-medium">
                        {selectedKeyData.signature === "0"
                          ? "No Sharps/Flats"
                          : selectedKeyData.signature
                              .replace("b", "♭")
                              .replace("#", "♯")}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </foreignObject>
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Info Panel */}
      <Card className="flex-1 w-full lg:max-w-md bg-card/50 backdrop-blur-sm border-primary/10">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              Scale Notes
            </h3>
            <div className="flex flex-wrap gap-2">
              {getScaleNotes(
                selectedKeyData.root.replace("/", ""),
                "major"
              ).map((note, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-2 bg-background rounded-md border min-w-[3rem]"
                >
                  <span className="text-lg font-bold">{note}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">
                    {i === 0 ? "Root" : i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-background/50 border">
              <div className="text-sm text-muted-foreground mb-1">
                Relative Minor
              </div>
              <div className="text-xl font-bold">
                {selectedKeyData.relativeMinor} Minor
              </div>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border">
              <div className="text-sm text-muted-foreground mb-1">
                Signature
              </div>
              <div className="text-xl font-bold">
                {selectedKeyData.signature === "0"
                  ? "Natural"
                  : selectedKeyData.signature
                      .replace("b", "♭")
                      .replace("#", "♯")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
