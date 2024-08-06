import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { DeploymentDto } from "@/codegen/model";
import { useSupportWagmiConfig } from "@/hooks/wagmi/use-support-wagmi-config";
import { queryClient } from "@/utils/query-client";

export const SupportProviders = ({
  deployment,
  children,
}: {
  deployment: DeploymentDto;
  children: any;
}) => {
  const wagmiConfig = useSupportWagmiConfig(deployment);
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </QueryClientProvider>
  );
};
