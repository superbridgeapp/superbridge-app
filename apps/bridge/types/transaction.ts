import {
  ArbitrumDepositEthDto,
  ArbitrumDepositRetryableDto,
  ArbitrumForcedWithdrawalDto,
  ArbitrumWithdrawalDto,
  BridgeWithdrawalDto,
  CctpBridgeDto,
  ForcedWithdrawalDto,
  HyperlaneBridgeDto,
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

export type Transaction =
  | AbritrumTransaction
  | OptimismTransaction
  | CctpBridgeDto
  | AcrossBridgeDto
  | HyperlaneBridgeDto;
