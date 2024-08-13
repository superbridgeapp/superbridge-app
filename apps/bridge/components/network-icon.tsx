import clsx from "clsx";
import { ImageProps } from "next/image";
import { Chain } from "viem";
import { mainnet, sepolia, syscoin } from "viem/chains";

import { ChainDto } from "@/codegen/model";
import { chainIcons } from "@/config/chain-icon-overrides";
import { useDeployments } from "@/hooks/deployments/use-deployments";
import { useNetworkIcon } from "@/hooks/use-theme";

export const L1_BASE_CHAINS: number[] = [
  mainnet.id,
  sepolia.id,
  syscoin.id,
  900, // Conduit devnet ID
];

export const NetworkIcon = ({
  chain,
  ...props
}: {
  chain: Chain | ChainDto | undefined | null;
} & Omit<ImageProps, "src" | "alt">) => {
  const deployment = useDeployments().find((x) => x.l2.id === chain?.id);

  const isBase = !!deployment && chain?.id === deployment?.l1.id;
  const isRollup = !!deployment && chain?.id === deployment?.l2.id;
  const isL3 = !!deployment && !L1_BASE_CHAINS.includes(deployment?.l1.id ?? 0);

  const rollupIcon = useNetworkIcon(deployment?.id);

  let src = "";

  if (chainIcons[chain?.id ?? 0]) {
    src = chainIcons[chain?.id ?? 0]!;
  } else if (isRollup && rollupIcon) {
    src = rollupIcon;
  } else if (isBase) {
    if (isL3) src = "/img/L2.svg";
    else src = "/img/L1.svg";
  } else if (isRollup) {
    if (isL3) src = "/img/L3.svg";
    else src = "/img/L2.svg";
  }

  return (
    <img
      key={`${chain?.name}-network-icon`}
      {...props}
      className={props.className}
      alt={`${chain?.name}-network-icon`}
      src={src}
    />
  );
};
