import { isAddressEqual } from "viem";

import { MultiChainToken } from "@/types/token";
import * as usdc from "@/utils/token-list/json/usdc";

// https://developers.circle.com/stablecoins/docs/usdc-on-main-networks
export const isNativeUsdc = (token: MultiChainToken) => {
  return usdc.native.every((x) =>
    Object.values(token).find((t) => isAddressEqual(t.address, x.address))
  );
  // return (
  //   token[1]?.address &&
  //   token[10]?.address &&
  //   isAddressEqual(
  //     token[1].address,
  //     "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  //   ) &&
  //   isAddressEqual(
  //     token[10].address,
  //     "0x0b2c639c533813f4aa9d7837caf62653d097ff85"
  //   )
  // );
};

export const isBridgedUsdc = (token: MultiChainToken) => {
  return usdc.bridged.every((x) =>
    Object.values(token).find((t) => isAddressEqual(t.address, x.address))
  );
  // return (
  //   token[1]?.address &&
  //   token[10]?.address &&
  //   isAddressEqual(
  //     token[1].address,
  //     "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  //   ) &&
  //   isAddressEqual(
  //     token[10].address,
  //     "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"
  //   )
  // );
};
