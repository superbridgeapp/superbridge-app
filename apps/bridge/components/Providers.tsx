import "@rainbow-me/rainbowkit/styles.css";

import {
  Locale,
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
  getDefaultWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { safeWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClientProvider } from "@tanstack/react-query";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { WagmiProvider, fallback, http } from "wagmi";
import { Chain, mainnet, optimism } from "wagmi/chains";

import { chainIcons, deploymentTheme } from "@/config/theme";
import { useDeployment } from "@/hooks/use-deployment";
import { useDeployments } from "@/hooks/use-deployments";
import { queryClient } from "@/utils/query-client";

import { useMetadata } from "@/hooks/use-metadata";
import { Loading } from "./Loading";

function Web3Provider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const { deployments } = useDeployments();
  const deployment = useDeployment();
  const [mounted, setMounted] = useState(false);
  const { i18n } = useTranslation();
  const theme = deploymentTheme(deployment);
  const metadata = useMetadata();

  useEffect(() => {
    setMounted(true);
  }, []);

  const config = useMemo(() => {
    const chains: Chain[] =
      deployments.length === 0
        ? [mainnet, optimism]
        : Object.values(
            deployments.reduce((accum, d) => {
              if (chainIcons[d.l1.id]) {
                // @ts-expect-error
                d.l1.iconUrl = chainIcons[d.l1.id];
              }
              if (chainIcons[d.l2.id]) {
                // @ts-expect-error
                d.l2.iconUrl = chainIcons[d.l2.id];
              }

              return {
                ...accum,
                [d.l1.id]: d.l1,
                [d.l2.id]: d.l2,
              };
            }, {})
          );
    const transports = chains.reduce(
      (accum, chain) => ({
        ...accum,
        [chain.id]: fallback(
          chain.rpcUrls.default.http.map((url) => http(url))
        ),
      }),
      {}
    );

    const { wallets } = getDefaultWallets();

    return getDefaultConfig({
      appName: metadata.title,
      projectId: "50c3481ab766b0e9c611c9356a42987b",
      // @ts-expect-error
      chains,
      transports,
      ssr: true,
      wallets: [...wallets, { groupName: "More", wallets: [safeWallet] }],
    });
  }, [deployments]);

  // this is a temp Rainbowkit 2 workaround. Because `config` changes whenever deployments
  // change, users are disconnected when navigating to the app
  if (!deployments.length) {
    return (
      <div className="bg-background w-screen h-screen overflow-hidden z-40 relative transition-colors duration-1000 tracking-tight flex justify-center">
        <div
          className={clsx(
            `inset-0 z-0 fixed transition-all bg-transparent`,
            theme.screenBgImg
          )}
        />

        <Loading />
      </div>
    );
  }

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
    <QueryClientProvider client={queryClient}>
      <Web3Provider>{children}</Web3Provider>
    </QueryClientProvider>
  );
}
