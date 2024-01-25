import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import {
  arbitrum,
  arbitrumGoerli,
  arbitrumNova,
  arbitrumSepolia,
} from "viem/chains";
import { Chain } from "wagmi";

import { ChainDto, DeploymentDto } from "@/codegen/model";
import { chainIcons, deploymentTheme } from "@/config/theme";

const L3_BASE_CHAINS: number[] = [
  arbitrum.id,
  arbitrumNova.id,
  arbitrumGoerli.id,
  arbitrumSepolia.id,
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
  const isL3 = L3_BASE_CHAINS.includes(deployment?.l1.id ?? 0);

  const theme = deploymentTheme(deployment);

  let src = "";
  if (chainIcons[chain?.id ?? 0]) {
    src = chainIcons[chain?.id ?? 0]!;
  } else if (isBase) {
    if (theme.l1ChainIcon) src = theme.l1ChainIcon;
    else if (isL3) src = "/img/L2.svg";
    else src = "/img/L1.svg";
  } else if (isRollup) {
    if (theme.l2ChainIcon) src = theme.l2ChainIcon;
    else if (isL3) src = "/img/L3.svg";
    else src = "/img/L2.svg";
  }

  return (
    <Image
      {...props}
      className={clsx(props.className, "rounded-full")}
      alt={`${chain?.name}-network-icon`}
      src={src}
    />
  );
};
