import { Moon, Sun, Laptop, Croissant } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useState } from "react";

const themes = ["light", "dark", "system"] as const;

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [index, setIndex] = useState(() =>
    themes.findIndex((t) => t === theme) >= 0 ? themes.findIndex((t) => t === theme) : 0
  );

  const handleToggle = () => {
    const nextIndex = (index + 1) % themes.length;
    setTheme(themes[nextIndex]);
    setIndex(nextIndex);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle}>
      <Sun className={`h-[1.5rem] w-[1.3rem] ${theme === "light" ? "" : "hidden"}`} />
      <Moon className={`h-5 w-5 ${theme === "dark" ? "" : "hidden"}`} />
      <Laptop className={`h-5 w-5 ${theme === "system" ? "" : "hidden"}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
