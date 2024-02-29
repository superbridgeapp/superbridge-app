import { isAddressEqual } from "viem";

import { MultiChainToken } from "@/types/token";
import * as usdc from "@/utils/token-list/json/usdc";

// https://developers.circle.com/stablecoins/docs/usdc-on-main-networks
export const isNativeUsdc = (token: MultiChainToken | null) => {
  if (!token) return null;
  return usdc.native.every((x) =>
    Object.values(token).find((t) => isAddressEqual(t.address, x.address))
  );
};

export const isBridgedUsdc = (token: MultiChainToken) => {
  return usdc.bridged.every((x) =>
    Object.values(token).find((t) => isAddressEqual(t.address, x.address))
  );
};
