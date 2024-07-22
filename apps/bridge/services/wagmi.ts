import { getDefaultConfig, getDefaultWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { safeWallet } from "@rainbow-me/rainbowkit/wallets";
import { fallback, http } from "wagmi";
import { Chain } from "wagmi/chains";

import { ChainDto } from "@/codegen/model";
import { chainIcons } from "@/config/chain-icon-overrides";

export function getWagmiConfig(chainDtos: ChainDto[]) {
  // const metadata = getMetadata(deployments[0]);

  const chains: Chain[] = chainDtos.map((c) => {
    if (chainIcons[c.id]) {
      // @ts-expect-error
      c.iconUrl = chainIcons[c.id];
    }

    // todo: don't lose these icons
    // if (d.theme?.theme.imageNetwork) {
    //   // @ts-expect-error
    //   d.l2.iconUrl = d.theme?.theme.imageNetwork;
    // } else if (chainIcons[d.l2.id]) {
    //   // @ts-expect-error
    //   d.l2.iconUrl = chainIcons[d.l2.id];
    // }

    return c as unknown as Chain;
  });

  const transports = chains.reduce(
    (accum, chain) => ({
      ...accum,
      [chain.id]: fallback(chain.rpcUrls.default.http.map((url) => http(url))),
    }),
    {}
  );

  const { wallets } = getDefaultWallets();

  // todo
  // if (
  //   isSuperbridge ||
  //   (deployments.length === 1 &&
  //     deployments[0].name === "camp-network-4xje7wy105")
  // ) {
  //   wallets[0].wallets.push(okxWallet);
  // }

  return getDefaultConfig({
    // todo
    // appName: metadata.title,
    // appDescription: metadata.description,
    // appIcon: metadata.icon,
    projectId: "50c3481ab766b0e9c611c9356a42987b",
    // @ts-expect-error
    chains,
    transports,
    ssr: true,
    wallets: [...wallets, { groupName: "More", wallets: [safeWallet] }],
  });
}
