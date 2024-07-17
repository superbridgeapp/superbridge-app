import { Address, Hex, encodeFunctionData } from "viem";

import { TokenMessengerAbi } from "@/abis/cctp/TokenMessenger";
import { useCctpDomains } from "@/hooks/cctp/use-cctp-domains";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useGraffiti } from "@/hooks/use-graffiti";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";
import { isCctp } from "@/utils/is-cctp";

import { addressToBytes32 } from "./common";

export const useCctpArgs = () => {
  const stateToken = useConfigState.useToken();
  const recipientAddress = useConfigState.useRecipientAddress();

  const graffiti = useGraffiti();
  const cctpDomains = useCctpDomains();
  const weiAmount = useWeiAmount();
  const from = useFromChain();
  const to = useToChain();

  const fromCctp = cctpDomains.find((x) => x.chainId === from?.id);
  const toCctp = cctpDomains.find((x) => x.chainId === to?.id);
  const fromToken = stateToken?.[from?.id ?? 0];
  const toToken = stateToken?.[to?.id ?? 0];

  if (
    !fromToken ||
    !toToken ||
    !fromCctp ||
    !toCctp ||
    !recipientAddress ||
    !isCctp(stateToken)
  ) {
    return;
  }

  const input = encodeFunctionData({
    abi: TokenMessengerAbi,
    functionName: "depositForBurn",
    args: [
      weiAmount,
      toCctp.domain,
      addressToBytes32(recipientAddress),
      fromToken.address,
    ],
  });
  const data: Hex = `${input}${graffiti.slice(2)}`;

  return {
    approvalAddress: fromCctp.contractAddresses.tokenMessenger as Address,
    tx: {
      to: fromCctp.contractAddresses.tokenMessenger as Address,
      data,
      value: BigInt("0"),
      chainId: fromCctp.chainId,
    },
  };
};
