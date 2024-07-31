import Image from "next/image";

import {
  AcrossTransactionType,
  ArbitrumTransactionType,
  CctpTransactionType,
  HyperlaneTransactionType,
  OptimismTransactionType,
  RouteProvider,
} from "@/codegen/model";

const icons = {
  [RouteProvider.Across]: "/img/alt-bridges/Across-icon.png",
  // TODO: cctp icon
  [RouteProvider.Cctp]: "/img/alt-bridges/Celer-icon.png",
  [RouteProvider.ArbitrumDeposit]: "/img/arbitrum-one/icon.svg",
  [RouteProvider.ArbitrumWithdrawal]: "/img/arbitrum-one/icon.svg",
  [RouteProvider.OptimismDeposit]: "/img/optimism/logo.svg",
  [RouteProvider.OptimismWithdrawal]: "/img/optimism/logo.svg",
  [RouteProvider.OptimismForcedWithdrawal]: "/img/optimism/logo.svg",
  [RouteProvider.Hyperlane]: "/img/alt-bridges/hyperlane.svg",
};

const names = {
  [RouteProvider.Across]: "Across",
  [RouteProvider.Cctp]: "CCTP",
  [RouteProvider.ArbitrumDeposit]: "Native bridge",
  [RouteProvider.ArbitrumWithdrawal]: "Native bridge",
  [RouteProvider.OptimismDeposit]: "Native bridge",
  [RouteProvider.OptimismWithdrawal]: "Native bridge",
  [RouteProvider.OptimismForcedWithdrawal]: "Native bridge",
  [RouteProvider.Hyperlane]: "Hyperlane",
};

export const routeProviderToTransactionType = {
  [RouteProvider.Across]: AcrossTransactionType["across-bridge"],
  [RouteProvider.Cctp]: CctpTransactionType["cctp-bridge"],
  [RouteProvider.ArbitrumDeposit]:
    ArbitrumTransactionType["arbitrum-deposit-eth"],
  [RouteProvider.ArbitrumWithdrawal]:
    ArbitrumTransactionType["arbitrum-withdrawal"],
  [RouteProvider.OptimismDeposit]: OptimismTransactionType.deposit,
  [RouteProvider.OptimismWithdrawal]: OptimismTransactionType.withdrawal,
  [RouteProvider.OptimismForcedWithdrawal]:
    OptimismTransactionType["forced-withdrawal"],
  [RouteProvider.Hyperlane]: HyperlaneTransactionType["hyperlane-bridge"],
};

export const RouteProviderName = ({
  provider,
  className,
}: {
  provider: RouteProvider | null;
  className?: string;
}) => {
  if (!provider) {
    return null;
  }

  return <span>{names[provider]}</span>;
};

export const RouteProviderIcon = ({
  provider,
  className,
}: {
  provider: RouteProvider | null;
  className?: string;
}) => {
  if (!provider) {
    return null;
  }

  return (
    <Image
      alt={`${provider} icon`}
      src={icons[provider]}
      className={className}
      height={16}
      width={16}
    />
  );
};
