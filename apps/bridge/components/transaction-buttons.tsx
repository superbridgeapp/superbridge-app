import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useChainId } from "wagmi";

import {
  ArbitrumDepositRetryableDto,
  ArbitrumForcedWithdrawalDto,
  ArbitrumWithdrawalDto,
  BridgeWithdrawalDto,
  CctpBridgeDto,
  ForcedWithdrawalDto,
} from "@/codegen/model";
import { useTxDeployment } from "@/hooks/activity/use-tx-deployment";
import { useFinaliseArbitrum } from "@/hooks/arbitrum/use-arbitrum-finalise";
import { useRedeemArbitrum } from "@/hooks/arbitrum/use-arbitrum-redeem";
import { useMintCctp } from "@/hooks/cctp/use-cctp-mint";
import { useFinaliseOptimism } from "@/hooks/optimism/use-optimism-finalise";
import { useProveOptimism } from "@/hooks/optimism/use-optimism-prove";
import { useChain } from "@/hooks/use-chain";
import { useSwitchChain } from "@/hooks/use-switch-chain";
import { isArbitrumWithdrawal, isWithdrawal } from "@/utils/guards";

import { Button } from "./ui/button";

type TxButtonProps = { onClick: () => void; disabled: boolean };

export const ProveButton = (props: TxButtonProps) => {
  const { t } = useTranslation();
  return (
    <Button onClick={props.onClick} size={"xs"} disabled={props.disabled}>
      {t("buttons.prove")}
    </Button>
  );
};

export const ClaimButton = (props: TxButtonProps) => {
  const { t } = useTranslation();
  return (
    <Button onClick={props.onClick} size={"xs"} disabled={props.disabled}>
      {t("buttons.get")}
    </Button>
  );
};

export const Prove = ({
  tx,
  enabled,
}: {
  tx: BridgeWithdrawalDto | ForcedWithdrawalDto;
  enabled: boolean;
}) => {
  const prove = useProveOptimism(isWithdrawal(tx) ? tx : tx.withdrawal);
  return (
    <ProveButton onClick={prove.onProve} disabled={prove.loading || !enabled} />
  );
};

export const Finalise = ({
  tx,
  enabled,
}: {
  tx: BridgeWithdrawalDto | ForcedWithdrawalDto;
  enabled: boolean;
}) => {
  const finalise = useFinaliseOptimism(isWithdrawal(tx) ? tx : tx.withdrawal);
  return (
    <ClaimButton
      onClick={finalise.onFinalise}
      disabled={finalise.loading || !enabled}
    />
  );
};

export const FinaliseArbitrum: FC<{
  tx: ArbitrumWithdrawalDto | ArbitrumForcedWithdrawalDto;
  enabled: boolean;
}> = ({ tx, enabled }) => {
  const finalise = useFinaliseArbitrum(
    isArbitrumWithdrawal(tx) ? tx : tx.withdrawal!
  );
  const { t } = useTranslation();
  return (
    <Button
      onClick={finalise.onFinalise}
      size={"sm"}
      disabled={finalise.loading || !enabled}
    >
      {t("buttons.finalize")}
    </Button>
  );
};

export const RedeemArbitrum: FC<{
  tx: ArbitrumDepositRetryableDto;
  enabled: boolean;
}> = ({ tx, enabled }) => {
  const chainId = useChainId();
  const redeem = useRedeemArbitrum(tx);
  const { t } = useTranslation();
  const switchChain = useSwitchChain();

  const deployment = useTxDeployment(tx);
  const l2 = useChain(deployment?.l2ChainId);
  if (!deployment || !l2) {
    return null;
  }

  if (chainId === l2.id) {
    return (
      <Button className="rounded-full" onClick={redeem.write} size={"sm"}>
        {t("buttons.redeem")}
      </Button>
    );
  }
  return (
    <Button onClick={() => switchChain(l2)} size={"sm"} disabled={!enabled}>
      {t("buttons.switchChain")}
    </Button>
  );
};

export const MintCctp: FC<{
  tx: CctpBridgeDto;
  enabled: boolean;
}> = ({ tx, enabled }) => {
  const mint = useMintCctp(tx);
  const { t } = useTranslation();

  return (
    <Button onClick={mint.write} size={"sm"} disabled={mint.loading}>
      {t("buttons.mint")}
    </Button>
  );
};
