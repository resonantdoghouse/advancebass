"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Music4, X } from "lucide-react";
import { DockMetronome } from "@/components/tools/dock/DockMetronome";
import { DockTuner } from "@/components/tools/dock/DockTuner";

export function ToolsDock() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const onMetronomePage = pathname.startsWith("/tools/metronome");
  const onTunerPage = pathname.startsWith("/tools/tuner");

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-72 rounded-[16px] border border-border bg-card shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)] p-3 divide-y divide-border/50">
          {!onMetronomePage && <DockMetronome />}
          {!onTunerPage && <DockTuner />}
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close practice dock" : "Open practice dock"}
        aria-expanded={isOpen}
        className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Music4 className="h-5 w-5" />}
      </button>
    </div>
  );
}
