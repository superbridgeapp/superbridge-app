import clsx from "clsx";
import { ImageProps } from "next/image";
import { Chain } from "viem";
import { mainnet, sepolia, syscoin } from "viem/chains";

import { ChainDto, DeploymentDto } from "@/codegen/model";
import { chainIcons } from "@/config/theme";
import { useNetworkIcon } from "@/hooks/use-theme";

export const L1_BASE_CHAINS: number[] = [
  mainnet.id,
  sepolia.id,
  syscoin.id,
  900, // Conduit devnet ID
];

export const NetworkIcon = ({
  chain,
  deployment,
  ...props
}: {
  chain: Chain | ChainDto | undefined;
  deployment: DeploymentDto | null;
} & Omit<ImageProps, "src" | "alt">) => {
  const isBase = chain?.id === deployment?.l1.id;
  const isRollup = chain?.id === deployment?.l2.id;
  const isL3 = !L1_BASE_CHAINS.includes(deployment?.l1.id ?? 0);

  const rollupIcon = useNetworkIcon(deployment?.id);

  let src = "";

  if (isRollup && rollupIcon) {
    src = rollupIcon;
  } else if (chainIcons[chain?.id ?? 0]) {
    src = chainIcons[chain?.id ?? 0]!;
  } else if (isBase) {
    if (isL3) src = "/img/L2.svg";
    else src = "/img/L1.svg";
  } else if (isRollup) {
    if (isL3) src = "/img/L3.svg";
    else src = "/img/L2.svg";
  }

  return (
    <img
      {...props}
      className={clsx(props.className, "rounded-full")}
      alt={`${chain?.name}-network-icon`}
      src={src}
    />
  );
};
