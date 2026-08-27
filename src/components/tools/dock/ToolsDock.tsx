"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Mic, X } from "lucide-react";
import { DockTuner } from "@/components/tools/dock/DockTuner";

export function ToolsDock() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const onTunerPage = pathname.startsWith("/tools/tuner");

  if (onTunerPage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="w-64 rounded-[14px] border border-border bg-card shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)] p-2">
          <DockTuner />
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close tuner" : "Open tuner"}
        aria-expanded={isOpen}
        className="w-9 h-9 rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </button>
    </div>
  );
}
