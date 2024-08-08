import { Address, isAddressEqual, zeroAddress } from "viem";

import { BridgeableTokenDto } from "@/codegen/model";
import { MultiChainToken } from "@/types/token";

export const deadAddress = "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000";

export const isEth = (token?: BridgeableTokenDto | null) => {
  if (!token) {
    return false;
  }
  return (
    isAddressEqual(token.address as Address, zeroAddress) ||
    isAddressEqual(token.address as Address, deadAddress)
  );
};

export const isNativeToken = (token: MultiChainToken | null) => {
  if (!token) return false;

  for (const chainId in token) {
    const address = token[chainId]?.address;
    if (address && isAddressEqual(zeroAddress, address as Address)) return true;
    if (address && isAddressEqual(deadAddress, address as Address)) return true;
  }

  return false;
};
