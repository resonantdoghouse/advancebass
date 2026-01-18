import { FretboardTrainer } from "@/components/tools/FretboardTrainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fretboard Trainer | Advance Bass",
  description:
    "Interactive bass guitar fretboard game. Memorize notes on the fretboard with this interactive quiz.",
};

export default function FretboardTrainerPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Fretboard Trainer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Train your musical memory. Locate notes on the fretboard against the
            clock.
          </p>
        </div>

        <div className="flex justify-center">
          <FretboardTrainer />
        </div>
      </div>
    </div>
  );
}
