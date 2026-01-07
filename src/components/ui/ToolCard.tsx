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
    <Link href={href}>
      <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-primary/20 group">
        <CardHeader>
          <Icon className="w-10 h-10 mb-2 text-primary group-hover:scale-110 transition-transform" />
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
