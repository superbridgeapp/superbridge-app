import { isAddressEqual, zeroAddress } from "viem";

import { MultiChainToken, Token } from "@/types/token";

export const deadAddress = "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000";

export const isEth = (token?: Token | null) => {
  if (!token) {
    return false;
  }
  return (
    isAddressEqual(token.address, zeroAddress) ||
    isAddressEqual(token.address, deadAddress)
  );
};

export const isNativeToken = (token: MultiChainToken | null) => {
  if (!token) return false;

  for (const chainId in token) {
    const address = token[chainId]?.address;
    if (address && isAddressEqual(zeroAddress, address)) return true;
    if (address && isAddressEqual(deadAddress, address)) return true;
  }

  return false;
};
