"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music4, Menu, X, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/tools",           label: "Practice" },
  { href: "/transcriptions",  label: "Transcriptions" },
];

const hireLinks = [
  { href: "/bass-lessons",       label: "Book Lessons"     },
  { href: "/recording",          label: "Recording"        },
  { href: "/bassist-for-hire",   label: "Bassist for Hire" },
  { href: "/contact",            label: "Contact"          },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const closeMenu = () => setIsMobileMenuOpen(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const isHireActive = hireLinks.some(({ href }) => isActive(href));

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

        <div className="flex items-center gap-3 md:gap-8">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
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

            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors duration-150 outline-none",
                  isHireActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Work with Jim
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {hireLinks.map(({ href, label }) => (
                  <DropdownMenuItem key={href} asChild>
                    <Link href={href}>{label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Rendered once — shared between desktop and mobile layouts so it
              never duplicates the "Toggle theme" accessible name in the DOM. */}
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            className="p-2 -mr-2 text-foreground/80 hover:text-foreground transition-colors flex items-center justify-center min-h-[44px] min-w-[44px] md:hidden"
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
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "py-4 font-medium text-lg block w-full border-b border-border/30 transition-colors",
                  isActive(href) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}

            <span className="pt-6 pb-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Work with Jim
            </span>
            {hireLinks.map(({ href, label }, index) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "py-4 font-medium text-lg block w-full transition-colors",
                  index < hireLinks.length - 1 ? "border-b border-border/30" : "",
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
