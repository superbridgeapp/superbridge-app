/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { TransactionStatus } from './transactionStatus';

export interface ConfirmationDto {
  timestamp: number;
  transactionHash: string;
  blockNumber: number;
  status: TransactionStatus;
}
