import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function SettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Settings & Info">
          <Settings className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings & About</DialogTitle>
          <DialogDescription>
            Configuration and information about Advance Bass.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Attribution</h4>
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
            <h4 className="font-medium leading-none">About</h4>
            <div className="text-sm text-muted-foreground">
              <p>
                Advance Bass is a collection of tools and resources for bass
                players, built by a bass player.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
