import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { okxWallet, safeWallet } from "@rainbow-me/rainbowkit/wallets";
import { fallback, http } from "wagmi";
import { Chain, mainnet, optimism } from "wagmi/chains";

import { chainIcons } from "@/config/theme";
import { getMetadata } from "@/hooks/use-metadata";

import { DeploymentDto } from "@/codegen/model";

export function getWagmiConfig(deployments: DeploymentDto[]) {
  const metadata = getMetadata(deployments[0]);

  const chains: Chain[] =
    deployments.length === 0
      ? [mainnet, optimism]
      : Object.values(
          deployments.reduce((accum, d) => {
            if (chainIcons[d.l1.id]) {
              // @ts-expect-error
              d.l1.iconUrl = chainIcons[d.l1.id];
            }

            if (d.theme?.theme.imageNetwork) {
              // @ts-expect-error
              d.l2.iconUrl = d.theme?.theme.imageNetwork;
            } else if (chainIcons[d.l2.id]) {
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
      [chain.id]: fallback(chain.rpcUrls.default.http.map((url) => http(url))),
    }),
    {}
  );

  const { wallets } = getDefaultWallets();

  if (
    deployments.length === 1 &&
    deployments[0].name === "camp-network-4xje7wy105"
  ) {
    wallets[0].wallets.push(okxWallet);
  }

  return getDefaultConfig({
    appName: metadata.title,
    projectId: "50c3481ab766b0e9c611c9356a42987b",
    // @ts-expect-error
    chains,
    transports,
    ssr: true,
    wallets: [...wallets, { groupName: "More", wallets: [safeWallet] }],
  });
}
