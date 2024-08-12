import {
  ArbitrumContractAddressesDto,
  DeploymentDto,
  DeploymentFamily,
  DeploymentType,
  OptimismConfigDto,
  OptimismContractAddressesDto,
} from "@/codegen/model";

export const isMainnet = (d: DeploymentDto | null) => {
  if (!d) {
    return false;
  }

  if (d.type === DeploymentType.mainnet) {
    return true;
  }

  // We have our contracts deployed on Optimism Goerli for testing
  if (d.type === DeploymentType.testnet && d.l1.id === 5 && d.l2.id === 420) {
    return true;
  }

  // We have our contracts deployed on Arbitrum Goerli for testing
  if (
    d.type === DeploymentType.testnet &&
    d.l1.id === 5 &&
    d.l2.id === 421613
  ) {
    return true;
  }

  return false;
};

export interface ArbitrumDeploymentDto extends DeploymentDto {
  contractAddresses: ArbitrumContractAddressesDto;
}

export const isArbitrum = (d: DeploymentDto): d is ArbitrumDeploymentDto => {
  return d.family === DeploymentFamily.arbitrum;
};

export interface OptimismDeploymentDto extends DeploymentDto {
  contractAddresses: OptimismContractAddressesDto;
  config: OptimismConfigDto;
}

export const isOptimism = (d: DeploymentDto): d is OptimismDeploymentDto => {
  return d.family === DeploymentFamily.optimism;
};
