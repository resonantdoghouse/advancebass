import MetronomeClient from "./MetronomeClient";

export const metadata = {
  title: "Online Metronome | Advance Bass",
  description:
    "Free online metronome for bass practice. Features adjustable BPM, time signatures, and visual beat indicators.",
};

export default function MetronomePage() {
  return <MetronomeClient />;
}
