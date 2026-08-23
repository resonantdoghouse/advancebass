import { StringTensionCalculator } from "@/components/tools/StringTensionCalculator";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildToolSchema } from "@/lib/tool-schema";

const title = "Bass String Tension Calculator";
const description =
  "Calculate bass string tension by gauge, scale length, and tuning. Compare standard, drop, and 5/6-string setups before you buy strings.";
const path = "/tools/string-tension-calculator";

export const metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} | Advance Bass`, description, url: path },
  twitter: { title: `${title} | Advance Bass`, description },
};

export default function StringTensionCalculatorPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <JsonLd data={buildToolSchema({ name: title, description, path })} />
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            String Tension Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estimate the pull each string puts on your neck — by gauge,
            scale length, and tuning. Useful before ordering a custom set
            or trying a drop tuning.
          </p>
        </div>

        <StringTensionCalculator />
      </div>
    </div>
  );
}
