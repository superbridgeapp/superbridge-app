import "@rainbow-me/rainbowkit/styles.css";

import {
  Locale,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { WagmiProvider } from "wagmi";
import { Chain } from "wagmi/chains";

import { useDeployment } from "@/hooks/use-deployment";
import { useDeployments } from "@/hooks/use-deployments";
import { useMetadata } from "@/hooks/use-metadata";
import { getWagmiConfig } from "@/services/wagmi";
import { queryClient } from "@/utils/query-client";

import { Loading } from "./Loading";

function Web3Provider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const { deployments } = useDeployments();
  const deployment = useDeployment();
  const [mounted, setMounted] = useState(false);
  const { i18n } = useTranslation();
  const metadata = useMetadata();

  useEffect(() => {
    setMounted(true);
  }, []);

  const config = useMemo(
    () => getWagmiConfig(deployments),

    [deployments]
  );

  // this is a temp Rainbowkit 2 workaround. Because `config` changes whenever deployments
  // change, users are disconnected when navigating to the app
  if (!deployments.length) {
    return (
      <div className="bg-background w-screen h-screen overflow-hidden z-40 relative transition-colors duration-1000  flex justify-center">
        <div
          className={clsx(`inset-0 z-0 fixed transition-all bg-transparent`)}
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
