import Image from "next/image";

import {
  AcrossTransactionType,
  ArbitrumTransactionType,
  CctpTransactionType,
  HyperlaneTransactionType,
  LzTransactionType,
  OptimismTransactionType,
  RouteProvider,
} from "@/codegen/model";
import { chainIcons } from "@/config/chain-icon-overrides";
import { depositRoutes, nativeRoutes } from "@/constants/routes";

const icons = {
  [RouteProvider.Across]: "/img/networks/across.svg",
  [RouteProvider.Cctp]: "/img/networks/cctp.svg",
  [RouteProvider.ArbitrumDeposit]: "/img/networks/arbitrum-one.svg",
  [RouteProvider.ArbitrumWithdrawal]: "/img/networks/arbitrum-one.svg",
  [RouteProvider.OptimismDeposit]: "/img/networks/optimism.svg",
  [RouteProvider.OptimismWithdrawal]: "/img/networks/optimism.svg",
  [RouteProvider.OptimismForcedWithdrawal]: "/img/networks/optimism.svg",
  [RouteProvider.Hyperlane]: "/img/networks/hyperlane.svg",
  [RouteProvider.Lz]: "/img/lz/icon.png",
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
  [RouteProvider.Lz]: "Layer Zero",
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
  [RouteProvider.Lz]: LzTransactionType["lz-bridge"],
};

export const RouteProviderName = ({
  provider,
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
  fromChainId,
  toChainId,
}: {
  provider: RouteProvider | null;
  className?: string;
  fromChainId: number;
  toChainId: number;
}) => {
  if (!provider) {
    return null;
  }

  let icon = icons[provider];
  if (nativeRoutes.includes(provider)) {
    // if deposit, we want to take chain icon of last step
    // if withdrawal, first step

    const chainId = depositRoutes.includes(provider) ? toChainId : fromChainId;
    const override = chainIcons[chainId];
    if (override) {
      icon = override;
    }
  }

  return (
    <Image
      alt={`${provider} icon`}
      src={icon}
      className={className}
      height={16}
      width={16}
    />
  );
};
