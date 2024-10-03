import { RouteProvider } from "@/codegen/model";

const names = {
  [RouteProvider.Across]: "Across",
  [RouteProvider.Cctp]: "CCTP",
  [RouteProvider.ArbitrumDeposit]: "Native Bridge",
  [RouteProvider.ArbitrumWithdrawal]: "Native Bridge",
  [RouteProvider.OptimismDeposit]: "Native Bridge",
  [RouteProvider.OptimismWithdrawal]: "Native Bridge",
  [RouteProvider.OptimismForcedWithdrawal]: "Native Bridge",
  [RouteProvider.Hyperlane]: "Hyperlane",
  [RouteProvider.Lz]: "Layer Zero",
};

export const useProviderName = (provider: RouteProvider | null) => {
  if (!provider) return "";

  return names[provider];
};
