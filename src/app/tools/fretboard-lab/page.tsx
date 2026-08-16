import { FretboardLab } from "@/components/tools/FretboardLab";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildToolSchema } from "@/lib/tool-schema";

const title = "Fretboard Lab";
const description =
  "Scale Visualizer, Arpeggio Visualizer, and Circle of Fifths in one connected workspace — pick a key and tuning once, explore all three.";
const path = "/tools/fretboard-lab";

export const metadata = {
  title,
  description,
  openGraph: { title: `${title} | Advance Bass`, description, url: path },
  twitter: { title: `${title} | Advance Bass`, description },
};

export default function FretboardLabPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <JsonLd data={buildToolSchema({ name: title, description, path })} />
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <span className="font-mono text-xs tracking-[0.1em] text-primary uppercase">
            Practice Room
          </span>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Fretboard Lab
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One key, one tuning, three connected tools. Switch between Scale
            Visualizer, Arpeggio Visualizer, and Circle of Fifths without
            losing your place.
          </p>
        </div>

        <FretboardLab />
      </div>
    </div>
  );
}
