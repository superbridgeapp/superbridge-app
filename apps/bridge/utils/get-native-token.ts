import { Address, zeroAddress } from "viem";

import { MultiChainToken, MultiChainOptimismToken } from "@/types/token";
import { isArbitrum, isOptimism } from "@/utils/is-mainnet";
import { DeploymentDto } from "@/codegen/model";

export function getNativeTokenForDeployment(
  d: DeploymentDto
): MultiChainToken | null {
  if (!d.arbitrumNativeToken) {
    return null;
  }

  // MetaMask doesn't like SYMBOL lengths of 1
  // for native tokens
  const symbol =
    d.arbitrumNativeToken.symbol.length === 1
      ? `${d.arbitrumNativeToken.symbol}.`
      : d.arbitrumNativeToken.symbol;

  if (isArbitrum(d)) {
    const token: MultiChainToken = {
      [d.l1.id]: {
        address: d.arbitrumNativeToken.address as Address,
        name: d.arbitrumNativeToken.name,
        symbol: d.arbitrumNativeToken.symbol,
        decimals: d.arbitrumNativeToken.decimals,
        chainId: d.l1.id,
        logoURI: "",
        arbitrumBridgeInfo: {
          [d.l2.id]: d.contractAddresses.l1GatewayRouter as Address,
        },
      },
      [d.l2.id]: {
        address: zeroAddress,
        name: d.arbitrumNativeToken.name,
        symbol,
        decimals: d.arbitrumNativeToken.decimals,
        chainId: d.l2.id,
        logoURI: "",
        arbitrumBridgeInfo: {
          [d.l1.id]: d.contractAddresses.l2GatewayRouter as Address,
        },
      },
    };
    return token;
  }

  if (isOptimism(d)) {
    const token: MultiChainOptimismToken = {
      [d.l1.id]: {
        address: d.arbitrumNativeToken.address as Address,
        name: d.arbitrumNativeToken.name,
        symbol: d.arbitrumNativeToken.symbol,
        decimals: d.arbitrumNativeToken.decimals,
        chainId: d.l1.id,
        logoURI: "",
        opTokenId: `native-${d.arbitrumNativeToken.symbol}`,
        standardBridgeAddresses: {
          [d.l2.id]: "0x",
        },
      },
      [d.l2.id]: {
        address: zeroAddress,
        name: d.arbitrumNativeToken.name,
        symbol,
        decimals: d.arbitrumNativeToken.decimals,
        chainId: d.l2.id,
        logoURI: "",
        opTokenId: `native-${d.arbitrumNativeToken.symbol}`,
        standardBridgeAddresses: {
          [d.l1.id]: "0x",
        },
      },
    };
    return token;
  }

  return null;
}
