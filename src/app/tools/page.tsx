import { ToolsGallery } from "./ToolsGallery";

export const metadata = {
  title: "Practice Tools | Advance Bass",
  description:
    "Collection of free online tools for bass players including a metronome and more.",
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
