/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { BridgeNftChainConfigDto } from './bridgeNftChainConfigDto';

export interface BridgeNftDto {
  name: string;
  tokenId: string;
  image?: string;
  tokenUri?: string;
  localConfig: BridgeNftChainConfigDto;
  remoteConfig: BridgeNftChainConfigDto;
}
