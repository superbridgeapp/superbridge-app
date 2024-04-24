import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext } from "react";

import { ThemeDto } from "@/codegen/model";
import { useInitialiseTheme } from "@/hooks/use-initialise-theme";

export const ThemeContext = createContext<Partial<ThemeDto> | null>(null);

export const ThemeProvider = ({ children }: { children: any }) => {
  const theme = useInitialiseTheme();

  return (
    <NextThemesProvider attribute="class">
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </NextThemesProvider>
  );
};
