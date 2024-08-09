import {
  Locale,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Chain } from "viem";
import { WagmiProvider } from "wagmi";

import { useChains } from "@/hooks/use-chains";
import { useApp, useMetadata } from "@/hooks/use-metadata";
import { useWagmiConfig } from "@/hooks/wagmi/use-wagmi-config";
import { queryClient } from "@/services/query-client";

function Web3Provider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const chains = useChains();
  const [mounted, setMounted] = useState(false);
  const { i18n } = useTranslation();
  const metadata = useMetadata();
  const wagmiConfig = useWagmiConfig();

  const theme = useApp().theme;

  useEffect(() => {
    setMounted(true);
  }, []);

  const rainbowTheme = useMemo(() => {
    if (!mounted) return null;

    if (theme.rainbowMode === "light") {
      const t = lightTheme({
        borderRadius: "large",
        accentColor: theme.primary,
        accentColorForeground: theme["primary-foreground"],
      });

      // specific light overrides
      if (theme.card) t.colors.modalBackground = theme.card;

      return t;
    }

    if (theme.rainbowMode === "dark") {
      const t = darkTheme({
        borderRadius: "large",
        accentColor: theme.primary,
        accentColorForeground: theme["primary-foreground"],
      });

      // specific dark overrides
      if (theme["card-dark"]) t.colors.modalBackground = theme["card-dark"];

      return t;
    }

    if (resolvedTheme === "light") {
      const t = lightTheme({
        borderRadius: "large",
        accentColor: theme.primary,
        accentColorForeground: theme["primary-foreground"],
      });

      // specific light overrides, do we need these?
      if (theme.card) t.colors.modalBackground = theme.card;

      return t;
    }

    const t = darkTheme({
      borderRadius: "large",
      accentColor: theme.primary,
      accentColorForeground: theme["primary-foreground"],
    });

    // specific dark overrides, do we need these?
    if (theme["card-dark"]) t.colors.modalBackground = theme["card-dark"];

    return t;
  }, [theme, mounted, resolvedTheme]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider
        initialChain={chains[0] as unknown as Chain}
        locale={
          i18n.language?.includes("zh")
            ? "zh"
            : (i18n.resolvedLanguage as Locale)
        }
        theme={rainbowTheme}
        appInfo={{
          appName: metadata.head.name,
          learnMoreUrl: "https://docs.superbridge.app",
        }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>{children}</Web3Provider>
    </QueryClientProvider>
  );
}
