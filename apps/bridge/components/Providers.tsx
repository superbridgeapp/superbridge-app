import "@rainbow-me/rainbowkit/styles.css";

import {
  Locale,
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { WagmiProvider, http } from "wagmi";
import { mainnet, optimism } from "wagmi/chains";

import { ThemeProvider } from "@/components/theme-provider";
import { chainIcons } from "@/config/theme";
import * as metadata from "@/constants/metadata";
import { useDeployments } from "@/hooks/use-deployments";
import { useConfigState } from "@/state/config";
import { queryClient } from "@/utils/query-client";

function Web3Provider({ children }: { children: React.ReactNode }) {
  const { deployments } = useDeployments();
  const { resolvedTheme } = useTheme();
  const deployment = useConfigState.useDeployment();
  const [mounted, setMounted] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const config = useMemo(() => {
    const chains =
      deployments.length === 0
        ? [mainnet, optimism]
        : deployments
            .sort((a) => (a.id === deployment?.id ? -1 : 1))
            .map((d) => {
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
            .flat();
    const transports = chains.reduce(
      (accum, chain) => ({
        ...accum,
        [chain.id]: http(),
      }),
      {}
    );

    return getDefaultConfig({
      appName: metadata.title,
      projectId: "50c3481ab766b0e9c611c9356a42987b",
      chains,
      transports,
    });
  }, [deployments, deployment]);

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider
        locale={
          i18n.language.includes("zh")
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
          learnMoreUrl: "https://docs.rollbridge.app",
        }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
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
