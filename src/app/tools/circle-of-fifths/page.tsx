
import CircleOfFifths from "@/components/tools/CircleOfFifths";

export const metadata = {
  title: "Circle of Fifths Reference | Advance Bass",
  description: "Interactive Circle of Fifths and Circle of Fourths tool for bass players. Learn key signatures and relative minors.",
};

export default function CircleOfFifthsPage() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-8 max-w-5xl">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Circle of Fifths</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Visualize key relationships, signatures, and scales. Toggle between Fifths and Fourths.
        </p>
      </div>

      <div className="mt-8">
        <CircleOfFifths />
      </div>
      
      <div className="prose prose-invert max-w-3xl mx-auto pt-12 border-t mt-12">
        <h2>How to use this tool</h2>
        <p>
            The <strong>Circle of Fifths</strong> shows the relationship between the 12 tones of the chromatic scale, their corresponding key signatures, and the associated major and minor keys.
        </p>
        <ul>
            <li><strong>Outer Ring:</strong> Shows the Major Keys.</li>
            <li><strong>Inner Ring:</strong> Shows the Relative Minor Keys.</li>
            <li><strong>Clockwise (Fifths):</strong> Each step adds one sharp (or removes a flat). Perfect for learning the order of sharps.</li>
            <li><strong>Counter-Clockwise (Fourths):</strong> Each step adds one flat (or removes a sharp). This is the standard progression for jazz chord changes (ii-V-I).</li>
        </ul>
        <p>
            Use the toggle above the circle to switch the visualization direction to the <strong>Circle of Fourths</strong>, which is often more practical for practicing standard chord progressions.
        </p>
      </div>
    </div>
  );
}
