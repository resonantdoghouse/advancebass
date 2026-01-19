"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Timer,
  Music,
  Repeat,
  Crosshair,
  Volume2,
  Search,
  Shuffle,
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
    icon: <Music className="h-8 w-8 text-primary mb-2" />,
  },
  {
    id: "video-looper",
    title: "Video Looper",
    description:
      "Loop YouTube videos and control speed to master difficult sections.",
    href: "/tools/video-looper",
    icon: <Repeat className="h-8 w-8 text-primary mb-2" />,
  },
  {
    id: "metronome",
    title: "Metronome",
    description:
      "Accurate, adjustable metronome with visual beats and odd time signatures.",
    href: "/tools/metronome",
    icon: <Timer className="h-8 w-8 text-primary mb-2" />,
  },
  {
    id: "drum-machine",
    title: "Drum Machine",
    description: "Program drum patterns and beats to back your bass practice.",
    href: "/tools/drum-machine",
    icon: <Volume2 className="h-8 w-8 text-primary mb-2" />,
  },
  {
    id: "scale-visualizer",
    title: "Scale Visualizer",
    description:
      "Interactive fretboard to learn scales and modes on 4, 5, or 6 string basses.",
    href: "/tools/scale-visualizer",
    icon: (
      <div className="h-8 w-8 text-primary mb-2 flex items-center justify-center border-2 border-primary rounded-md text-xs font-bold">
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
      <div className="h-8 w-8 text-primary mb-2 flex items-center justify-center border-2 border-primary rounded-md text-xs font-bold">
        Arp
      </div>
    ),
  },
  {
    id: "fretboard-trainer",
    title: "Fretboard Trainer",
    description:
      "Gamified fretboard memorization. Race against the clock to find notes.",
    href: "/tools/fretboard-trainer",
    icon: <Crosshair className="h-8 w-8 text-primary mb-2" />,
  },
  {
    id: "circle-of-fifths",
    title: "Circle of Fifths",
    description:
      "Visual guide to key signatures, relative minors, and scale relationships.",
    href: "/tools/circle-of-fifths",
    icon: (
      <div className="h-8 w-8 text-primary mb-2 flex items-center justify-center border-2 border-primary rounded-full text-xs font-bold">
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
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/30 p-4 rounded-lg">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-[180px]">
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
            className="gap-2"
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
            className="block transition-transform hover:scale-105"
          >
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                {tool.icon}
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary">
                  Open Tool &rarr;
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}

        {filteredTools.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No tools found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
