import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { DeploymentDto } from "@/codegen/model";
import { getWagmiConfig } from "@/services/wagmi";
import { queryClient } from "@/utils/query-client";

import { SupportStatusWidget } from "./widget";

export const SupportStatusWidgetWrapper = ({
  deployment,
}: {
  deployment: DeploymentDto;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={getWagmiConfig([deployment])}>
        <SupportStatusWidget deployment={deployment} />
      </WagmiProvider>
    </QueryClientProvider>
  );
};
