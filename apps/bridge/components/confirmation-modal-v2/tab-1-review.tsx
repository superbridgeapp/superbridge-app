import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { useReceiveAmount } from "@/hooks/use-receive-amount";
import { isCctpBridgeOperation } from "@/hooks/use-transaction-args/cctp-args/common";
import { useTransferTime } from "@/hooks/use-transfer-time";
import { useConfigState } from "@/state/config";
import { formatDecimals } from "@/utils/format-decimals";

import { NetworkIcon } from "../network-icon";
import { Button } from "../ui/button";

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
      <div>
        <h1>Review</h1>
        <p>Please check these details carefully</p>
      </div>

      <div>
        <NetworkIcon chain={from} deployment={deployment} />
        From {from?.name}
      </div>

      <div>
        Send {rawAmount} {stateToken?.[from?.id ?? 0]?.symbol}
      </div>

      <div>
        <NetworkIcon chain={to} deployment={deployment} />
        To {to?.name}
      </div>

      <div>
        Receive {formatDecimals(receive.data)}{" "}
        {stateToken?.[to?.id ?? 0]?.symbol}
      </div>

      <div className="flex items-center justify-between">
        <div>Bridge via</div>
        <div>
          {fast
            ? "Across"
            : !!stateToken && isCctpBridgeOperation(stateToken)
            ? "CCTP"
            : "Native Bridge"}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>Estimated bridging time</div>
        <div>{transferTime}</div>
      </div>

      {/* TODO: is this all fees or just to initiate */}
      <div className="flex items-center justify-between">
        <div>Network costs</div>
        <div>$10</div>
      </div>

      <Button onClick={onNext}>Continue</Button>
    </div>
  );
};
