import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { DeploymentDto } from "@/codegen/model";
import { getWagmiConfig } from "@/services/wagmi";
import { queryClient } from "@/utils/query-client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { StatusCheckProps } from "./types";
import { SupportStatusWidget } from "./widget";

export const SupportStatusWidgetWrapper = ({
  deployment,
  open,
  setOpen,
  setSupportChecks,
}: {
  deployment: DeploymentDto;
  open: boolean;
  setOpen: (x: boolean) => void;
} & StatusCheckProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={getWagmiConfig([deployment])}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl tracking-tight">
                {deployment.l2.name} status
              </DialogTitle>
            </DialogHeader>
            <div>
              <SupportStatusWidget
                deployment={deployment}
                setSupportChecks={setSupportChecks}
              />
            </div>
          </DialogContent>
        </Dialog>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
