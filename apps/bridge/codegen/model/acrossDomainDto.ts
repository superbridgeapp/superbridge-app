/**
 * Generated by orval v6.30.2 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { ChainDto } from './chainDto';
import type { AcrossContractAddressesDto } from './acrossContractAddressesDto';

export interface AcrossDomainDto {
  chain: ChainDto;
  contractAddresses: AcrossContractAddressesDto;
  createdAt: string;
  id: string;
  updatedAt: string;
}
