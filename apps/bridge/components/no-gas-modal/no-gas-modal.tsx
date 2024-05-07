import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";

import { DeploymentFamily } from "@/codegen/model";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { useToNativeToken } from "@/hooks/use-native-token";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { isNativeToken } from "@/utils/is-eth";
import { isNativeUsdc } from "@/utils/is-usdc";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export const NoGasModal = ({
  onProceed,
  onBack,
  open,
  setOpen,
}: {
  onProceed: () => void;
  onBack: () => void;
  open: boolean;
  setOpen: (b: boolean) => void;
}) => {
  const { t } = useTranslation();
  const stateToken = useConfigState.useToken();
  const withdrawing = useConfigState.useWithdrawing();
  const from = useFromChain();
  const to = useToChain();
  const token = useSelectedToken();
  const deployment = useDeployment();
  const toNativeToken = useToNativeToken();

  const common = {
    from: from?.name,
    to: to?.name,
    gas: toNativeToken?.[to?.id ?? 0]?.symbol,
    symbol: token?.symbol,
    token: token?.name,
  };

  const description = match({
    isUsdc: isNativeUsdc(stateToken),
    withdrawing,
    family: deployment?.family,
    isEth: isNativeToken(stateToken),
  })
    .with({ isUsdc: true }, () => t("noGasModal.usdc", common))
    .with({ withdrawing: true, family: DeploymentFamily.optimism }, () =>
      t("noGasModal.opWithdrawing", common)
    )
    .with({ withdrawing: true, family: DeploymentFamily.arbitrum }, () =>
      t("noGasModal.arbWithdrawing", common)
    )
    .with({ withdrawing: false }, () => t("noGasModal.depositing", common))
    .otherwise(() => null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex flex-col p-6 pt-8">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-xl tracking-tight text-pretty leading-6 mr-6">
              You don't have any {common.gas} for gas on {common.to}
            </h1>

            <p className="text-xs md:text-sm text-pretty">{description}</p>

            <p>
              We'd recommend topping up some gas before attempting this bridge.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={onBack}>Go back</Button>

            <Button variant={"link"} onClick={onProceed}>
              Proceed anyway
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
