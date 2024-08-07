/**
 * Generated by orval v6.30.2 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { ConfirmationDto } from './confirmationDto';
import type { PortalDepositDtoMetadata } from './portalDepositDtoMetadata';
import type { DepositNftDto } from './depositNftDto';
import type { OptimismTransactionType } from './optimismTransactionType';

export interface PortalDepositDto {
  createdAt: string;
  deploymentId: string;
  deposit: ConfirmationDto;
  id: string;
  l2TransactionHash: string;
  metadata: PortalDepositDtoMetadata;
  nft?: DepositNftDto;
  relay?: ConfirmationDto;
  status: number;
  type: OptimismTransactionType;
  updatedAt: string;
}
