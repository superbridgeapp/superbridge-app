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
import { WagmiProvider } from "wagmi";
import { Chain } from "wagmi/chains";

import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useAllChains } from "@/hooks/use-chains";
import { useMetadata } from "@/hooks/use-metadata";
import { getWagmiConfig } from "@/services/wagmi";
import { useInjectedStore } from "@/state/injected";
import { queryClient } from "@/utils/query-client";

function Web3Provider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  // use this instead of useDeployments because RainbowKit doesn't
  // like it when wagmiConfig changes
  const chains = useAllChains();
  const deployment = useDeployment();
  const deployments = useInjectedStore((s) => s.deployments);
  const [mounted, setMounted] = useState(false);
  const { i18n } = useTranslation();
  const metadata = useMetadata();

  useEffect(() => {
    setMounted(true);
  }, []);

  const config = useMemo(
    () => getWagmiConfig(chains, deployments),
    [chains, deployments]
  );

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider
        initialChain={deployment?.l1 as Chain | undefined}
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
                  accentColor: "#242327",
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
          appName: metadata.title,
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
