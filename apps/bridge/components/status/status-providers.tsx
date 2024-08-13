import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { DeploymentDto } from "@/codegen/model";
import { useStatusWagmiConfig } from "@/hooks/wagmi/use-status-wagmi-config";
import { queryClient } from "@/services/query-client";

export const StatusProviders = ({
  deployments,
  children,
}: {
  deployments: DeploymentDto[];
  children: any;
}) => {
  const wagmiConfig = useStatusWagmiConfig(deployments);
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </QueryClientProvider>
  );
};
