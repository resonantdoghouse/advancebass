export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="container mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">For bass players, built by a bass player.</p>
        <p className="text-xs text-muted-foreground">
          &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Advance Bass
        </p>
      </div>
    </footer>
  );
}
