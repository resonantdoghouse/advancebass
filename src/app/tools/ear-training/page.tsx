import { EarTraining } from "@/components/tools/EarTraining";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ear Training | Advance Bass",
  description:
    "Train your musical ear. Identify intervals and chord qualities by ear — a timed game for bass players of all levels.",
};

export default function EarTrainingPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Ear Training
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sharpen your musical ear. Identify intervals and chord qualities
            against the clock.
          </p>
        </div>

        <div className="flex justify-center">
          <EarTraining />
        </div>
      </div>
    </div>
  );
}
