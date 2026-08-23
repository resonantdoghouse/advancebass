import { FretboardTrainer } from "@/components/tools/FretboardTrainer";
import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildToolSchema } from "@/lib/tool-schema";

const title = "Fretboard Trainer";
const description =
  "Interactive bass guitar fretboard game. Memorize notes on the fretboard with this interactive quiz.";
const path = "/tools/fretboard-trainer";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} | Advance Bass`, description, url: path },
  twitter: { title: `${title} | Advance Bass`, description },
};

export default function FretboardTrainerPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <JsonLd data={buildToolSchema({ name: title, description, path })} />
      <div className="max-w-6xl mx-auto">
        <FretboardTrainer />
        <div className="mt-10">
          <span className="font-mono text-xs tracking-[0.1em] text-primary uppercase">
            Fretboard Trainer
          </span>
          <h1 className="font-heading font-bold text-[38px] sm:text-[48px] tracking-[-0.03em] leading-[1.05] mt-3.5 mb-4">
            Train your memory.<br className="hidden sm:block" /> Beat the clock.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-[480px]">
            Gamified note memorization — race the clock to find notes across the neck. Score points for every correct answer before time runs out.
          </p>
        </div>
      </div>
    </div>
  );
}
