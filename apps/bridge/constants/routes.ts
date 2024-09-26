import { RouteProvider } from "@/codegen/model";

export const nativeRoutes: RouteProvider[] = [
  RouteProvider.ArbitrumDeposit,
  RouteProvider.ArbitrumWithdrawal,
  RouteProvider.OptimismDeposit,
  RouteProvider.OptimismWithdrawal,
  RouteProvider.OptimismForcedWithdrawal,
];

export const depositRoutes: RouteProvider[] = [
  RouteProvider.ArbitrumDeposit,
  RouteProvider.OptimismDeposit,
];

export const withdrawalRoutes: RouteProvider[] = [
  RouteProvider.ArbitrumWithdrawal,
  RouteProvider.OptimismWithdrawal,
  RouteProvider.OptimismForcedWithdrawal,
];
