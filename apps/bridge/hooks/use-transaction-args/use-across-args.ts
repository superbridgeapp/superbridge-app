import { Address, encodeFunctionData, zeroAddress } from "viem";
import { useAccount } from "wagmi";

import { SpokePoolAbi } from "@/abis/across/SpokePool";
import { useConfigState } from "@/state/config";
import { isNativeToken } from "@/utils/is-eth";

import { useAcrossTokenAddress } from "../across/use-across-clean-address";
import { useAcrossDomains } from "../across/use-across-domains";
import { useAcrossQuote } from "../across/use-across-quote";
import { useFromChain, useToChain } from "../use-chain";
import { useWeiAmount } from "../use-wei-amount";

export const useAcrossArgs = () => {
  const account = useAccount();
  const from = useFromChain();
  const to = useToChain();
  const weiAmount = useWeiAmount();

  const recipient = useConfigState.useRecipientAddress();
  const stateToken = useConfigState.useToken();

  const acrossDomains = useAcrossDomains();

  const pool = acrossDomains.find((x) => x.chain.id === from?.id);

  const localToken = stateToken?.[from?.id ?? 0];
  const remoteToken = stateToken?.[to?.id ?? 0];

  const quote = useAcrossQuote();

  const parsedLocalAddress = useAcrossTokenAddress(
    localToken?.chainId,
    localToken?.address
  );
  const parsedRemoteAddress = useAcrossTokenAddress(
    remoteToken?.chainId,
    remoteToken?.address
  );

  if (
    !pool ||
    !account.address ||
    !recipient ||
    !parsedLocalAddress ||
    !parsedRemoteAddress ||
    !to ||
    !from ||
    !quote.data
  ) {
    return;
  }

  return {
    approvalAddress: isNativeToken(stateToken)
      ? undefined
      : pool.contractAddresses.spokePool,
    tx: {
      to: pool.contractAddresses.spokePool as Address,
      data: encodeFunctionData({
        abi: SpokePoolAbi,
        functionName: "depositV3",
        args: [
          account.address, // depositor
          recipient, // recipient,
          parsedLocalAddress, // inputToken
          parsedRemoteAddress, // outputToken
          weiAmount, // inputAmount
          weiAmount - BigInt(quote.data.totalRelayFee.total), // outputAmount: this is the amount - relay fees. totalRelayFee.total is the value returned by the suggested-fees API.
          BigInt(to.id), // uint256 destinationChainId
          zeroAddress, // exclusiveRelayer 0x0 for typical integrations
          parseInt(quote.data.timestamp), // quoteTimestamp
          Math.round(Date.now() / 1000) + 21600, // fillDeadline: We reccomend a fill deadline of 6 hours out. The contract will reject this if it is beyond 8 hours from now.
          0, // exclusivityDeadline
          "0x", //  message
        ],
      }),
      chainId: from.id,
      value: isNativeToken(stateToken) ? weiAmount : BigInt(0),
    },
  };
};
