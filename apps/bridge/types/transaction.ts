import {
  ArbitrumDepositEthDto,
  ArbitrumDepositRetryableDto,
  ArbitrumForcedWithdrawalDto,
  ArbitrumWithdrawalDto,
  BridgeWithdrawalDto,
  CctpBridgeDto,
  ForcedWithdrawalDto,
  HyperlaneBridgeDto,
  LzBridgeV2Dto,
  PortalDepositDto,
} from "@/codegen/model";

import { AcrossBridgeDto } from "./across";

export type AbritrumTransaction =
  | ArbitrumDepositEthDto
  | ArbitrumDepositRetryableDto
  | ArbitrumWithdrawalDto
  | ArbitrumForcedWithdrawalDto;
export type OptimismTransaction =
  | PortalDepositDto
  | BridgeWithdrawalDto
  | ForcedWithdrawalDto;

type All =
  | AbritrumTransaction
  | OptimismTransaction
  | CctpBridgeDto
  | AcrossBridgeDto
  | HyperlaneBridgeDto
  | LzBridgeV2Dto;

export type Transaction = All & { mock?: true };
