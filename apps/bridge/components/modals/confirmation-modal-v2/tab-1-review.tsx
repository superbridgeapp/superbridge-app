import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import {
  IconHelp,
  IconSimpleFees,
  IconSimpleGas,
  IconSimpleTime,
  IconTime,
  IconVia,
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
import { useFeesForRoute } from "@/hooks/fees/use-fees";
import { useNetworkFee } from "@/hooks/gas/use-network-fee";
import { useSelectedBridgeRoute } from "@/hooks/routes/use-selected-bridge-route";
import {
  useDestinationToken,
  useSelectedToken,
} from "@/hooks/tokens/use-token";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useModal } from "@/hooks/use-modal";
import { usePeriodText } from "@/hooks/use-period-text";
import { useReceiveAmount } from "@/hooks/use-receive-amount";
import { useApproxTotalBridgeTime } from "@/hooks/use-transfer-time";
import { useConfigState } from "@/state/config";

export const ConfirmationModalReviewTab = ({
  onNext,
}: {
  onNext: () => void;
}) => {
  const { t } = useTranslation();
  const from = useFromChain();
  const to = useToChain();
  const selectedToken = useSelectedToken();
  const destinationToken = useDestinationToken();
  const rawAmount = useConfigState.useRawAmount();
  const feeBreakdownModal = useModal("FeeBreakdown");
  const gasInfoModal = useModal("GasInfo");

  const networkFee = useNetworkFee();
  const route = useSelectedBridgeRoute();
  const fees = useFeesForRoute(route);

  const receive = useReceiveAmount();

  const transformPeriodIntoText = usePeriodText();

  const transferTime = transformPeriodIntoText(
    "transferTime",
    {},
    useApproxTotalBridgeTime().data
  );

  return (
    <div>
      <DialogHeader className="items-center pt-2 pb-3">
        <DialogTitle className="text-2xl">
          {t("confirmationModal.review")}
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2 px-6">
        <div className="flex flex-col gap-1">
          {/* Send */}
          <div className="flex flex-col gap-2 px-3.5 py-4 rounded-xl justify-between bg-muted">
            <div className="flex items-center gap-1.5 shrink-0">
              <NetworkIcon chain={from} className="h-4 w-4 rounded-2xs" />
              <span className="text-xs font-heading leading-none">
                {t("confirmationModal.bridgeFrom", { from: from?.name })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 leading-none">
              <TokenIcon
                token={selectedToken}
                className="h-8 w-8 rounded-full"
              />
              <span className="text-3xl font-heading leading-none">
                {rawAmount} {selectedToken?.symbol}
              </span>
            </div>
          </div>

          {/* Receive */}
          <div className="flex flex-col gap-2 px-3.5 py-4 rounded-xl justify-between bg-muted">
            <div className="flex items-center gap-1.5 shrink-0">
              <NetworkIcon chain={to} className="h-4 w-4 rounded-2xs" />
              <span className="text-xs font-heading leading-none">
                {t("confirmationModal.getOn", { to: to?.name })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 leading-none">
              <TokenIcon
                token={destinationToken}
                className="h-8 w-8 rounded-full"
              />
              <span className="text-3xl font-heading leading-none">
                {receive.data ? <>{receive.data.token.formatted}</> : "…"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-border rounded-xl border py-0.5 text-xs">
          {/* Row 1 */}
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

          {/* Row 2 */}
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

          {/* Row 3 */}
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
                  <span>
                    {networkFee.data?.fiat?.formatted ??
                      networkFee.data?.token.formatted}
                  </span>
                  <IconHelp className="fill-muted-foreground h-3 w-auto" />
                </div>
              )}
            </div>
          </div>

          {/* Row 4 */}
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
                    <span className="text-xs leading-none text-foreground">
                      {fees.data?.totals.fiatFormatted ??
                        fees.data?.totals.tokenFormatted}{" "}
                      Fee
                    </span>
                    <IconHelp
                      className={clsx(
                        fees.data?.totals.token === 0
                          ? "fill-primary-foreground"
                          : "fill-muted-foreground",
                        "h-3 w-auto"
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
        {/* <Link
          href="https://help.superbridge.app"
          target="_blank"
          className="text-xs font-heading text-center hover:underline"
        >
          {t("general.needHelp")}
        </Link> */}
        <Button onClick={onNext} className="w-full">
          {t("general.continue")}
        </Button>
      </DialogFooter>
    </div>
  );
};
