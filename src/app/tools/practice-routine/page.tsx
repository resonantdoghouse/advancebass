import { PracticeRoutineBuilder } from "@/components/tools/PracticeRoutineBuilder";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildToolSchema } from "@/lib/tool-schema";

const title = "Practice Routine Builder";
const description =
  "Build timed practice routines that chain your warm-up, technique, and ear training blocks — with a running timer, streaks, and session history.";
const path = "/tools/practice-routine";

export const metadata = {
  title,
  description,
  openGraph: { title: `${title} | Advance Bass`, description, url: path },
  twitter: { title: `${title} | Advance Bass`, description },
};

export default function PracticeRoutinePage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <JsonLd data={buildToolSchema({ name: title, description, path })} />
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Practice Routine Builder
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Chain timed blocks into a routine, run it with an auto-advancing
            timer, and build a streak. Saved in your browser — no account
            needed.
          </p>
        </div>

        <PracticeRoutineBuilder />
      </div>
    </div>
  );
}
