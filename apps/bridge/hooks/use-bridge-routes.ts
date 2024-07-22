import { isAddress } from "viem";
import { useAccount } from "wagmi";

import { useConfigState } from "@/state/config";
import { isHyperlaneToken } from "@/utils/guards";

import { useBridgeControllerGetRoutes } from "../codegen";
import { useFromChain, useToChain } from "./use-chain";
import { useGraffiti } from "./use-graffiti";
import { useWeiAmount } from "./use-wei-amount";

export const useBridgeRoutes = () => {
  const from = useFromChain();
  const to = useToChain();
  const account = useAccount();

  const stateToken = useConfigState.useToken();
  const recipientAddress = useConfigState.useRecipientAddress();

  const fromToken = stateToken?.[from?.id ?? 0];
  const toToken = stateToken?.[to?.id ?? 0];
  const fromTokenAddress = fromToken?.address;
  const toTokenAddress = toToken?.address;

  const weiAmount = useWeiAmount();
  const routes = useBridgeControllerGetRoutes(
    {
      amount: weiAmount.toString(),
      fromChainId: from?.id.toString() ?? "",
      toChainId: to?.id.toString() ?? "",
      fromTokenAddress: fromTokenAddress ?? "",
      toTokenAddress: toTokenAddress ?? "",
      graffiti: useGraffiti(),
      recipient: recipientAddress,
      sender: account.address ?? "",

      forceViaL1: false,

      hyperlaneFromTokenRouterAddress:
        !!fromToken && isHyperlaneToken(fromToken)
          ? fromToken.hyperlane.router
          : undefined,
      hyperlaneToTokenRouterAddress:
        !!toToken && isHyperlaneToken(toToken)
          ? toToken.hyperlane.router
          : undefined,
    },
    {
      query: {
        enabled:
          !!weiAmount &&
          !!from &&
          !!to &&
          !!fromTokenAddress &&
          !!toTokenAddress &&
          !!recipientAddress &&
          isAddress(recipientAddress) &&
          !!account.address,
      },
    }
  );

  return {
    isLoading: routes.isFetching,
    data: routes.data?.data ?? null,
  };
};
