"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music4, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home", exact: true },
  { href: "/bass-lessons", label: "Lessons" },
  { href: "/transcriptions", label: "Transcriptions" },
  { href: "/tools", label: "Tools" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsMobileMenuOpen(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

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
            {navLinks.map(({ href, label, exact }) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors font-medium ${
                  isActive(href, exact)
                    ? "text-foreground underline underline-offset-4 decoration-primary decoration-2"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
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
            {navLinks.map(({ href, label, exact }, index) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors py-3 font-medium text-lg block w-full ${
                  index < navLinks.length - 1 ? "border-b border-border/20" : ""
                } ${
                  isActive(href, exact)
                    ? "text-primary"
                    : "text-foreground/90 hover:text-primary"
                }`}
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
