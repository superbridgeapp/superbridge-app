/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { FetchedTokenDto } from './fetchedTokenDto';

export interface FetchedMultichainTokenDto {
  createdAt: string;
  id: string;
  l1: FetchedTokenDto;
  l2: FetchedTokenDto;
  updatedAt: string;
}
