"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Timer,
  Music,
  Repeat,
  Volume2,
  Search,
  Shuffle,
  Ear,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Tool = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

// Defined in requested order
const TOOLS: Tool[] = [
  {
    id: "tuner",
    title: "Tuner",
    description:
      "Chromatic, Bass, and Guitar tuner with strobe visualization and reference tones.",
    href: "/tools/tuner",
    icon: <Music className="h-6 w-6" />,
  },
  {
    id: "video-looper",
    title: "Video Looper",
    description:
      "Loop YouTube videos and control speed to master difficult sections.",
    href: "/tools/video-looper",
    icon: <Repeat className="h-6 w-6" />,
  },
  {
    id: "metronome",
    title: "Metronome",
    description:
      "Accurate, adjustable metronome with visual beats and odd time signatures.",
    href: "/tools/metronome",
    icon: <Timer className="h-6 w-6" />,
  },
  {
    id: "drum-machine",
    title: "Drum Machine",
    description: "Program drum patterns and beats to back your bass practice.",
    href: "/tools/drum-machine",
    icon: <Volume2 className="h-6 w-6" />,
  },
  {
    id: "scale-visualizer",
    title: "Scale Visualizer",
    description:
      "Interactive fretboard to learn scales and modes on 4, 5, or 6 string basses.",
    href: "/tools/scale-visualizer",
    icon: (
      <div className="h-6 w-6 flex items-center justify-center border-2 border-current rounded-md text-[11px] font-bold leading-none">
        #:
      </div>
    ),
  },
  {
    id: "arpeggio-visualizer",
    title: "Arpeggio Visualizer",
    description: "Visualize chord tones and arpeggios across the fretboard.",
    href: "/tools/arpeggio-visualizer",
    icon: (
      <div className="h-6 w-6 flex items-center justify-center border-2 border-current rounded-md text-[10px] font-bold leading-none">
        Arp
      </div>
    ),
  },
  {
    id: "fretboard-lab",
    title: "Fretboard Lab",
    description:
      "Scale Visualizer, Arpeggio Visualizer, and Circle of Fifths connected — one key, one tuning, three tools.",
    href: "/tools/fretboard-lab",
    icon: (
      <div className="h-6 w-6 flex items-center justify-center border-2 border-current rounded-md text-[9px] font-bold leading-none">
        Lab
      </div>
    ),
  },
  {
    id: "ear-training",
    title: "Ear Training",
    description:
      "Identify intervals and chord qualities by ear. Timed game for all levels.",
    href: "/tools/ear-training",
    icon: <Ear className="h-6 w-6" />,
  },
  {
    id: "circle-of-fifths",
    title: "Circle of Fifths",
    description:
      "Visual guide to key signatures, relative minors, and scale relationships.",
    href: "/tools/circle-of-fifths",
    icon: (
      <div className="h-6 w-6 flex items-center justify-center border-2 border-current rounded-full text-[10px] font-bold leading-none">
        5th
      </div>
    ),
  },
];

export function ToolsGallery() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "alpha-asc" | "alpha-desc">(
    "default",
  );

  const filterTools = (tools: Tool[]) => {
    let filtered = tools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (sortBy === "alpha-asc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "alpha-desc") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }
    // "default" keeps the definition order
    return filtered;
  };

  const filteredTools = filterTools([...TOOLS]);

  const handleRandomTool = () => {
    const randomTool = TOOLS[Math.floor(Math.random() * TOOLS.length)];
    router.push(randomTool.href);
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/90 backdrop-blur p-5 rounded-[16px] border border-border/70 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/60"
          />
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-[180px] bg-background/60">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Order</SelectItem>
              <SelectItem value="alpha-asc">Name (A-Z)</SelectItem>
              <SelectItem value="alpha-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleRandomTool}
            className="gap-2 bg-background/60 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-colors"
          >
            <Shuffle className="h-4 w-4" />
            <span className="hidden sm:inline">Random</span>
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="block group"
          >
            <Card className="h-full hover:border-primary/60 hover:shadow-[0_12px_30px_-10px_rgba(48,86,211,0.15)] dark:hover:shadow-[0_12px_35px_-10px_rgba(91,155,255,0.25)] transition-all duration-200 interactive-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-[14px] bg-secondary/80 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shadow-sm">
                  {tool.icon}
                </div>
                <CardTitle className="group-hover:text-primary transition-colors text-xl">{tool.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-semibold text-primary inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  Open Tool &rarr;
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}

        {filteredTools.length === 0 && (
          <div className="col-span-full text-center py-16 bg-card rounded-[18px] border border-border text-muted-foreground">
            No tools found matching "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
}
