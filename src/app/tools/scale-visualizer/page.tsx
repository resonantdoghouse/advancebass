import { ScaleVisualizer } from "@/components/tools/ScaleVisualizer";

export const metadata = {
  title: "Bass Scale Visualizer | Advance Bass",
  description: "Interactive bass guitar fretboard visualizer. Explore scales and modes on 4, 5, and 6 string basses.",
};

export default function ScaleVisualizerPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Scale Visualizer</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master the fretboard. valid scales, keys, and modes on 4, 5, or 6 string basses.
          </p>
        </div>
        
        <div className="flex justify-center">
            <ScaleVisualizer />
        </div>
      </div>
    </div>
  );
}
