import { Trophy, HelpCircle, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface InstructionsProps {
  showInstructions: boolean;
  setShowInstructions: (show: boolean) => void;
}

export function Instructions({
  showInstructions,
  setShowInstructions,
}: InstructionsProps) {
  return (
    <Collapsible
      open={showInstructions}
      onOpenChange={setShowInstructions}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Fretboard Challenge
        </h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            {showInstructions ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <HelpCircle className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle instructions</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">How to Play:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              Locate the <strong>target note</strong> displayed on the screen.
            </li>
            <li>Click the correct position on the fretboard.</li>
            <li>Score points for every correct answer before time runs out!</li>
          </ul>
          <div className="pt-2 border-t mt-2">
            <p className="text-xs">
              <strong>Tip:</strong> The top string shown is the{" "}
              <strong>Highest Pitch (G)</strong>. The bottom string is the{" "}
              <strong>Lowest Pitch (E)</strong>.
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
