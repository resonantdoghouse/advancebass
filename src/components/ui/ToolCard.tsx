import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  href: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  description: string;
}

export function ToolCard({
  href,
  title,
  subtitle,
  icon: Icon,
  description,
}: ToolCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex h-full flex-col p-5 bg-black/20 rounded-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-6 w-6" />
          </div>

          <div className="space-y-1 mb-3">
            <h3 className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              {subtitle}
            </p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
