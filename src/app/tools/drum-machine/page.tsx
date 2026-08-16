import { DrumMachine } from "@/components/tools/DrumMachine";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildToolSchema } from "@/lib/tool-schema";

const title = "Drum Machine";
const description =
  "Practice your bass lines with a programmable drum machine backing track.";
const path = "/tools/drum-machine";

export const metadata = {
  title,
  description,
  openGraph: { title: `${title} | Advance Bass`, description, url: path },
  twitter: { title: `${title} | Advance Bass`, description },
};

export default function DrumMachinePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <JsonLd data={buildToolSchema({ name: title, description, path })} />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Drum Machine
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Program beats and practice your grooves.
          </p>
        </div>

        <div className="flex justify-center">
          <DrumMachine />
        </div>
      </div>
    </div>
  );
}
