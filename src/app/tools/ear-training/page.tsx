import { EarTraining } from "@/components/tools/EarTraining";
import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildToolSchema } from "@/lib/tool-schema";

const title = "Ear Training";
const description =
  "Train your musical ear. Identify intervals and chord qualities by ear — a timed game for bass players of all levels.";
const path = "/tools/ear-training";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} | Advance Bass`, description, url: path },
  twitter: { title: `${title} | Advance Bass`, description },
};

export default function EarTrainingPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <JsonLd data={buildToolSchema({ name: title, description, path })} />
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
