import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";
import { arbitrum, base, mainnet, mode, optimism } from "viem/chains";

import { DeploymentDto, DeploymentFamily } from "@/codegen/model";
import { IconGas } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useIsSuperbridge } from "@/hooks/apps/use-is-superbridge";
import { useCancelBridge } from "@/hooks/bridge/use-cancel-bridge";
import { useDismissAlert } from "@/hooks/bridge/use-dismiss-alert";
import { useIsCctpRoute } from "@/hooks/cctp/use-is-cctp-route";
import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useSelectedToken } from "@/hooks/tokens/use-token";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useToNativeToken } from "@/hooks/use-native-token";
import { useIsWithdrawal } from "@/hooks/use-withdrawing";
import { useModalsState } from "@/state/modals";

const ACROSS_NETWORKS: number[] = [
  mainnet.id,
  optimism.id,
  base.id,
  arbitrum.id,
  mode.id,
];
const supportsAcross = (deployment: DeploymentDto) => {
  return (
    !!ACROSS_NETWORKS.includes(deployment.l1ChainId) &&
    !!ACROSS_NETWORKS.includes(deployment.l2ChainId)
  );
};

export const NoGasModal = () => {
  const onProceed = useDismissAlert("NoGas");
  const onCancel = useCancelBridge();
  const open = useModalsState.useAlerts().includes("NoGas");
  const isSuperbridge = useIsSuperbridge();

  const { t } = useTranslation();

  const withdrawing = useIsWithdrawal();
  const isCctp = useIsCctpRoute();
  const from = useFromChain();
  const to = useToChain();
  const token = useSelectedToken();
  const deployment = useDeployment();
  const toNativeToken = useToNativeToken();

  const common = {
    from: from?.name,
    to: to?.name,
    gas: toNativeToken?.symbol,
    symbol: token?.symbol,
    token: token?.name,
  };

  const description = match({
    isCctp,
    withdrawing,
    family: deployment?.family,
  })
    .with({ withdrawing: false }, () => t("noGasModal.depositing", common))
    .with({ isCctp: true }, () => t("noGasModal.cctp", common))
    .with({ withdrawing: true, family: DeploymentFamily.optimism }, () =>
      t("noGasModal.opWithdrawing", common)
    )
    .with({ withdrawing: true, family: DeploymentFamily.arbitrum }, () =>
      t("noGasModal.arbWithdrawing", common)
    )
    .otherwise(() => null);

  const cancelButton = match({
    withdrawing,
    supportsAcross: isSuperbridge && !!deployment && supportsAcross(deployment),
  })
    .with({ withdrawing: false }, () => ({
      text: t("noGasModal.topup", common),
      onClick: () => {
        // todo: think about logic here, maybe check if we can bridge the native token
        // setStateToken(nativeToken ?? null);
        onCancel();
      },
    }))
    .otherwise(() => ({
      text: t("noGasModal.goBack", common),
      onClick: onCancel,
    }));

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-2 items-center text-center pt-10">
            <div className="animate-bounce">
              {/* <GasDrop /> */}
              <IconGas className="w-16 h-auto" />
            </div>
            <h1 className="font-heading text-2xl  text-pretty">
              {t("noGasModal.youNeedGasOn", common)}
            </h1>
            <p className="text-xs md:text-sm prose-sm font-heading text-muted-foreground text-pretty text-center">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href={`https://superbridge.app/support/${deployment?.name}`}
              target="_blank"
              className="text-xs text-center font-heading text-foreground hover:underline mb-2"
            >
              {t("noGasModal.needHelp")}
            </a>

            <Button onClick={cancelButton.onClick}>{cancelButton.text}</Button>

            <Button variant={"secondary"} onClick={onProceed}>
              <span>{t("noGasModal.proceedAnyway")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="ml-2 w-4 h-4"
              >
                <g clipPath="url(#clip0_19201_1331)">
                  <path
                    d="M7.48321 5.47569C7.48321 5.10034 7.65238 4.89152 8.00394 4.89152C8.35551 4.89152 8.53261 5.10034 8.53261 5.47569C8.53261 5.85104 8.14933 9.15783 8.06738 9.78166C8.05945 9.85303 8.04359 9.9244 8.00394 9.9244C7.96429 9.9244 7.94843 9.86889 7.9405 9.77108C7.86914 9.15519 7.48321 5.83518 7.48321 5.47305V5.47569ZM7.48321 12.6919C7.48321 12.4118 7.71582 12.1791 8.00394 12.1791C8.29207 12.1791 8.51675 12.4118 8.51675 12.6919C8.51675 12.9721 8.28414 13.2127 8.00394 13.2127C7.72375 13.2127 7.48321 12.9801 7.48321 12.6919ZM1.2397 15.5097H14.755C15.7964 15.5097 16.2987 14.685 15.8123 13.7889L9.01898 1.2411C8.47446 0.241923 7.54665 0.241923 7.00213 1.23317L0.185012 13.781C-0.296072 14.6771 0.200872 15.5097 1.24234 15.5097H1.2397Z"
                    fill="#FFFF55"
                  />
                  <path
                    d="M6.52111 5.47534C6.52111 5.89827 6.93611 9.22092 7.04185 9.93197C7.12908 10.5399 7.50707 10.8836 8.00137 10.8836C8.53004 10.8836 8.86574 10.4924 8.95297 9.93197C9.13007 8.82706 9.48956 5.89827 9.48956 5.47534C9.48956 4.68234 8.8816 3.93164 8.00137 3.93164C7.12115 3.93164 6.52111 4.69292 6.52111 5.47534ZM8.0093 14.1798C8.81816 14.1798 9.48163 13.5163 9.48163 12.6837C9.48163 11.851 8.81816 11.2113 8.0093 11.2113C7.20045 11.2113 6.51318 11.8748 6.51318 12.6837C6.51318 13.4925 7.17666 14.1798 8.0093 14.1798Z"
                    fill="white"
                  />
                  <path
                    d="M7.48321 5.47569C7.48321 5.10034 7.65238 4.89152 8.00394 4.89152C8.35551 4.89152 8.53261 5.10034 8.53261 5.47569C8.53261 5.85104 8.14933 9.15783 8.06738 9.78166C8.05945 9.85303 8.04359 9.9244 8.00394 9.9244C7.96429 9.9244 7.94843 9.86889 7.9405 9.77108C7.86914 9.15519 7.48321 5.83518 7.48321 5.47305V5.47569ZM7.48321 12.6919C7.48321 12.4118 7.71582 12.1791 8.00394 12.1791C8.29207 12.1791 8.51675 12.4118 8.51675 12.6919C8.51675 12.9721 8.28414 13.2127 8.00394 13.2127C7.72375 13.2127 7.48321 12.9801 7.48321 12.6919ZM6.52104 5.47569C6.52104 5.89862 6.93604 9.22127 7.04178 9.93233C7.12901 10.5403 7.507 10.8839 8.0013 10.8839C8.52996 10.8839 8.86567 10.4927 8.9529 9.93233C9.13 8.82742 9.48949 5.89862 9.48949 5.47569C9.48949 4.6827 8.88153 3.93199 8.0013 3.93199C7.12108 3.93199 6.52104 4.69327 6.52104 5.47569ZM6.51311 12.684C6.51311 13.5167 7.17659 14.1801 8.00923 14.1801C8.84188 14.1801 9.48156 13.5167 9.48156 12.684C9.48156 11.8514 8.81809 11.2117 8.00923 11.2117C7.20038 11.2117 6.51311 11.8752 6.51311 12.684ZM1.03352 14.2462L7.85063 1.69839C8.06738 1.29132 7.95372 1.29132 8.17047 1.69046L14.9638 14.2383C15.1488 14.574 15.1647 14.5502 14.755 14.5502H1.2397C0.832625 14.5502 0.848484 14.574 1.03087 14.2462H1.03352ZM1.2397 15.5097H14.755C15.7964 15.5097 16.2987 14.685 15.8123 13.7889L9.01898 1.2411C8.47446 0.241923 7.54665 0.241923 7.00213 1.23317L0.185012 13.781C-0.296072 14.6771 0.200872 15.5097 1.24234 15.5097H1.2397Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_19201_1331">
                    <rect
                      width="16"
                      height="15.0193"
                      fill="white"
                      transform="translate(0 0.490234)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
