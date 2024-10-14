import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { isAddressEqual } from "viem";
import { useAccount } from "wagmi";

import { Ens } from "@/components/bridge-info";
import {
  IconHelp,
  IconSimpleFees,
  IconSimpleGas,
  IconTime,
  IconVia,
  IconWallet,
} from "@/components/icons";
import { NetworkIcon } from "@/components/network-icon";
import {
  RouteProviderIcon,
  RouteProviderName,
} from "@/components/route-provider-icon";
import { TokenIcon } from "@/components/token-icon";
import { Button } from "@/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsAcrossRoute } from "@/hooks/across/use-is-across-route";
import { useFeesForRoute } from "@/hooks/fees/use-fees";
import { useNetworkFee } from "@/hooks/gas/use-network-fee";
import { useSelectedBridgeRoute } from "@/hooks/routes/use-selected-bridge-route";
import {
  useDestinationToken,
  useSelectedToken,
} from "@/hooks/tokens/use-token";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useModal } from "@/hooks/use-modal";
import { useReceiveAmount } from "@/hooks/use-receive-amount";
import { useApproxTotalBridgeTime } from "@/hooks/use-transfer-time";
import { useTransformPeriodText } from "@/hooks/use-transform-period-text";
import { useConfigState } from "@/state/config";

export const ConfirmationModalReviewTab = ({
  onNext,
}: {
  onNext: () => void;
}) => {
  const account = useAccount();
  const { t } = useTranslation();
  const from = useFromChain();
  const to = useToChain();
  const selectedToken = useSelectedToken();
  const destinationToken = useDestinationToken();
  const rawAmount = useConfigState.useRawAmount();
  const feeBreakdownModal = useModal("FeeBreakdown");
  const gasInfoModal = useModal("GasInfo");

  const recipient = useConfigState.useRecipientAddress();
  const networkFee = useNetworkFee();
  const route = useSelectedBridgeRoute();
  const fees = useFeesForRoute(route);
  const isAcross = useIsAcrossRoute();

  const receive = useReceiveAmount();

  const transformPeriodIntoText = useTransformPeriodText();

  const transferTime = transformPeriodIntoText(
    "transferTime",
    {},
    useApproxTotalBridgeTime().data
  );

  return (
    <div>
      <DialogHeader className="items-center pt-2 pb-3">
        <DialogTitle className="text-3xl">
          {t("confirmationModal.review")}
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2 px-6">
        <div className="flex flex-col gap-1">
          {/* Send */}
          <div className="flex flex-col gap-1 p-4 rounded-xl justify-between bg-muted">
            <div className="flex items-center gap-1.5 shrink-0">
              <NetworkIcon chain={from} className="h-4 w-4 rounded-xs" />
              <span className="text-xs font-heading leading-none">
                {t("confirmationModal.bridgeFrom", { from: from?.name })}
              </span>
            </div>
            <div className="flex items-center gap-1 leading-none">
              <TokenIcon
                token={selectedToken}
                className="h-7 w-7 rounded-full"
              />
              <span className="text-2xl leading-none">
                {rawAmount} {selectedToken?.symbol}
              </span>
            </div>
          </div>

          {/* Receive */}
          <div className="flex flex-col gap-1 p-4 rounded-xl justify-between bg-muted">
            <div className="flex items-center gap-1.5 shrink-0">
              <NetworkIcon chain={to} className="h-4 w-4 rounded-xs" />
              <span className="text-xs font-heading leading-none">
                {t("confirmationModal.getOn", { to: to?.name })}
              </span>
            </div>
            <div className="flex items-center gap-1 leading-none">
              <TokenIcon
                token={destinationToken}
                className="h-7 w-7 rounded-full"
              />
              <span className="text-2xl leading-none">
                {/* only Across has fees, so we'd prefer to show the same input
                    amount rather than something rounded */}
                {receive.data && isAcross
                  ? receive.data.token.formatted
                  : receive.data
                    ? `${receive.data.token.amount} ${destinationToken?.symbol}`
                    : "…"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-border rounded-xl border py-0.5 text-xs">
          {/* Via */}
          <div className="flex items-start gap-4 py-3 px-3.5 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <IconVia className="w-4 h-auto fill-foreground" />
                <span>{t("transaction.via")}</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center justify-between ">
              <RouteProviderName provider={route.data?.id ?? null} />
              <RouteProviderIcon
                provider={route.data?.id ?? null}
                fromChainId={from?.id ?? 0}
                toChainId={to?.id ?? 0}
                className="h-4 w-4 rounded-2xs"
              />
            </div>
          </div>

          {/* Time Row */}
          <div className="flex items-start gap-4 py-3 px-3.5 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <IconTime className="w-4 h-auto fill-foreground" />
                <span>{t("transaction.transferTime")}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>{transferTime}</span>
            </div>
          </div>

          {/* To Row */}
          {account.address &&
            recipient &&
            !isAddressEqual(account.address, recipient) && (
              <div className="flex items-start gap-4 py-3 px-3.5 justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <IconWallet className="w-4 h-auto fill-foreground" />
                    <span>{t("transaction.toAddress")}</span>
                  </div>
                </div>
                <Ens address={recipient} />
              </div>
            )}

          {/* Gas Row */}
          <div className="flex items-start gap-4 py-3 px-3.5 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <IconSimpleGas className="w-4 h-auto fill-foreground" />
                <span>{t("confirmationModal.gasCosts")}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              {networkFee.isLoading ? (
                <Skeleton className="h-3 w-[60px]" />
              ) : (
                <div
                  className="flex gap-1 items-center cursor-pointer"
                  onClick={() => gasInfoModal.open()}
                >
                  {networkFee.data?.fiat?.formatted && (
                    <span className="text-xs leading-none text-muted-foreground">
                      {networkFee.data.fiat.formatted}
                    </span>
                  )}
                  <span className="text-xs leading-none">
                    {networkFee.data?.token.formatted}
                  </span>
                  <IconHelp className="fill-muted-foreground h-4 w-auto" />
                </div>
              )}
            </div>
          </div>

          {/* Fees Row */}
          <div className="flex items-start gap-4 py-3 px-3.5 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <IconSimpleFees className="w-4 h-auto fill-foreground" />
                <span>{t("confirmationModal.fees")}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div
                className={clsx(
                  "flex gap-1 items-center",
                  fees.data?.totals.token !== 0 && "cursor-pointer"
                )}
                onClick={() =>
                  fees.data?.totals.token !== 0
                    ? feeBreakdownModal.open()
                    : null
                }
              >
                {fees.data?.totals.token === 0 ? (
                  <span className="text-xs leading-none">0 fees</span>
                ) : (
                  <>
                    {fees.data?.totals.fiatFormatted && (
                      <span className="text-xs leading-none text-muted-foreground">
                        {fees.data?.totals.fiatFormatted}{" "}
                      </span>
                    )}
                    <span className="text-xs leading-none text-foreground">
                      {fees.data?.totals.tokenFormatted}{" "}
                    </span>
                    <IconHelp
                      className={clsx(
                        fees.data?.totals.token === 0
                          ? "fill-primary-foreground"
                          : "fill-muted-foreground",
                        "h-4 w-auto"
                      )}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter className="pt-4">
        <Button onClick={onNext} className="w-full">
          {t("buttons.continue")}
        </Button>
      </DialogFooter>
    </div>
  );
};
