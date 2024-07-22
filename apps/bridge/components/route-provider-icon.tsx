import Image from "next/image";

import { RouteProvider } from "@/codegen/model";

const icons = {
  [RouteProvider.Across]: "/img/alt-bridges/Across-icon.png",
  // TODO: cctp icon
  [RouteProvider.Cctp]: "/img/alt-bridges/Celer-icon.png",
  [RouteProvider.ArbitrumDeposit]: "/img/arbitrum-one/icon.svg",
  [RouteProvider.ArbitrumWithdrawal]: "/img/arbitrum-one/icon.svg",
  [RouteProvider.OptimismDeposit]: "/img/optimism/icon.svg",
  [RouteProvider.OptimismWithdrawal]: "/img/optimism/icon.svg",
  [RouteProvider.OptimismForcedWithdrawal]: "/img/optimism/icon.svg",
  [RouteProvider.Hyperlane]: "/img/alt-bridges/hyperlane.svg",
};

export const RouteProviderIcon = ({
  provider,
  className,
}: {
  provider: RouteProvider;
  className?: string;
}) => {
  const src = icons[provider];
  return (
    <Image
      alt={`${provider} icon`}
      src={src}
      className={className}
      height={24}
      width={24}
    />
  );
};
