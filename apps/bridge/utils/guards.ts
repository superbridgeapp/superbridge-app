import {
  ArbitrumDepositEthDto,
  ArbitrumDepositRetryableDto,
  ArbitrumForcedWithdrawalDto,
  ArbitrumTransactionType,
  ArbitrumWithdrawalDto,
  BridgeNftDto,
  BridgeWithdrawalDto,
  CctpBridgeDto,
  CctpTransactionType,
  ForcedWithdrawalDto,
  OptimismTransactionType,
  PortalDepositDto,
} from "@/codegen/model";
import {
  ArbitrumToken,
  MultiChainToken,
  OptimismToken,
  Token,
} from "@/types/token";
import {
  AbritrumTransaction,
  OptimismTransaction,
  Transaction,
} from "@/types/transaction";
import { isEth } from "./is-eth";

export const isArbitrumTx = (tx: Transaction): tx is AbritrumTransaction => {
  return Object.values(ArbitrumTransactionType).includes(
    tx.type as ArbitrumTransactionType
  );
};

export const isOptimismTx = (tx: Transaction): tx is OptimismTransaction => {
  return Object.values(OptimismTransactionType).includes(
    tx.type as OptimismTransactionType
  );
};

export const isDeposit = (
  tx: Transaction
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
  tx: Transaction
): tx is BridgeWithdrawalDto | ArbitrumWithdrawalDto => {
  return [
    OptimismTransactionType.withdrawal,
    ArbitrumTransactionType["arbitrum-withdrawal"],
  ].includes(tx.type as any);
};

export const isForcedWithdrawal = (
  tx: Transaction
): tx is ForcedWithdrawalDto | ArbitrumForcedWithdrawalDto => {
  return [
    OptimismTransactionType["forced-withdrawal"],
    ArbitrumTransactionType["arbitrum-forced-withdrawal"],
  ].includes(tx.type as any);
};

export const isArbitrumDeposit = (
  tx: Transaction
): tx is ArbitrumDepositEthDto | ArbitrumDepositRetryableDto => {
  return [
    ArbitrumTransactionType["arbitrum-deposit-eth"],
    ArbitrumTransactionType["arbitrum-deposit-retryable"],
  ].includes(tx.type as any);
};

export const isArbitrumWithdrawal = (
  tx: Transaction
): tx is ArbitrumWithdrawalDto => {
  return tx.type === ArbitrumTransactionType["arbitrum-withdrawal"];
};

export const isArbitrumForcedWithdrawal = (
  tx: Transaction
): tx is ArbitrumForcedWithdrawalDto => {
  return tx.type === ArbitrumTransactionType["arbitrum-forced-withdrawal"];
};

export const isOptimismDeposit = (tx: Transaction): tx is PortalDepositDto => {
  return tx.type === OptimismTransactionType.deposit;
};

export const isOptimismWithdrawal = (
  tx: Transaction
): tx is BridgeWithdrawalDto => {
  return tx.type === OptimismTransactionType.withdrawal;
};

export const isOptimismForcedWithdrawal = (
  tx: Transaction
): tx is ForcedWithdrawalDto => {
  return tx.type === OptimismTransactionType["forced-withdrawal"];
};

export const isCctpBridge = (tx: Transaction): tx is CctpBridgeDto => {
  return tx.type === CctpTransactionType["cctp-bridge"];
};

export const isOptimismToken = (t: Token): t is OptimismToken => {
  return isEth(t) || !!(t as OptimismToken).standardBridgeAddresses;
};

export const isArbitrumToken = (t: Token): t is ArbitrumToken => {
  return isEth(t) || !!(t as ArbitrumToken).arbitrumBridgeInfo;
};
