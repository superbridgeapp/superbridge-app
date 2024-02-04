import "@rainbow-me/rainbowkit/styles.css";

import {
  Locale,
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { optimism } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { ThemeProvider } from "@/components/theme-provider";
import { chainIcons } from "@/config/theme";
import * as metadata from "@/constants/metadata";
import { useDeployments } from "@/hooks/use-deployments";
import { queryClient } from "@/utils/query-client";

// @ts-expect-error
mainnet.rpcUrls.default.http[0] = "https://eth.llamarpc.com";
// @ts-expect-error
mainnet.rpcUrls.public.http[0] = "https://eth.llamarpc.com";

function Web3Provider({ children }: { children: React.ReactNode }) {
  const { deployments } = useDeployments();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { chains, wagmiConfig } = useMemo(() => {
    const { chains, publicClient } = configureChains(
      // @ts-expect-error
      deployments.length === 0
        ? [mainnet, optimism]
        : deployments
            .map((d) => {
              if (d.l1.id === mainnet.id) {
                d.l1.rpcUrls.default.http[0] = "https://eth.llamarpc.com";
                d.l1.rpcUrls.public.http[0] = "https://eth.llamarpc.com";
              }

              if (chainIcons[d.l1.id]) {
                // @ts-expect-error
                d.l1.iconUrl = chainIcons[d.l1.id];
              }
              if (chainIcons[d.l2.id]) {
                // @ts-expect-error
                d.l2.iconUrl = chainIcons[d.l2.id];
              }

              return [d.l1, d.l2];
            })
            .flat(),
      [publicProvider()]
    );

    const { connectors } = getDefaultWallets({
      appName: metadata.title,
      projectId: "50c3481ab766b0e9c611c9356a42987b",
      chains,
    });

    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    });
    return { chains, wagmiConfig };
  }, [deployments]);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        locale={i18n.language.includes("zh") ? "zh" : (i18n.language as Locale)}
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
          learnMoreUrl: "https://docs.rollbridge.app",
        }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        <Web3Provider>{children}</Web3Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
