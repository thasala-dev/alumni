"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "";
  }

  return (
    <div
      className="h-12 w-12 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 dark:bg-gray-800/10 dark:border-gray-700/20 dark:hover:bg-gray-700/20 flex items-center justify-center rounded-full cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-8 w-8 text-yellow-500" />
      ) : (
        <Moon className="h-8 w-8 text-[#81B214]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </div>
  );
}
