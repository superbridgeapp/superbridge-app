import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { isAddress } from "viem";
import { useAccount } from "wagmi";

import { useConfigState } from "@/state/config";
import { useHyperlaneState } from "@/state/hyperlane";
import { deadAddress } from "@/utils/tokens/is-eth";

import { bridgeControllerGetBridgeRoutes } from "../../codegen";
import { useDestinationToken, useSelectedToken } from "../tokens/use-token";
import { useFromChain, useToChain } from "../use-chain";
import { useGraffiti } from "../use-graffiti";
import { useHost } from "../use-metadata";
import { useWeiAmount } from "../use-wei-amount";

export const useBridgeRoutes = () => {
  const from = useFromChain();
  const to = useToChain();
  const account = useAccount();
  const host = useHost();

  const fromToken = useSelectedToken();
  const toToken = useDestinationToken();
  const recipientAddress = useConfigState.useRecipientAddress();
  const forceViaL1 = useConfigState.useForceViaL1();
  const hyperlaneCustomRoutesId = useHyperlaneState.useCustomRoutesId();

  const fromTokenAddress = fromToken?.address;
  const toTokenAddress = toToken?.address;
  const graffiti = useGraffiti();

  const [weiAmount] = useDebounce(useWeiAmount(), 300);

  const routes = useQuery({
    queryKey: [
      weiAmount.toString(),
      from?.id.toString() ?? "",
      to?.id.toString() ?? "",
      fromTokenAddress ?? "",
      toTokenAddress ?? "",
      recipientAddress || deadAddress,
      account.address ?? deadAddress,
      graffiti,
      forceViaL1,
      host,
      hyperlaneCustomRoutesId,
      fromToken?.hyperlane?.router,
      toToken?.hyperlane?.router,

      fromToken?.opBridgedUsdc?.adapter,
      fromToken?.lz?.adapter,
    ],
    queryFn: () => {
      return bridgeControllerGetBridgeRoutes({
        host,
        hyperlaneCustomRoutesId,
        amount: weiAmount.toString(),
        fromChainId: from?.id.toString() ?? "",
        toChainId: to?.id.toString() ?? "",
        fromTokenAddress: fromTokenAddress ?? "",
        toTokenAddress: toTokenAddress ?? "",
        graffiti,
        recipient: recipientAddress || deadAddress,
        sender: account.address ?? deadAddress,

        forceViaL1,

        hyperlaneFromTokenRouterAddress: fromToken?.hyperlane?.router,
        hyperlaneToTokenRouterAddress: toToken?.hyperlane?.router,

        hyperlane:
          fromToken?.hyperlane && toToken?.hyperlane
            ? {
                from: fromToken.hyperlane,
                to: toToken.hyperlane,
              }
            : undefined,

        opBridgedUsdcAdapter: fromToken?.opBridgedUsdc?.adapter,
        lzAdapter: fromToken?.lz?.adapter,
      });
    },
    enabled:
      !!weiAmount &&
      !!from &&
      !!to &&
      !!fromTokenAddress &&
      !!toTokenAddress &&
      (recipientAddress ? isAddress(recipientAddress) : true),
  });

  return {
    isLoading: routes.isFetching,
    data: routes.data?.data ?? null,
    refetch: routes.refetch,
  };
};
