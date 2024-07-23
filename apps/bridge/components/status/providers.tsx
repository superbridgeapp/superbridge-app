import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { DeploymentDto } from "@/codegen/model";
import { getWagmiConfig } from "@/services/wagmi";
import { queryClient } from "@/utils/query-client";

export const SupportProviders = ({
  deployment,
  children,
}: {
  deployment: DeploymentDto;
  children: any;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={getWagmiConfig([deployment.l1, deployment.l2])}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  );
};
