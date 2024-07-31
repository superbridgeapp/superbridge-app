/**
 * Generated by orval v6.30.2 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { DeploymentDtoArbitrumNativeToken } from './deploymentDtoArbitrumNativeToken';
import type { DeploymentDtoConfig } from './deploymentDtoConfig';
import type { DeploymentDtoContractAddresses } from './deploymentDtoContractAddresses';
import type { DeploymentDtoFamily } from './deploymentDtoFamily';
import type { ChainDto } from './chainDto';
import type { DeploymentDtoStatus } from './deploymentDtoStatus';
import type { DeploymentDtoTheme } from './deploymentDtoTheme';
import type { FetchedMultichainTokenDto } from './fetchedMultichainTokenDto';
import type { DeploymentDtoTos } from './deploymentDtoTos';
import type { DeploymentDtoType } from './deploymentDtoType';

export interface DeploymentDto {
  /** @nullable */
  arbitrumNativeToken: DeploymentDtoArbitrumNativeToken;
  /** @nullable */
  conduitId: string | null;
  config: DeploymentDtoConfig;
  contractAddresses: DeploymentDtoContractAddresses;
  createdAt: string;
  /** @nullable */
  deletedAt: string | null;
  depositDuration: number;
  displayName: string;
  family: DeploymentDtoFamily;
  finalizeDuration: number;
  id: string;
  l1: ChainDto;
  l2: ChainDto;
  name: string;
  /** @nullable */
  proveDuration: number | null;
  /** @nullable */
  provider: string | null;
  status: DeploymentDtoStatus;
  supportsNftBridging: boolean;
  /** @nullable */
  theme: DeploymentDtoTheme;
  tokens: FetchedMultichainTokenDto[];
  /** @nullable */
  tos: DeploymentDtoTos;
  type: DeploymentDtoType;
}
