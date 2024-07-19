import { isAddress } from "viem";
import { useAccount } from "wagmi";

import { useConfigState } from "@/state/config";

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

  const fromTokenAddress = stateToken?.[from?.id ?? 0]?.address;
  const toTokenAddress = stateToken?.[to?.id ?? 0]?.address;

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

  console.log(routes);
  return routes.data?.data;
};
