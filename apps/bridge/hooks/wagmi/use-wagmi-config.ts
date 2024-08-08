import { getDefaultConfig, getDefaultWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { okxWallet, safeWallet } from "@rainbow-me/rainbowkit/wallets";
import { useMemo } from "react";
import { fallback, http } from "wagmi";
import { Chain } from "wagmi/chains";

import { chainIcons } from "@/config/chain-icon-overrides";
import { useMetadata } from "@/hooks/use-metadata";

import { useIsSuperbridge } from "../apps/use-is-superbridge";
import { useAllDeployments } from "../deployments/use-all-deployments";
import { useAllChains } from "../use-chains";

export function useWagmiConfig() {
  const chains = useAllChains();
  const allDeployments = useAllDeployments();
  const metadata = useMetadata();
  const isSuperbridge = useIsSuperbridge();

  return useMemo(() => {
    const chainsWithIcons: Chain[] = chains.map((c) => {
      if (chainIcons[c.id]) {
        // @ts-expect-error
        c.iconUrl = chainIcons[c.id];
      }

      const d = allDeployments.find((x) => x.l2.id === c.id);
      if (d?.theme?.theme.imageNetwork) {
        // @ts-expect-error
        d.l2.iconUrl = d.theme.theme.imageNetwork;
      }

      return c as unknown as Chain;
    });

    const transports = chainsWithIcons.reduce(
      (accum, chain) => ({
        ...accum,
        [chain.id]: fallback(
          chain.rpcUrls.default.http.map((url) => http(url))
        ),
      }),
      {}
    );

    const { wallets } = getDefaultWallets();

    if (
      isSuperbridge ||
      (allDeployments.length === 1 &&
        allDeployments[0].name === "camp-network-4xje7wy105")
    ) {
      wallets[0].wallets.push(okxWallet);
    }

    return getDefaultConfig({
      appName: metadata.head.name,
      appDescription: metadata.head.description,
      appIcon: metadata.head.favicon,
      projectId: "50c3481ab766b0e9c611c9356a42987b",
      // @ts-expect-error
      chains,
      transports,
      ssr: true,
      wallets: [...wallets, { groupName: "More", wallets: [safeWallet] }],
    });
  }, [chains, allDeployments, metadata]);
}
