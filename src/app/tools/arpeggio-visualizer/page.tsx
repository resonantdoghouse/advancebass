import { ArpeggioVisualizer } from "@/components/tools/ArpeggioVisualizer";

export const metadata = {
  title: "Bass Arpeggio Visualizer | Advance Bass",
  description: "Interactive bass guitar fretboard visualizer for chord tones and arpeggios. Master chord shapes on 4, 5, and 6 string basses.",
};

export default function ArpeggioVisualizerPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Arpeggio Visualizer</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visualize chord tones across the entire fretboard. Select a root and chord type to see the arpeggio pattern.
          </p>
        </div>
        
        <div className="flex justify-center">
            <ArpeggioVisualizer />
        </div>
      </div>
    </div>
  );
}
