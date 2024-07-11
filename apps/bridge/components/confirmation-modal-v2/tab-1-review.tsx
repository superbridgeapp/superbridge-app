import Image from "next/image";
import Link from "next/link";

import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { useReceiveAmount } from "@/hooks/use-receive-amount";
import { isCctpBridgeOperation } from "@/hooks/use-transaction-args/cctp-args/common";
import { useTransferTime } from "@/hooks/use-transfer-time";
import { useConfigState } from "@/state/config";
import { formatDecimals } from "@/utils/format-decimals";

import { IconGas, IconSB, IconTime } from "../icons";
import { NetworkIcon } from "../network-icon";
import { Button } from "../ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const ConfirmationModalReviewTab = ({
  onNext,
}: {
  onNext: () => void;
}) => {
  const deployment = useDeployment();
  const from = useFromChain();
  const to = useToChain();
  const stateToken = useConfigState.useToken();
  const rawAmount = useConfigState.useRawAmount();
  const fast = useConfigState.useFast();

  const receive = useReceiveAmount();

  const transferTime = useTransferTime();

  return (
    <div>
      <DialogHeader className="items-center space-y-0">
        <DialogTitle className="text-3xl">Review</DialogTitle>
        <DialogDescription>
          Please check these details carefully
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2 px-6">
        <div className="flex flex-col gap-1">
          {/* Send */}
          <div className="flex gap-4 px-3 py-4 rounded-lg justify-between bg-muted">
            <div className="flex items-center gap-2">
              <NetworkIcon
                chain={from}
                deployment={deployment}
                className="h-7 w-7"
              />
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
                src={stateToken?.[from?.id ?? 0]?.logoURI}
                width={0}
                height={0}
                sizes="100vw"
                className="h-5 w-5"
                alt={stateToken?.[from?.id ?? 0]?.name}
              />
            </div>
          </div>

          {/* Receive 2 */}
          <div className="flex gap-4 px-3 py-4 rounded-lg justify-between bg-muted">
            <div className="flex items-center gap-2">
              <NetworkIcon
                chain={to}
                deployment={deployment}
                className="h-7 w-7"
              />
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
                {formatDecimals(receive.data)}{" "}
                {stateToken?.[to?.id ?? 0]?.symbol}
              </span>
              <Image
                src={stateToken?.[to?.id ?? 0]?.logoURI}
                width={0}
                height={0}
                sizes="100vw"
                className="h-5 w-5"
                alt={stateToken?.[to?.id ?? 0]?.name}
              />
            </div>
          </div>
        </div>
        {/* Todo: Maybe i should componentise the info lists / tables */}
        <div className="flex flex-col divide-y divide-border rounded-lg border py-0.5 text-xs">
          {/* Row 1 */}
          <div className="flex items-start gap-4 p-2 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconSB className="w-4 h-auto" />
                <span>Bridge via</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>
                {fast
                  ? "Across"
                  : !!stateToken && isCctpBridgeOperation(stateToken)
                  ? "CCTP"
                  : "Native Bridge"}
              </span>
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
