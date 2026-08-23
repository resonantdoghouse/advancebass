import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolsDock } from "@/components/tools/dock/ToolsDock";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}

      <div className="container mx-auto max-w-4xl px-4 pb-16">
        <Link
          href="/bass-lessons"
          className="group flex items-center justify-between gap-4 rounded-[16px] border border-border/70 bg-card/60 px-6 py-5 hover:border-primary/60 transition-colors"
        >
          <p className="text-sm text-muted-foreground">
            Want more than a tool?{" "}
            <span className="text-foreground font-medium">
              A lesson can help you put it to work.
            </span>
          </p>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-primary shrink-0">
            Bass Lessons <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>

      <ToolsDock />
    </>
  );
}
