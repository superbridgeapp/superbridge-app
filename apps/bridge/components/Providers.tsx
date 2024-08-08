import {
  Locale,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Chain } from "viem";
import { WagmiProvider } from "wagmi";

import { useChains } from "@/hooks/use-chains";
import { useApp, useMetadata } from "@/hooks/use-metadata";
import { useWagmiConfig } from "@/hooks/wagmi/use-wagmi-config";
import { queryClient } from "@/utils/query-client";

function Web3Provider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  // use this instead of useDeployments because RainbowKit doesn't
  // like it when wagmiConfig changes
  const chains = useChains();
  const [mounted, setMounted] = useState(false);
  const { i18n } = useTranslation();
  const metadata = useMetadata();
  const wagmiConfig = useWagmiConfig();

  const theme = useApp().theme;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider
        initialChain={chains[0] as unknown as Chain}
        locale={
          i18n.language?.includes("zh")
            ? "zh"
            : (i18n.resolvedLanguage as Locale)
        }
        theme={
          mounted
            ? resolvedTheme === "light"
              ? lightTheme({
                  borderRadius: "large",
                  accentColor: theme.primary,
                  accentColorForeground: "#fff",
                })
              : darkTheme({
                  borderRadius: "large",
                  accentColor: "#fff",
                  accentColorForeground: "#101010",
                })
            : null
        }
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
