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
import { useHyperlaneMailboxes } from "@/hooks/hyperlane/use-hyperlane-mailboxes";
import { useProviderName } from "@/hooks/providers/use-provider-name";

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
  const name = useProviderName(provider);
  return <span>{name}</span>;
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
  const hyperlaneMailboxes = useHyperlaneMailboxes();

  if (!provider) {
    return null;
  }

  let icon = icons[provider];
  if (nativeRoutes.includes(provider)) {
    // if deposit, we want to take chain icon of last step
    // if withdrawal, first step

    const chainId = depositRoutes.includes(provider) ? toChainId : fromChainId;

    let override = chainIcons[chainId];
    if (chainId === 360) {
      if (hyperlaneMailboxes.length) {
        override = "/img/networks/molten.svg";
      } else {
        override = "/img/shape/icon.svg";
      }
    }

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
