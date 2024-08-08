import { Address, isAddressEqual } from "viem";

import { MultiChainToken } from "@/types/token";

export const isBridgedUsdc = (t: MultiChainToken) => {
  return (
    t[1] &&
    t[10] &&
    isAddressEqual(
      t[1].address as Address,
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    ) &&
    isAddressEqual(
      t[10].address as Address,
      "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"
    )
  );
};
