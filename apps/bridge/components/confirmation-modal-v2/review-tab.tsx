import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { useTransferTime } from "@/hooks/use-transfer-time";
import { NetworkIcon } from "../network-icon";
import { Button } from "../ui/button";

export const ConfirmationModalReviewTab = () => {
  const deployment = useDeployment();
  const from = useFromChain();
  const to = useToChain();

  const transferTime = useTransferTime();

  return (
    <div>
      <div>Review</div>

      <div>
        <NetworkIcon chain={from} deployment={deployment} />
        From {from?.name}
      </div>

      <div>
        <NetworkIcon chain={to} deployment={deployment} />
        To {to?.name}
      </div>

      <div className="flex items-center justify-between">
        <div>Bridge via</div>
        <div>Native Bridge</div>
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

      <Button>Continue</Button>
    </div>
  );
};
