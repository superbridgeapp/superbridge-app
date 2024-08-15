import { Address, isAddress, isAddressEqual, zeroAddress } from "viem";
import { base, lisk, mainnet, mode, optimism, redstone } from "viem/chains";

import { deadAddress } from "@/utils/is-eth";

const WETH: { [chainId: number]: Address | undefined } = {
  [mainnet.id]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  [base.id]: "0x4200000000000000000000000000000000000006",
  [optimism.id]: "0x4200000000000000000000000000000000000006",
  [mode.id]: "0x4200000000000000000000000000000000000006",
  [lisk.id]: "0x4200000000000000000000000000000000000006",
  [redstone.id]: "0x4200000000000000000000000000000000000006",
};

/**
 * Across expects WETH rather than 0x0
 */
export const useAcrossTokenAddress = (
  chainId: number | undefined,
  x: string | undefined
): Address | undefined => {
  if (!x || !isAddress(x)) return;
  return isAddressEqual(x, zeroAddress) || isAddressEqual(x, deadAddress)
    ? WETH[chainId ?? 0]
    : x;
};
