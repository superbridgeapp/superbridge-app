import {
  Locale,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Chain } from "viem";
import { WagmiProvider } from "wagmi";

import { useFromChain } from "@/hooks/use-chain";
import { useChains } from "@/hooks/use-chains";
import { useMetadata } from "@/hooks/use-metadata";
import { useRainbowMode, useTheme } from "@/hooks/use-theme";
import { useWagmiConfig } from "@/hooks/wagmi/use-wagmi-config";
import { queryClient } from "@/services/query-client";
import { ThemeProvider } from "@/state/theme";

function Web3Provider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useNextTheme();
  const chains = useChains();
  const [mounted, setMounted] = useState(false);
  const { i18n } = useTranslation();
  const metadata = useMetadata();
  const wagmiConfig = useWagmiConfig();
  const fromChain = useFromChain();

  const rainbowMode = useRainbowMode();
  const theme = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const rainbowTheme = useMemo(() => {
    if (!mounted) return null;

    if (rainbowMode === "light") {
      const t = lightTheme({
        borderRadius: "large",
        accentColor: theme?.primary,
        accentColorForeground: theme?.["primary-foreground"],
      });

      return t;
    }

    if (rainbowMode === "dark") {
      const t = darkTheme({
        borderRadius: "large",
        accentColor: theme?.primary,
        accentColorForeground: theme?.["primary-foreground"],
      });

      return t;
    }

    if (resolvedTheme === "light") {
      const t = lightTheme({
        borderRadius: "large",
        accentColor: theme?.primary,
        accentColorForeground: theme?.["primary-foreground"],
      });

      return t;
    }

    const t = darkTheme({
      borderRadius: "large",
      accentColor: theme?.primary,
      accentColorForeground: theme?.["primary-foreground"],
    });

    return t;
  }, [theme, mounted, resolvedTheme]);

  const initialChain = fromChain || chains[0];
  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider
        initialChain={initialChain as unknown as Chain}
        locale={
          i18n.language?.includes("zh")
            ? "zh"
            : (i18n.resolvedLanguage as Locale)
        }
        theme={rainbowTheme}
        appInfo={{
          appName: metadata.head.title,
          learnMoreUrl: "https://help.superbridge.app",
        }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>{children}</Web3Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
