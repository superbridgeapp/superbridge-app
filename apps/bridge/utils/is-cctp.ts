import { isAddressEqual } from "viem";

import { MultiChainToken } from "@/types/token";
import { eurc } from "@/utils/token-list/json/cctp/eurc";
import * as usdc from "@/utils/token-list/json/cctp/usdc";

// https://developers.circle.com/stablecoins/docs/usdc-on-main-networks
export const isCctp = (token: MultiChainToken | null) => {
  if (!token) return false;
  return (
    usdc.native.every((x) =>
      Object.values(token).find((t) => isAddressEqual(t.address, x.address))
    ) ||
    eurc.every((x) =>
      Object.values(token).find((t) => isAddressEqual(t.address, x.address))
    )
  );
};

export const isBridgedUsdc = (token: MultiChainToken) => {
  return usdc.bridged.every((x) =>
    Object.values(token).find((t) => isAddressEqual(t.address, x.address))
  );
};
