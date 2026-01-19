"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export type GlobalTheme = "default" | "zelda" | "wood" | "forest" | "marble";

export const THEMES: { id: GlobalTheme; label: string; offsetClass: string }[] =
  [
    { id: "default", label: "Default", offsetClass: "bg-background" },
    { id: "zelda", label: "Zelda", offsetClass: "bg-green-900" },
    { id: "wood", label: "Wood", offsetClass: "bg-amber-900" },
    { id: "forest", label: "Forest", offsetClass: "bg-green-900" },
    { id: "marble", label: "Marble", offsetClass: "bg-zinc-200" },
  ];

interface GlobalThemeContextType {
  theme: GlobalTheme;
  setTheme: (theme: GlobalTheme) => void;
}

const GlobalThemeContext = createContext<GlobalThemeContextType>({
  theme: "default",
  setTheme: () => {},
});

export const useGlobalTheme = () => useContext(GlobalThemeContext);

export function GlobalThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [theme, setThemeState] = useState<GlobalTheme>("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("global-theme") as GlobalTheme;
    if (saved) {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: GlobalTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("global-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  if (!mounted) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
  }

  return (
    <GlobalThemeContext.Provider value={{ theme, setTheme }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </GlobalThemeContext.Provider>
  );
}

// Backwards compatibility if needed, though mostly unused now
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <GlobalThemeProvider {...props}>{children}</GlobalThemeProvider>;
}
