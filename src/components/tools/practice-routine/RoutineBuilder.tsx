"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Routine, RoutineBlock } from "@/lib/practice-storage";

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function RoutineBuilder({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Routine;
  onSave: (routine: Routine) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [blocks, setBlocks] = useState<RoutineBlock[]>(
    initial?.blocks ?? [{ id: newId(), label: "", minutes: 5 }],
  );

  const addBlock = () => {
    setBlocks((prev) => [...prev, { id: newId(), label: "", minutes: 5 }]);
  };

  const updateBlock = (id: string, patch: Partial<RoutineBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const totalMinutes = blocks.reduce((sum, b) => sum + (b.minutes || 0), 0);
  const canSave = name.trim().length > 0 && blocks.some((b) => b.label.trim().length > 0);

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: initial?.id ?? newId(),
      name: name.trim(),
      blocks: blocks.filter((b) => b.label.trim().length > 0 && b.minutes > 0),
    });
  };

  return (
    <div className="w-full rounded-[22px] border border-border bg-card p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{initial ? "Edit Routine" : "New Routine"}</h2>
        <button
          onClick={onCancel}
          aria-label="Cancel"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase font-semibold">
          Routine Name
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning Warm-Up"
          className="bg-background/60"
        />
      </div>

      <div className="space-y-3">
        <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase font-semibold">
          Blocks ({totalMinutes} min total)
        </span>

        {blocks.map((block, i) => (
          <div key={block.id} className="flex gap-2 items-center bg-muted/20 border border-border/40 rounded-[12px] p-3">
            <span className="font-mono text-xs text-muted-foreground w-5 shrink-0">{i + 1}</span>
            <Input
              value={block.label}
              onChange={(e) => updateBlock(block.id, { label: e.target.value })}
              placeholder="e.g. Scales & arpeggios"
              className="bg-background/60 flex-1"
            />
            <Input
              type="number"
              min={1}
              max={120}
              value={block.minutes}
              onChange={(e) => updateBlock(block.id, { minutes: Number(e.target.value) || 0 })}
              className="bg-background/60 w-20 shrink-0"
            />
            <span className="text-xs text-muted-foreground shrink-0">min</span>
            <button
              onClick={() => removeBlock(block.id)}
              disabled={blocks.length === 1}
              aria-label="Remove block"
              className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          onClick={addBlock}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <Plus className="h-4 w-4" /> Add block
        </button>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="px-6 py-3 rounded-[10px] bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
        >
          Save Routine
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 rounded-[10px] border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
