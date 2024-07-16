import { FetchFeeDataResult } from "@wagmi/core";
import { Address, pad, zeroAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import {
  DeploymentDto,
  DeploymentFamily,
  DeploymentType,
} from "@/codegen/model";
import { ArbitrumToken, OptimismToken, Token } from "@/types/token";
import {
  ArbitrumDeploymentDto,
  OptimismDeploymentDto,
} from "@/utils/is-mainnet";

export const chainIds = {
  mainnetL1: 1,
  mainnetL2: 10,
  testnetL1: 5,
  testnetL2: 7777777,
};

let counter = 0;
export const getAddress = () => {
  counter++;
  return privateKeyToAccount(pad(counter.toString(16) as Address)).address;
};

export const deployments = {
  mainnetArbitrum: {
    type: DeploymentType.mainnet,
    family: DeploymentFamily.arbitrum,
    l1: {
      id: chainIds.mainnetL1,
    },
    l2: {
      id: chainIds.mainnetL2,
    },
    contractAddresses: {
      inbox: getAddress(),
      l1GatewayRouter: getAddress(),
      l2GatewayRouter: getAddress(),
    },
  } as unknown as ArbitrumDeploymentDto,
  mainnetOptimism: {
    type: DeploymentType.mainnet,
    family: DeploymentFamily.optimism,
    l1: {
      id: chainIds.mainnetL1,
    },
    l2: {
      id: chainIds.mainnetL2,
    },
    contractAddresses: {
      optimismPortal: getAddress(),
      l1StandardBridge: getAddress(),
      l2: {
        L2StandardBridge: getAddress(),
      },
    },
  } as unknown as OptimismDeploymentDto,
  testnetOptimism: {
    type: DeploymentType.testnet,
    family: DeploymentFamily.optimism,
    l1: {
      id: chainIds.testnetL1,
    },
    l2: {
      id: chainIds.testnetL2,
    },
    contractAddresses: {
      optimismPortal: getAddress(),
      l1StandardBridge: getAddress(),
      l2: {
        L2StandardBridge: getAddress(),
      },
    },
  } as unknown as OptimismDeploymentDto,
};

export const mainnetDeployment: DeploymentDto = {
  type: DeploymentType.mainnet,
  family: DeploymentFamily.optimism,
  // @ts-expect-error
  l1: {
    id: chainIds.mainnetL1,
  },
  // @ts-expect-error
  l2: {
    id: chainIds.mainnetL2,
  },
  // @ts-expect-error
  contractAddresses: {
    optimismPortal: getAddress(),
  },
};
export const testnetDeployment: DeploymentDto = {
  type: DeploymentType.testnet,
  family: DeploymentFamily.optimism,
  // @ts-expect-error
  l1: {
    id: chainIds.testnetL1,
  },
  // @ts-expect-error
  l2: {
    id: chainIds.testnetL2,
  },
  // @ts-expect-error
  contractAddresses: {
    optimismPortal: getAddress(),
  },
};

export const ether = (chainId: number): Token => ({
  chainId,
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
  address: zeroAddress,
  logoURI: "",
  standardBridgeAddresses: {},
  arbitrumBridgeInfo: {},
});

export const usdc = (
  localChainId: number,
  remoteChainId: number
): OptimismToken & ArbitrumToken => ({
  chainId: localChainId,
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  address: "0x0000000000000000000000000000000000000099",
  logoURI: "",
  opTokenId: "usdc",
  standardBridgeAddresses: {
    [remoteChainId]: getAddress(),
  },
  arbitrumBridgeInfo: {
    [remoteChainId]: getAddress(),
  },
});

export const mainnetEther = {
  [chainIds.mainnetL1]: ether(chainIds.mainnetL1),
  [chainIds.mainnetL2]: ether(chainIds.mainnetL2),
};
export const testnetEther = {
  [chainIds.testnetL1]: ether(chainIds.testnetL1),
  [chainIds.testnetL2]: ether(chainIds.testnetL2),
};

export const mainnetUsdc = {
  [chainIds.mainnetL1]: usdc(chainIds.mainnetL1, chainIds.mainnetL2),
  [chainIds.mainnetL2]: usdc(chainIds.mainnetL2, chainIds.mainnetL1),
};
export const testnetUsdc = {
  [chainIds.testnetL1]: usdc(chainIds.testnetL1, chainIds.testnetL2),
  [chainIds.testnetL2]: usdc(chainIds.testnetL2, chainIds.testnetL1),
};

export const feeData: FetchFeeDataResult = {
  formatted: {
    gasPrice: "10",
    maxFeePerGas: "10",
    maxPriorityFeePerGas: "10",
  },
  gasPrice: BigInt(10),
  lastBaseFeePerGas: BigInt(10),
  maxFeePerGas: BigInt(1),
  maxPriorityFeePerGas: BigInt(1),
};
