import clsx from "clsx";
import { ImageProps } from "next/image";
import { Chain } from "viem";

import { ChainDto } from "@/codegen/model";
import { chainIcons } from "@/config/theme";

export const FastNetworkIcon = ({
  chain,
  ...props
}: {
  chain: Chain | ChainDto | undefined;
} & Omit<ImageProps, "src" | "alt">) => {
  return (
    <img
      {...props}
      className={clsx(props.className, "rounded-full")}
      alt={`${chain?.name}-network-icon`}
      src={chainIcons[chain?.id ?? 0]}
    />
  );
};
