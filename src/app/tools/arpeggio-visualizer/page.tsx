import { ArpeggioVisualizer } from "@/components/tools/ArpeggioVisualizer";

export const metadata = {
  title: "Bass Arpeggio Visualizer | Advance Bass",
  description: "Interactive bass guitar fretboard visualizer for chord tones and arpeggios. Master chord shapes on 4, 5, and 6 string basses.",
};

export default function ArpeggioVisualizerPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <ArpeggioVisualizer />
        <div className="mt-10">
          <span className="font-mono text-xs tracking-[0.1em] text-primary uppercase">
            Arpeggio Visualizer
          </span>
          <h1 className="font-heading font-bold text-[38px] sm:text-[48px] tracking-[-0.03em] leading-[1.05] mt-3.5 mb-4">
            Map chord tones<br className="hidden sm:block" /> across every string.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-[480px]">
            Select a root and chord type to see every arpeggio position on 4, 5, or 6-string bass. Root, 3rd, 5th, and 7th color-coded at a glance.
          </p>
        </div>
      </div>
    </div>
  );
}
