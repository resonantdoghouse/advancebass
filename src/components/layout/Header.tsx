"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music4, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

// 4 full periods of a sine wave in a 200×12 viewBox.
// Animating translateX(0 → -50%) scrolls exactly one seamless loop.
const SINE_WAVE_PATH =
  "M 0 6 C 10 2, 15 2, 25 6 C 35 10, 40 10, 50 6 " +
  "C 60 2, 65 2, 75 6 C 85 10, 90 10, 100 6 " +
  "C 110 2, 115 2, 125 6 C 135 10, 140 10, 150 6 " +
  "C 160 2, 165 2, 175 6 C 185 10, 190 10, 200 6";

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  const [hovered, setHovered] = useState(false);

  const animCls = hovered ? "nav-wave-hover" : "";

  return (
    <Link
      href={href}
      className={cn(
        "relative pb-3 font-medium transition-colors duration-200",
        isActive ? "text-foreground" : "text-foreground/60 hover:text-foreground"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}

      {/* Underline: flat line when active, sine wave when hovered */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-3 overflow-hidden pointer-events-none"
      >
        {/* Flat line — active only, fades out on hover */}
        {isActive && (
          <svg
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: hovered ? 0 : 1,
              transition: "opacity 0.2s ease",
            }}
            aria-hidden="true"
          >
            <line
              x1="0" y1="1" x2="100" y2="1"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}

        {/* Sine wave — hover only */}
        <svg
          className={animCls}
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "200%",
            height: "100%",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
          aria-hidden="true"
        >
          {/* Glow layer */}
          <path
            d={SINE_WAVE_PATH}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.1"
          />
          {/* Main wave */}
          <path
            d={SINE_WAVE_PATH}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ filter: "drop-shadow(0 0 2px hsl(var(--primary) / 0.35))" }}
          />
        </svg>
      </span>
    </Link>
  );
}

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
              <NavLink
                key={href}
                href={href}
                label={label}
                isActive={isActive(href, exact)}
              />
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
