import {
  AcrossBridgeDto,
  ArbitrumDepositEthDto,
  ArbitrumDepositRetryableDto,
  ArbitrumForcedWithdrawalDto,
  ArbitrumWithdrawalDto,
  BridgeWithdrawalDto,
  CctpBridgeDto,
  ForcedWithdrawalDto,
  PortalDepositDto,
} from "@/codegen/model";

export type AbritrumTransaction =
  | ArbitrumDepositEthDto
  | ArbitrumDepositRetryableDto
  | ArbitrumWithdrawalDto
  | ArbitrumForcedWithdrawalDto;
export type OptimismTransaction =
  | PortalDepositDto
  | BridgeWithdrawalDto
  | ForcedWithdrawalDto;

export type Transaction =
  | AbritrumTransaction
  | OptimismTransaction
  | CctpBridgeDto
  | AcrossBridgeDto;
