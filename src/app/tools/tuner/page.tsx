import { Tuner } from "@/components/tools/Tuner";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildToolSchema } from "@/lib/tool-schema";

const title = "Online Tuner (Bass & Guitar)";
const description =
  "Free online tuner for Bass and Guitar. Features chromatic strobe mode, microphone input, and reference tones.";
const path = "/tools/tuner";

export const metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} | Advance Bass`, description, url: path },
  twitter: { title: `${title} | Advance Bass`, description },
};

export default function TunerPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <JsonLd data={buildToolSchema({ name: title, description, path })} />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Instrument Tuner
          </h1>
          <p className="text-xl text-muted-foreground">
            Tune your Bass or Guitar with precision using our chromatic strobe
            tuner.
          </p>
        </div>

        <div className="flex justify-center">
          <Tuner />
        </div>
      </div>
    </div>
  );
}
