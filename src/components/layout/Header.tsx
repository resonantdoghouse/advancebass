import Link from "next/link"
import { Music4 } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4 md:px-8">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Music4 className="h-6 w-6 text-primary" />
                        <span className="hidden font-bold sm:inline-block">
                            Advance Bass
                        </span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm">
                        <Link
                            href="/transcriptions"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Transcriptions
                        </Link>
                        <Link
                            href="/contact"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Contact
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search placeholder */}
                    </div>
                    <nav className="flex items-center">
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}
