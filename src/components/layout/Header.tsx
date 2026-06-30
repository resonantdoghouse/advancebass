"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music4, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/tools",           label: "Tools"          },
  { href: "/transcriptions",  label: "Transcriptions" },
  { href: "/contact",         label: "Contact"        },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const closeMenu = () => setIsMobileMenuOpen(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between mx-auto px-4 md:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={closeMenu}>
          <div className="w-8 h-8 rounded-[8px] bg-foreground flex items-center justify-center shrink-0">
            <Music4 className="h-4 w-4 text-background" />
          </div>
          <span className="font-heading font-bold text-[19px] tracking-tight">
            Advance Bass
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors duration-150",
                  isActive(href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 -mr-2 text-foreground/80 hover:text-foreground transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-[calc(100vh-4rem)] z-40 bg-background/98 backdrop-blur-md border-t border-border/60 overflow-y-auto">
          <nav className="container mx-auto px-4 py-8 flex flex-col space-y-1">
            {navLinks.map(({ href, label }, index) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "py-4 font-medium text-lg block w-full transition-colors",
                  index < navLinks.length - 1 ? "border-b border-border/30" : "",
                  isActive(href) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
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
