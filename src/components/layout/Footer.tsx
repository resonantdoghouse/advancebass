import Link from "next/link";
import { Music4 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[7px] bg-foreground flex items-center justify-center shrink-0">
                <Music4 className="h-3.5 w-3.5 text-background" />
              </div>
              <span className="font-heading font-bold text-[15px] tracking-tight">Advance Bass</span>
            </Link>
            <address className="not-italic text-xs text-muted-foreground space-y-1 leading-relaxed">
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
              <Link href="/bass-lessons" className="hover:text-foreground transition-colors">Bass Lessons</Link>
              <Link href="/bassist-for-hire" className="hover:text-foreground transition-colors">Bassist for Hire</Link>
              <Link href="/recording" className="hover:text-foreground transition-colors">Session Recording</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Tools */}
          <div className="space-y-3">
            <div className="font-semibold text-sm">Tools</div>
            <nav className="flex flex-col gap-2 text-xs text-muted-foreground">
              <Link href="/tools" className="hover:text-foreground transition-colors">All Practice Tools</Link>
              <Link href="/tools/metronome" className="hover:text-foreground transition-colors">Metronome</Link>
              <Link href="/tools/tuner" className="hover:text-foreground transition-colors">Bass Tuner</Link>
              <Link href="/tools/ear-training" className="hover:text-foreground transition-colors">Ear Training</Link>
              <Link href="/tools/scale-visualizer" className="hover:text-foreground transition-colors">Scale Visualizer</Link>
              <Link href="/tools/video-looper" className="hover:text-foreground transition-colors">Video Looper</Link>
              <Link href="/tools/drum-machine" className="hover:text-foreground transition-colors">Drum Machine</Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <div className="font-semibold text-sm">Resources</div>
            <nav className="flex flex-col gap-2 text-xs text-muted-foreground">
              <Link href="/transcriptions" className="hover:text-foreground transition-colors">Transcriptions</Link>
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
                href="https://www.instagram.com/daftbass"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Instagram
              </a>
            </nav>
          </div>
        </div>

        <div className="border-t border-border/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">For bass players, built by a bass player.</p>
          <p className="text-xs text-muted-foreground">
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Advance Bass
          </p>
        </div>
      </div>
    </footer>
  );
}
