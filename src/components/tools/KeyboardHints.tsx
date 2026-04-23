import { Keyboard } from "lucide-react";

interface Hint {
  keys: string[];
  label: string;
}

interface KeyboardHintsProps {
  hints: Hint[];
}

export function KeyboardHints({ hints }: KeyboardHintsProps) {
  return (
    <div className="hidden md:block rounded-lg border border-border/40 bg-muted/20 px-4 py-3 select-none">
      <div className="flex items-center gap-1.5 mb-2.5 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
        <Keyboard className="h-3.5 w-3.5" />
        <span>Keyboard Shortcuts</span>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {hints.map(({ keys, label }, i) => (
          <span key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              {keys.map((k) => (
                <kbd
                  key={k}
                  className="inline-flex items-center justify-center min-w-[1.75rem] h-7 rounded-md border border-border bg-background px-1.5 font-mono text-xs leading-none shadow-[0_2px_0_0_hsl(var(--border))] text-foreground"
                >
                  {k}
                </kbd>
              ))}
            </span>
            <span className="text-muted-foreground/80">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
