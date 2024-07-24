import Image from "next/image";
import Link from "next/link";

import { IconGas, IconSB, IconTime } from "@/components/icons";
import { NetworkIcon } from "@/components/network-icon";
import { RouteProviderIcon } from "@/components/route-provider-icon";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { usePeriodText } from "@/hooks/use-period-text";
import { useReceiveAmount } from "@/hooks/use-receive-amount";
import { useSelectedBridgeRoute } from "@/hooks/use-selected-bridge-route";
import { useApproxTotalBridgeTime } from "@/hooks/use-transfer-time";
import { useConfigState } from "@/state/config";
import { formatDecimals } from "@/utils/format-decimals";

export const ConfirmationModalReviewTab = ({
  onNext,
}: {
  onNext: () => void;
}) => {
  const from = useFromChain();
  const to = useToChain();
  const stateToken = useConfigState.useToken();
  const rawAmount = useConfigState.useRawAmount();

  const route = useSelectedBridgeRoute();

  const receive = useReceiveAmount();

  const transformPeriodIntoText = usePeriodText();

  const transferTime = transformPeriodIntoText(
    "transferTime",
    {},
    useApproxTotalBridgeTime().data
  );

  return (
    <div>
      <DialogHeader className="items-center">
        <DialogTitle className="text-3xl">Review</DialogTitle>
        <DialogDescription className="text-center">
          Please check these details carefully
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2 px-6">
        <div className="flex flex-col gap-1">
          {/* Send */}
          <div className="flex gap-4 px-3 py-4 rounded-lg justify-between bg-muted">
            <div className="flex items-center gap-2">
              <NetworkIcon chain={from} className="h-7 w-7" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground leading-none">
                  Send from{" "}
                </span>
                <span className="text-sm font-heading leading-none">
                  {from?.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>
                {rawAmount} {stateToken?.[from?.id ?? 0]?.symbol}
              </span>
              <Image
                src={stateToken?.[from?.id ?? 0]?.logoURI ?? ""}
                width={0}
                height={0}
                sizes="100vw"
                className="h-5 w-5"
                alt={stateToken?.[from?.id ?? 0]?.name ?? ""}
              />
            </div>
          </div>

          {/* Receive 2 */}
          <div className="flex gap-4 px-3 py-4 rounded-lg justify-between bg-muted">
            <div className="flex items-center gap-2">
              <NetworkIcon chain={to} className="h-7 w-7" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground leading-none">
                  Receive on{" "}
                </span>
                <span className="text-sm font-heading leading-none">
                  {to?.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span>
                {receive.data ? (
                  <>
                    {formatDecimals(receive.data)}{" "}
                    {stateToken?.[to?.id ?? 0]?.symbol}
                  </>
                ) : (
                  "…"
                )}
              </span>
              <Image
                src={stateToken?.[to?.id ?? 0]?.logoURI ?? ""}
                width={0}
                height={0}
                sizes="100vw"
                className="h-5 w-5"
                alt={stateToken?.[to?.id ?? 0]?.name ?? ""}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-border rounded-lg border py-0.5 text-xs">
          {/* Row 1 */}
          <div className="flex items-start gap-4 p-2 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconSB className="w-4 h-auto" />
                <span>Bridge via</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center justify-between ">
              <RouteProviderIcon
                provider={route.data!.id}
                className="h-4 w-4"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-start gap-4 p-2 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconTime className="w-4 h-auto" />
                <span>Approx bridge time</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>{transferTime}</span>
            </div>
          </div>

          {/* TODO: is this all fees or just to initiate */}
          {/* Row 3 */}
          <div className="flex items-start gap-4 p-2 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconGas className="w-4 h-auto" />
                <span>Network costs</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>$5.62</span>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Link
          href="/support"
          className="text-xs font-heading text-center hover:underline"
        >
          Need help? View the FAQs
        </Link>
        <Button onClick={onNext} className="w-full">
          Continue
        </Button>
      </DialogFooter>
    </div>
  );
};
