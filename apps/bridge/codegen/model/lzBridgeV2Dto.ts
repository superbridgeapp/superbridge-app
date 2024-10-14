/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { ConfirmationDto } from './confirmationDto';
import type { LzTransactionType } from './lzTransactionType';

export interface LzBridgeV2Dto {
  amount: string;
  createdAt: string;
  from: string;
  fromEid: number;
  id: string;
  receive?: ConfirmationDto;
  send: ConfirmationDto;
  to: string;
  toEid: number;
  token: string;
  type: LzTransactionType;
  updatedAt: string;
}