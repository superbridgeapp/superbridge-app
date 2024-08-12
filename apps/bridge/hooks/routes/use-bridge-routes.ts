import { useDebounce } from "use-debounce";
import { isAddress, zeroAddress } from "viem";
import { useAccount } from "wagmi";

import { useConfigState } from "@/state/config";
import { deadAddress } from "@/utils/tokens/is-eth";

import { useBridgeControllerGetRoutes } from "../../codegen";
import { useDestinationToken, useSelectedToken } from "../tokens/use-token";
import { useFromChain, useToChain } from "../use-chain";
import { useGraffiti } from "../use-graffiti";
import { useWeiAmount } from "../use-wei-amount";

export const useBridgeRoutes = () => {
  const from = useFromChain();
  const to = useToChain();
  const account = useAccount();

  const fromToken = useSelectedToken();
  const toToken = useDestinationToken();
  const recipientAddress = useConfigState.useRecipientAddress();
  const forceViaL1 = useConfigState.useForceViaL1();

  const fromTokenAddress = fromToken?.address;
  const toTokenAddress = toToken?.address;

  const [weiAmount] = useDebounce(useWeiAmount(), 300);

  const routes = useBridgeControllerGetRoutes(
    {
      amount: weiAmount.toString(),
      fromChainId: from?.id.toString() ?? "",
      toChainId: to?.id.toString() ?? "",
      fromTokenAddress: fromTokenAddress ?? "",
      toTokenAddress: toTokenAddress ?? "",
      graffiti: useGraffiti(),
      recipient: recipientAddress || deadAddress,
      sender: account.address ?? deadAddress,

      forceViaL1,

      hyperlaneFromTokenRouterAddress: fromToken?.hyperlane?.router,
      hyperlaneToTokenRouterAddress: toToken?.hyperlane?.router,
    },
    {
      query: {
        // queryKey: [""],
        enabled:
          !!weiAmount &&
          !!from &&
          !!to &&
          !!fromTokenAddress &&
          !!toTokenAddress &&
          (recipientAddress ? isAddress(recipientAddress) : true),
      },
    }
  );

  return {
    isLoading: routes.isFetching,
    data: routes.data?.data ?? null,
  };
};
