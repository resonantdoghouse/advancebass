import { ScaleVisualizer } from "@/components/tools/ScaleVisualizer";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildToolSchema } from "@/lib/tool-schema";

const title = "Bass Scale Visualizer";
const description = "Interactive bass guitar fretboard visualizer. Explore scales and modes on 4, 5, and 6 string basses.";
const path = "/tools/scale-visualizer";

export const metadata = {
  title,
  description,
  openGraph: { title: `${title} | Advance Bass`, description, url: path },
  twitter: { title: `${title} | Advance Bass`, description },
};

export default function ScaleVisualizerPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <JsonLd data={buildToolSchema({ name: title, description, path })} />
      <div className="max-w-6xl mx-auto">
        <ScaleVisualizer />
        <div className="mt-10">
          <span className="font-mono text-xs tracking-[0.1em] text-primary uppercase">
            Scale Visualizer
          </span>
          <h1 className="font-heading font-bold text-[38px] sm:text-[48px] tracking-[-0.03em] leading-[1.05] mt-3.5 mb-4">
            See every scale<br className="hidden sm:block" /> light up on the neck.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-[480px]">
            Pick a key and a mode — the fretboard maps every shape across 4, 5, or 6-string bass in any tuning. Click any dot to hear it.
          </p>
        </div>
      </div>
    </div>
  );
}
