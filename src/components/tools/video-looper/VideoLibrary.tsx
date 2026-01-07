"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import { VIDEO_PRESETS, VideoPreset } from "@/lib/video-presets";

interface VideoLibraryProps {
  onSelect: (preset: VideoPreset) => void;
}

export function VideoLibrary({ onSelect }: VideoLibraryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPresets = VIDEO_PRESETS.filter((preset) => {
    const q = searchQuery.toLowerCase();
    return (
      preset.title.toLowerCase().includes(q) ||
      preset.artist.toLowerCase().includes(q) ||
      preset.bassist.toLowerCase().includes(q) ||
      preset.genre.some((g) => g.toLowerCase().includes(q))
    );
  });

  const handleSelect = (preset: VideoPreset) => {
    onSelect(preset);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-2">
          <Search className="h-4 w-4" />
          Browse Library
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Video Library</DialogTitle>
          <DialogDescription>
            Browse our collection of bass lines and solos.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by song, artist, or bassist..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto border rounded-md">
          <div className="divide-y">
            {filteredPresets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSelect(preset)}
              >
                <div className="space-y-1">
                  <div className="font-medium flex items-center gap-2">
                    {preset.title}
                    {preset.difficulty === "Expert" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold">
                        Expert
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {preset.artist} •{" "}
                    <span className="text-primary">{preset.bassist}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
            {filteredPresets.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No results found for &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
