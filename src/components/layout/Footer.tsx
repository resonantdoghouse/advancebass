import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-10 md:py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand / NAP */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="font-bold text-sm">Advance Bass</div>
            <address className="not-italic text-xs text-muted-foreground space-y-1">
              <div>Jim Bennett</div>
              <div>Vancouver, BC, Canada</div>
              <div>
                <a
                  href="mailto:jim@advancebass.com"
                  className="hover:text-foreground transition-colors"
                >
                  jim@advancebass.com
                </a>
              </div>
            </address>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <div className="font-semibold text-sm">Services</div>
            <nav className="flex flex-col gap-2 text-xs text-muted-foreground">
              <Link href="/bass-lessons" className="hover:text-foreground transition-colors">
                Bass Lessons
              </Link>
              <Link href="/bassist-for-hire" className="hover:text-foreground transition-colors">
                Bassist for Hire
              </Link>
              <Link href="/recording" className="hover:text-foreground transition-colors">
                Session Recording
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <div className="font-semibold text-sm">Resources</div>
            <nav className="flex flex-col gap-2 text-xs text-muted-foreground">
              <Link href="/transcriptions" className="hover:text-foreground transition-colors">
                Transcriptions
              </Link>
              <Link href="/tools" className="hover:text-foreground transition-colors">
                Practice Tools
              </Link>
              <Link href="/tools/metronome" className="hover:text-foreground transition-colors">
                Online Metronome
              </Link>
              <Link href="/tools/tuner" className="hover:text-foreground transition-colors">
                Bass Tuner
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <div className="font-semibold text-sm">Follow</div>
            <nav className="flex flex-col gap-2 text-xs text-muted-foreground">
              <a
                href="https://www.youtube.com/@JimBennettBassist"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                YouTube
              </a>
              <a
                href="https://www.instagram.com/advancebass"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Instagram
              </a>
            </nav>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            For bass players, built by a bass player
          </p>
          <p className="text-xs text-muted-foreground">
            &copy;{" "}
            <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            Advance Bass
          </p>
        </div>
      </div>
    </footer>
  );
}
