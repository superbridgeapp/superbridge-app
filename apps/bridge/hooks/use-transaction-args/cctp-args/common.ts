import { Address } from "viem";

export function addressToBytes32(address: Address): Address {
  // "0x" + 24 zeros + Rest of the address string with leading "0x" trimmed
  return (address.slice(0, 2) +
    "000000000000000000000000" +
    address.slice(2, address.length)) as Address;
}
