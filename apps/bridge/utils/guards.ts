import {
  AcrossTransactionType,
  ActiveDeploymentStatus,
  AmountTooLargeRouteErrorDto,
  AmountTooSmallRouteErrorDto,
  ArbitrumDepositEthDto,
  ArbitrumDepositRetryableDto,
  ArbitrumForcedWithdrawalDto,
  ArbitrumTransactionType,
  ArbitrumWithdrawalDto,
  BridgeWithdrawalDto,
  CctpBridgeDto,
  CctpTransactionType,
  DeploymentStatus,
  DisabledRouteErrorDto,
  ForcedWithdrawalDto,
  GenericRouteErrorDto,
  HyperlaneBridgeDto,
  HyperlaneTransactionType,
  LzBridgeV2Dto,
  LzTransactionType,
  OptimismTransactionType,
  PausedRouteErrorDto,
  PortalDepositDto,
  RouteQuoteDto,
  RouteStepForcedWithdrawalDto,
  RouteStepReceiveDto,
  RouteStepTransactionDto,
  RouteStepType,
  RouteStepWaitDto,
  TrialDeploymentStatus,
} from "@/codegen/model";
import { AcrossBridgeDto } from "@/types/across";
import {
  AbritrumTransaction,
  OptimismTransaction,
  Transaction,
} from "@/types/transaction";

export const isArbitrumTx = (
  tx: Pick<Transaction, "type">
): tx is AbritrumTransaction => {
  return Object.values(ArbitrumTransactionType).includes(
    tx.type as ArbitrumTransactionType
  );
};

export const isOptimismTx = (
  tx: Pick<Transaction, "type">
): tx is OptimismTransaction => {
  return Object.values(OptimismTransactionType).includes(
    tx.type as OptimismTransactionType
  );
};

export const isDeposit = (
  tx: Pick<Transaction, "type">
): tx is
  | PortalDepositDto
  | ArbitrumDepositEthDto
  | ArbitrumDepositRetryableDto => {
  return [
    OptimismTransactionType.deposit,
    ArbitrumTransactionType["arbitrum-deposit-eth"],
    ArbitrumTransactionType["arbitrum-deposit-retryable"],
  ].includes(tx.type as any);
};
export const isWithdrawal = (
  tx: Pick<Transaction, "type">
): tx is BridgeWithdrawalDto | ArbitrumWithdrawalDto => {
  return [
    OptimismTransactionType.withdrawal,
    ArbitrumTransactionType["arbitrum-withdrawal"],
  ].includes(tx.type as any);
};

export const isForcedWithdrawal = (
  tx: Pick<Transaction, "type">
): tx is ForcedWithdrawalDto | ArbitrumForcedWithdrawalDto => {
  return [
    OptimismTransactionType["forced-withdrawal"],
    ArbitrumTransactionType["arbitrum-forced-withdrawal"],
  ].includes(tx.type as any);
};

export const isArbitrumDeposit = (
  tx: Pick<Transaction, "type">
): tx is ArbitrumDepositEthDto | ArbitrumDepositRetryableDto => {
  return [
    ArbitrumTransactionType["arbitrum-deposit-eth"],
    ArbitrumTransactionType["arbitrum-deposit-retryable"],
  ].includes(tx.type as any);
};

export const isArbitrumWithdrawal = (
  tx: Pick<Transaction, "type">
): tx is ArbitrumWithdrawalDto => {
  return tx.type === ArbitrumTransactionType["arbitrum-withdrawal"];
};

export const isArbitrumForcedWithdrawal = (
  tx: Pick<Transaction, "type">
): tx is ArbitrumForcedWithdrawalDto => {
  return tx.type === ArbitrumTransactionType["arbitrum-forced-withdrawal"];
};

export const isOptimismDeposit = (
  tx: Pick<Transaction, "type">
): tx is PortalDepositDto => {
  return tx.type === OptimismTransactionType.deposit;
};

export const isOptimismWithdrawal = (
  tx: Pick<Transaction, "type">
): tx is BridgeWithdrawalDto => {
  return tx.type === OptimismTransactionType.withdrawal;
};

export const isOptimismForcedWithdrawal = (
  tx: Pick<Transaction, "type">
): tx is ForcedWithdrawalDto => {
  return tx.type === OptimismTransactionType["forced-withdrawal"];
};

export const isCctpBridge = (
  tx: Pick<Transaction, "type">
): tx is CctpBridgeDto => {
  return tx.type === CctpTransactionType["cctp-bridge"];
};

export const isAcrossBridge = (
  tx: Pick<Transaction, "type">
): tx is AcrossBridgeDto => {
  return tx.type === AcrossTransactionType["across-bridge"];
};

export const isHyperlaneBridge = (
  tx: Pick<Transaction, "type">
): tx is HyperlaneBridgeDto => {
  return tx.type === HyperlaneTransactionType["hyperlane-bridge"];
};

export const isLzBridge = (
  tx: Pick<Transaction, "type">
): tx is LzBridgeV2Dto => {
  return tx.type === LzTransactionType["lz-bridge"];
};

export const isActive = (
  s: TrialDeploymentStatus | ActiveDeploymentStatus
): s is ActiveDeploymentStatus => {
  return s.status === DeploymentStatus.active;
};

export const isTrial = (
  s: TrialDeploymentStatus | ActiveDeploymentStatus
): s is TrialDeploymentStatus => {
  return s.status === DeploymentStatus.trial;
};

type RouteQuote =
  | RouteQuoteDto
  | GenericRouteErrorDto
  | AmountTooLargeRouteErrorDto
  | AmountTooSmallRouteErrorDto
  | PausedRouteErrorDto
  | DisabledRouteErrorDto;

type RouteQuoteError =
  | GenericRouteErrorDto
  | AmountTooLargeRouteErrorDto
  | AmountTooSmallRouteErrorDto
  | PausedRouteErrorDto
  | DisabledRouteErrorDto;

export const isRouteQuoteError = (a: RouteQuote): a is RouteQuoteError => {
  return !!(a as any).type;
};

export const isAmountTooLargeRouteError = (
  a: RouteQuote
): a is AmountTooLargeRouteErrorDto => {
  return isRouteQuoteError(a) && a.type === "AmountTooLarge";
};

export const isAmountTooSmallRouteError = (
  a: RouteQuote
): a is AmountTooSmallRouteErrorDto => {
  return isRouteQuoteError(a) && a.type === "AmountTooSmall";
};

export const isRouteQuote = (a: RouteQuote | undefined): a is RouteQuoteDto => {
  if (!a) return false;
  return !!(a as RouteQuoteDto).initiatingTransaction;
};

type RouteStepDto =
  | RouteStepWaitDto
  | RouteStepReceiveDto
  | RouteStepTransactionDto
  | RouteStepForcedWithdrawalDto;

export const isRouteWaitStep = (a: RouteStepDto): a is RouteStepWaitDto => {
  return a.type === RouteStepType.Wait;
};

export const isRouteReceiveStep = (
  a: RouteStepDto
): a is RouteStepReceiveDto => {
  return a.type === RouteStepType.Receive;
};

export const isRouteForcedWithdrawalStep = (
  a: RouteStepDto
): a is RouteStepForcedWithdrawalDto => {
  return a.type === RouteStepType.ForcedWithdrawal;
};

export const isRouteTransactionStep = (
  a: RouteStepDto
): a is RouteStepTransactionDto => {
  const options: RouteStepType[] = [
    RouteStepType.Initiate,
    RouteStepType.Prove,
    RouteStepType.Finalize,
  ];
  return options.includes(a.type);
};
