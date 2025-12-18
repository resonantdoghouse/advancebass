
import { Metronome } from "@/components/tools/Metronome";

export const metadata = {
  title: "Online Metronome | Advance Bass",
  description: "Free online metronome for bass practice. Features adjustable BPM, time signatures, and visual beat indicators.",
};

export default function MetronomePage() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-12 max-w-4xl">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Metronome</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A simple, accurate, and free online metronome for your daily practice.
        </p>
      </div>

      <Metronome />

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>How to use this Metronome</h2>
        <p>
          This metronome simulates a real click track to help you keep time while practicing. 
          Use the slider or the buttons to adjust the BPM (Beats Per Minute). 
          You can also change the time signature to practice odd meters like 5/4 or 7/8.
        </p>
        <h3>Features</h3>
        <ul>
            <li><strong>BPM Control:</strong> Adjust from 30 to 300 BPM.</li>
            <li><strong>Time Signatures:</strong> Support for odd time signatures.</li>
            <li><strong>Visual Cues:</strong> Flashing indicators for visual timing.</li>
            <li><strong>Accent:</strong> Distinct sound for the downbeat (beat 1).</li>
        </ul>
      </div>
    </div>
  );
}
