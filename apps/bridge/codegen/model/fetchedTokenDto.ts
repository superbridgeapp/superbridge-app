/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { OpBridgedUsdcDto } from './opBridgedUsdcDto';
import type { FetchedTokenDtoOpBridgedUsdcV2 } from './fetchedTokenDtoOpBridgedUsdcV2';

export interface FetchedTokenDto {
  address: string;
  bridge: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  opBridgedUsdc?: OpBridgedUsdcDto;
  opBridgedUsdcV2?: FetchedTokenDtoOpBridgedUsdcV2;
  symbol: string;
}
