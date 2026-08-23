import MetronomeClient from "./MetronomeClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildToolSchema } from "@/lib/tool-schema";

const title = "Online Metronome";
const description =
  "Free online metronome for bass practice. Features adjustable BPM, time signatures, and visual beat indicators.";
const path = "/tools/metronome";

export const metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} | Advance Bass`, description, url: path },
  twitter: { title: `${title} | Advance Bass`, description },
};

export default function MetronomePage() {
  return (
    <>
      <JsonLd data={buildToolSchema({ name: title, description, path })} />
      <MetronomeClient />
    </>
  );
}
