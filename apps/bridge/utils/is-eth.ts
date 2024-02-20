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

export const isNativeToken = (token?: MultiChainToken | null) => {
  if (!token) {
    return false;
  }

  const l1Address = token[1]?.address ?? token[57]?.address;
  const l2Address = token[10]?.address ?? token[570]?.address;
  return (
    (l1Address && isAddressEqual(l1Address, zeroAddress)) ||
    (l2Address && isAddressEqual(l2Address, deadAddress))
  );
};
