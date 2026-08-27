import Link from "next/link";

const serviceLinks = [
  { href: "/bass-lessons", label: "Bass Lessons" },
  { href: "/recording", label: "Recording" },
  { href: "/bassist-for-hire", label: "Bassist for Hire" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="container mx-auto px-4 md:px-8 py-10 flex flex-col gap-8">
        <nav className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2">
          {serviceLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">For bass players, built by a bass player.</p>
          <p className="text-xs text-muted-foreground">
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Advance Bass
          </p>
        </div>
      </div>
    </footer>
  );
}
