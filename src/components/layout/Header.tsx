"use client";

import { useState } from "react";
import Link from "next/link";
import { Music4, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto px-4 md:px-8">
        <div className="flex shrink-0">
          <Link href="/" className="mr-4 md:mr-6 flex items-center space-x-2 shrink-0" onClick={closeMenu}>
            <Music4 className="h-6 w-6 text-primary shrink-0" />
            <span className="font-bold inline-block whitespace-nowrap text-lg sm:text-xl">
              Advance Bass
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="transition-colors hover:text-foreground text-foreground/80 font-medium"
            >
              Home
            </Link>
            <Link
              href="/bass-lessons"
              className="transition-colors hover:text-foreground text-foreground/80 font-medium"
            >
              Lessons
            </Link>
            <Link
              href="/transcriptions"
              className="transition-colors hover:text-foreground text-foreground/80 font-medium"
            >
              Transcriptions
            </Link>
            <Link
              href="/tools"
              className="transition-colors hover:text-foreground text-foreground/80 font-medium"
            >
              Tools
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-foreground text-foreground/80 font-medium"
            >
              Contact
            </Link>
          </nav>
          <nav className="flex items-center gap-2 ml-4">
            <ThemeToggle />
          </nav>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <button
            className="p-2 -mr-2 text-foreground/80 hover:text-foreground transition-colors shrink-0 flex items-center justify-center min-h-[44px] min-w-[44px]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-[calc(100vh-3.5rem)] z-40 bg-background/95 backdrop-blur-md border-t border-border/40 overflow-y-auto">
          <nav className="container mx-auto px-4 py-8 flex flex-col space-y-6">
            <Link
              href="/"
              className="transition-colors hover:text-primary py-3 text-foreground/90 font-medium text-lg block w-full border-b border-border/20"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/bass-lessons"
              className="transition-colors hover:text-primary py-3 text-foreground/90 font-medium text-lg block w-full border-b border-border/20"
              onClick={closeMenu}
            >
              Lessons
            </Link>
            <Link
              href="/transcriptions"
              className="transition-colors hover:text-primary py-3 text-foreground/90 font-medium text-lg block w-full border-b border-border/20"
              onClick={closeMenu}
            >
              Transcriptions
            </Link>
            <Link
              href="/tools"
              className="transition-colors hover:text-primary py-3 text-foreground/90 font-medium text-lg block w-full border-b border-border/20"
              onClick={closeMenu}
            >
              Tools
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-primary py-3 text-foreground/90 font-medium text-lg block w-full"
              onClick={closeMenu}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
