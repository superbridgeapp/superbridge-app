import { RouteProvider } from "@/codegen/model";

import { useSelectedBridgeRoute } from "./use-selected-bridge-route";

export const useIsWithdrawal = () => {
  const optimism = useIsOptimismWithdrawal();
  const arbitrum = useIsArbitrumWithdrawal();

  return optimism || arbitrum;
};

export const useIsOptimismWithdrawal = () => {
  const route = useSelectedBridgeRoute();
  return (
    [
      RouteProvider.OptimismWithdrawal,
      RouteProvider.OptimismForcedWithdrawal,
    ] as string[]
  ).includes(route?.id ?? "");
};

export const useIsArbitrumWithdrawal = () => {
  const route = useSelectedBridgeRoute();
  return route?.id === RouteProvider.ArbitrumWithdrawal;
};

export const useIsArbitrumDeposit = () => {
  const route = useSelectedBridgeRoute();
  return route?.id === RouteProvider.ArbitrumDeposit;
};
