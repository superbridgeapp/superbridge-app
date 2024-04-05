import { Address, zeroAddress } from "viem";

import { MultiChainToken } from "@/types/token";
import { isArbitrum } from "@/utils/is-mainnet";

import { DeploymentDto } from "@/codegen/model";

export function getArbitrumNativeTokenForDeployment(
  d: DeploymentDto
): MultiChainToken | null {
  if (!d.arbitrumNativeToken || !isArbitrum(d)) {
    return null;
  }

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
      symbol: d.arbitrumNativeToken.symbol,
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
