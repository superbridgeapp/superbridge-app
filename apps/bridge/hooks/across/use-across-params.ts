import { Address, isAddress, isAddressEqual, zeroAddress } from "viem";
import { base, mainnet, optimism } from "viem/chains";

import { useConfigState } from "@/state/config";
import { deadAddress } from "@/utils/is-eth";

import { useFromChain, useToChain } from "../use-chain";
import { useWeiAmount } from "../use-wei-amount";

const WETH: { [chainId: number]: Address } = {
  [mainnet.id]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  [base.id]: "0x4200000000000000000000000000000000000006",
  [optimism.id]: "0x4200000000000000000000000000000000000006",
};

const cleanAddress = (chainId: number | undefined, x: string | undefined) => {
  return !!x &&
    isAddress(x) &&
    (isAddressEqual(x, zeroAddress) || isAddressEqual(x, deadAddress))
    ? WETH[chainId ?? 0]
    : x;
};

export const useAcrossParams = () => {
  const stateToken = useConfigState.useToken();
  const from = useFromChain();
  const to = useToChain();
  const amount = useWeiAmount();
  const recipient = useConfigState.useRecipientAddress();

  const inputToken = cleanAddress(
    from?.id,
    stateToken?.[from?.id ?? 0]?.address
  );
  const outputToken = cleanAddress(to?.id, stateToken?.[to?.id ?? 0]?.address);
  const originChainId = from?.id.toString();
  const destinationChainId = to?.id.toPrecision();

  if (
    !inputToken ||
    !outputToken ||
    !recipient ||
    !originChainId ||
    !destinationChainId
  ) {
    return null;
  }

  return {
    inputToken,
    outputToken,
    originChainId,
    destinationChainId,
    recipient,
    amount: amount.toString(),
  };
};
