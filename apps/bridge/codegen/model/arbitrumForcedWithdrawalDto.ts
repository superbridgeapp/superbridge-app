/**
 * Generated by orval v6.30.2 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { ArbitrumForcedWithdrawalDtoDeposit } from './arbitrumForcedWithdrawalDtoDeposit';
import type { ArbitrumTransactionType } from './arbitrumTransactionType';
import type { ArbitrumWithdrawalDto } from './arbitrumWithdrawalDto';

export interface ArbitrumForcedWithdrawalDto {
  deposit: ArbitrumForcedWithdrawalDtoDeposit;
  id: string;
  type: ArbitrumTransactionType;
  withdrawal?: ArbitrumWithdrawalDto;
}
