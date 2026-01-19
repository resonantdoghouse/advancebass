import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export function DrumInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Drum Machine Info"
          className="h-8 w-8"
        >
          <Info className="h-4 w-4" />
          <span className="sr-only">Info</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Drum Machine Info</DialogTitle>
          <DialogDescription>
            Details about the drum machine and sound sources.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Sound Attribution</h4>
            <div className="text-sm text-muted-foreground">
              <p>
                Drum machine sound samples src:{" "}
                <a
                  href="https://github.com/wesbos/JavaScript30/tree/master/01%20-%20JavaScript%20Drum%20Kit/sounds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  Wes Bos (JavaScript30)
                </a>
                .
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium leading-none">Usage</h4>
            <div className="text-sm text-muted-foreground">
              <ul className="list-disc pl-4 space-y-1">
                <li>Click grid squares to toggle beats.</li>
                <li>Adjust Swing to add groove (human feel).</li>
                <li>Select different kits for various styles.</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
