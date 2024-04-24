import { useEffect, useState } from "react";

import { ThemeDto } from "@/codegen/model";
import { isSuperbridge } from "@/config/superbridge";

import { useDeployment } from "./use-deployment";

const superbridgeTheme: Partial<ThemeDto> = {
  darkModeEnabled: true,

  background: "hsl(0 0% 100%)",
  foreground: "hsl(240 10% 3.9%)",
  card: "hsl(0 0% 100%)",
  "card-foreground": "hsl(240 10% 3.9%)",
  popover: "hsl(0 0% 100%)",
  "popover-foreground": "hsl(240 10% 3.9%)",
  primary: "hsl(240 5.9% 10%)",
  "primary-foreground": "hsl(0 0% 98%)",
  secondary: "hsl(240 4.8% 95.9%)",
  "secondary-foreground": "hsl(240 5.9% 10%)",
  muted: "hsl(240 4.8% 95.9%)",
  "muted-foreground": "hsl(240 3.8% 46.1%)",
  accent: "hsl(240 4.8% 95.9%)",
  "accent-foreground": "hsl(240 5.9% 10%)",
  destructive: "hsl(0 84.2% 60.2%)",
  "destructive-foreground": "hsl(0 0% 98%)",
  border: "hsl(240 5.9% 90%)",
  input: "hsl(240 5.9% 90%)",
  ring: "hsl(240 5.9% 10%)",

  "background-dark": "hsl(240 10% 3.9%)",
  "foreground-dark": "hsl(0 0% 98%)",
  "card-dark": "hsl(240 10% 3.9%)",
  "card-foreground-dark": "hsl(0 0% 98%)",
  "popover-dark": "hsl(240 10% 3.9%)",
  "popover-foreground-dark": "hsl(0 0% 98%)",
  "primary-dark": "hsl(0 0% 98%)",
  "primary-foreground-dark": "hsl(240 5.9% 10%)",
  "secondary-dark": "hsl(240 3.7% 15.9%)",
  "secondary-foreground-dark": "hsl(0 0% 98%)",
  "muted-dark": "hsl(240 3.7% 15.9%)",
  "muted-foreground-dark": "hsl(240 5% 64.9%)",
  "accent-dark": "hsl(240 3.7% 15.9%)",
  "accent-foreground-dark": "hsl(0 0% 98%)",
  "destructive-dark": "hsl(0 62.8% 30.6%)",
  "destructive-foreground-dark": "hsl(0 0% 98%)",
  "border-dark": "hsl(240 3.7% 15.9%)",
  "input-dark": "hsl(240 3.7% 15.9%)",
  "ring-dark": "hsl(240 4.9% 83.9%)",
};

function updateTheme(theme: ThemeDto) {
  Object.entries(theme).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    const formattedKey = key.includes("dark") ? `--${key}` : `--${key}-light`;
    document.documentElement.style.setProperty(formattedKey, value);
  });
}

export const useInitialiseTheme = () => {
  const deployment = useDeployment();
  const [themeValues, setThemeValues] = useState(null);

  useEffect(() => {
    const theme = deployment?.theme?.theme;

    if (!theme && isSuperbridge) {
      updateTheme(superbridgeTheme);
    }

    if (theme) {
      updateTheme(theme);
    }
  }, [deployment]);

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (e.data === "refresh") {
        window.location.reload();
      }

      if (e.data.theme) {
        updateTheme(e.data.theme as ThemeDto);
        setThemeValues(e.data.theme);
      }
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  return themeValues;
};
