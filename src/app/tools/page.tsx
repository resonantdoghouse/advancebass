import { ToolsGallery } from "./ToolsGallery";

export const metadata = {
  title: "Practice Tools",
  description:
    "Free online tools for bass players — metronome, tuner, drum machine, ear training, scale and arpeggio visualizers, and more.",
  openGraph: {
    title: "Practice Tools | Advance Bass",
    description:
      "Free online tools for bass players — metronome, tuner, drum machine, ear training, scale and arpeggio visualizers, and more.",
    url: "/tools",
  },
  twitter: {
    title: "Practice Tools | Advance Bass",
    description:
      "Free online tools for bass players — metronome, tuner, drum machine, ear training, scale and arpeggio visualizers, and more.",
  },
};

export default function ToolsPage() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-12 max-w-4xl">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Practice Tools
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Essential tools to help you improve your timing, tuning, and
          technique.
        </p>
      </div>

      <ToolsGallery />
    </div>
  );
}
