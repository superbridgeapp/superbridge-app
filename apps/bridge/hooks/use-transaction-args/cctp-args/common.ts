import { Address } from "viem";

import { MultiChainToken } from "@/types/token";
import { isNativeUsdc } from "@/utils/is-usdc";

export function addressToBytes32(address: Address): Address {
  // "0x" + 24 zeros + Rest of the address string with leading "0x" trimmed
  return (address.slice(0, 2) +
    "000000000000000000000000" +
    address.slice(2, address.length)) as Address;
}

export const isCctpBridgeOperation = (stateToken: MultiChainToken) => {
  return isNativeUsdc(stateToken);
};
