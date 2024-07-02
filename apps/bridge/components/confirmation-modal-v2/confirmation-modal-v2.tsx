import clsx from "clsx";
import { useEffect, useState } from "react";

import { useBridge } from "@/hooks/bridge/use-bridge";
import { useAllowance } from "@/hooks/use-allowance";
import { useApprove } from "@/hooks/use-approve";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { useModalsState } from "@/state/modals";

import { Dialog, DialogContent } from "../ui/dialog";
import { ConfirmationModalReviewTab } from "./tab-1-review";
import { ConfirmationModalTermsTab } from "./tab-2-terms";
import { ConfirmationModalStartTab } from "./tab-3-start";
import { TrackBridgeProgress } from "./track-progress";
import { useCancelBridge } from "@/hooks/bridge/use-cancel-bridge";

export const ConfirmationModalV2 = ({
  approve,
  allowance,
  bridge,
  initiateBridge,
}: {
  approve: ReturnType<typeof useApprove>;
  allowance: ReturnType<typeof useAllowance>;
  bridge: ReturnType<typeof useBridge>;
  initiateBridge: () => void;
}) => {
  const open = useConfigState.useDisplayConfirmationModal();
  const cancel = useCancelBridge();
  const from = useFromChain();
  const to = useToChain();
  const token = useSelectedToken();
  const pendingBridgeTransactionHash =
    useModalsState.usePendingBridgeTransactionHash();

  const deployment = useDeployment();

  const common = {
    from: from?.name,
    to: to?.name,
    base: deployment?.l1.name,
    rollup: deployment?.l2.name,
    symbol: token?.symbol,
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = [
    {
      name: "review",
      component: (
        <ConfirmationModalReviewTab
          onNext={() => setActiveIndex((i) => i + 1)}
        />
      ),
    },
    {
      name: "terms",
      component: (
        <ConfirmationModalTermsTab
          onNext={() => setActiveIndex((i) => i + 1)}
          commonTranslationProps={common}
        />
      ),
    },
    {
      name: "start",
      component: (
        <ConfirmationModalStartTab
          bridge={bridge}
          allowance={allowance}
          approve={approve}
          initiateBridge={initiateBridge}
        />
      ),
    },
  ];

  useEffect(() => {
    setActiveIndex(0);
  }, [open]);

  if (pendingBridgeTransactionHash) {
    return (
      <Dialog open={open} onOpenChange={cancel}>
        <DialogContent hideCloseButton>
          <TrackBridgeProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={cancel}>
      <DialogContent hideCloseButton>
        <div className="flex justify-between items center p-4 border-b border-muted">
          <div className="w-10 h-10 shrink-0">
            {/* back button */}
            {activeIndex !== 0 && (
              <button
                onClick={() => setActiveIndex((a) => a - 1)}
                className="w-10 h-10 shrink-0 flex items-center justify-center bg-muted rounded-full hover:scale-105 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="w-3.5 h-3.5 fill-foreground"
                >
                  <path d="M7 0.677246C6.70724 0.677246 6.41553 0.769919 6.1849 0.984753L0.523395 5.9849C0.246428 6.23133 0 6.55463 0 7.0001C0 7.44556 0.246428 7.76887 0.523395 8.01529L6.1849 13.0154C6.41553 13.2313 6.70829 13.323 7 13.323C7.67715 13.323 8.23108 12.769 8.23108 12.0919C8.23108 11.738 8.09312 11.4147 7.81616 11.1693L4.49361 8.23118H12.7689C13.4461 8.23118 14 7.67725 14 7.0001C14 6.32295 13.4461 5.76902 12.7689 5.76902H4.49255L7.8151 2.83085C8.09207 2.58442 8.23003 2.26217 8.23003 1.90833C8.23003 1.23118 7.67609 0.677246 6.99895 0.677246L7 0.677246Z" />
                </svg>
              </button>
            )}
          </div>

          {/* tabs */}
          <div className="flex items-center gap-1 justify-center w-full">
            {tabs.map((tab, index) => (
              <div
                key={tab.name}
                className={clsx(
                  "w-10 h-1 rounded-full",
                  index === activeIndex ? "bg-primary" : "bg-muted"
                )}
              ></div>
            ))}
          </div>
          <div className="w-10 h-10 shrink-0" />
        </div>

        <div>{tabs[activeIndex].component}</div>
      </DialogContent>
    </Dialog>
  );
};
