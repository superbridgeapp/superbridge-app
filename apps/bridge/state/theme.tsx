import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { createContext, useEffect } from "react";

import { ThemeDto } from "@/codegen/model";
import { useInitialiseTheme } from "@/hooks/use-initialise-theme";
import { useDarkModeEnabled } from "@/hooks/use-theme";

export const ThemeContext = createContext<Partial<ThemeDto> | null>(null);

export const ThemeProvider = ({ children }: { children: any }) => {
  const theme = useInitialiseTheme();

  return (
    <ThemeContext.Provider value={theme}>
      <InnerThemeProvider>{children}</InnerThemeProvider>
    </ThemeContext.Provider>
  );
};

export const InnerThemeProvider = ({ children }: { children: any }) => {
  const darkModeEnabled = useDarkModeEnabled();

  let props: ThemeProviderProps = {
    attribute: "class",
  };

  if (!darkModeEnabled) {
    props.forcedTheme = "light";
  }

  return (
    <NextThemesProvider {...props}>
      <InnerInnerThemeProvider>{children}</InnerInnerThemeProvider>
    </NextThemesProvider>
  );
};

export const InnerInnerThemeProvider = ({ children }: { children: any }) => {
  const darkModeEnabled = useDarkModeEnabled();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (!darkModeEnabled) {
      setTheme("light");
    }
  }, [darkModeEnabled]);

  return <>{children}</>;
};
