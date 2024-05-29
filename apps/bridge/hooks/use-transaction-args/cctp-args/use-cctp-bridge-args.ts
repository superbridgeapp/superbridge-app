import { Address, encodeFunctionData } from "viem";

import { TokenMessengerAbi } from "@/abis/cctp/TokenMessenger";
import { useBridgeControllerGetCctpDomains } from "@/codegen/index";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";

import { addressToBytes32, isCctpBridgeOperation } from "./common";

export const useCctpArgs = () => {
  const cctpDomains = useBridgeControllerGetCctpDomains();

  const stateToken = useConfigState.useToken();
  const recipientAddress = useConfigState.useRecipientAddress();

  const weiAmount = useWeiAmount();
  const from = useFromChain();
  const to = useToChain();

  const fromCctp = cctpDomains.data?.data.find((x) => x.chainId === from?.id);
  const toCctp = cctpDomains.data?.data.find((x) => x.chainId === to?.id);
  const fromToken = stateToken?.[from?.id ?? 0];
  const toToken = stateToken?.[to?.id ?? 0];

  if (
    !fromToken ||
    !toToken ||
    !fromCctp ||
    !toCctp ||
    !recipientAddress ||
    !isCctpBridgeOperation(stateToken)
  ) {
    return;
  }

  return {
    approvalAddress: fromCctp.contractAddresses.tokenMessenger as Address,
    tx: {
      to: fromCctp.contractAddresses.tokenMessenger as Address,
      data: encodeFunctionData({
        abi: TokenMessengerAbi,
        functionName: "depositForBurn",
        args: [
          weiAmount,
          toCctp.domain,
          addressToBytes32(recipientAddress),
          fromToken.address,
        ],
      }),
      value: BigInt("0"),
      chainId: fromCctp.chainId,
    },
  };
};
