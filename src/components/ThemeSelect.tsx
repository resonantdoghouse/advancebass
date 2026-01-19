"use client";

import * as React from "react";
import { Palette } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGlobalTheme,
  THEMES,
  GlobalTheme,
} from "@/components/theme-provider";

export function ThemeSelect() {
  const { theme, setTheme } = useGlobalTheme();

  return (
    <Select value={theme} onValueChange={(val) => setTheme(val as GlobalTheme)}>
      <SelectTrigger className="w-[140px] h-9">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Theme" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Theme</SelectLabel>
          {THEMES.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
