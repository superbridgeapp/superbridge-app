import { useQuery } from "@tanstack/react-query";
import { isPresent } from "ts-is-present";
import { useAccount } from "wagmi";

import { bridgeControllerGetGasEstimate } from "@/codegen/index";
import { RouteResultDto } from "@/codegen/model";
import { isRouteQuote } from "@/utils/guards";
import { deadAddress } from "@/utils/tokens/is-eth";

import { useApproveGasTokenTx } from "../approvals/use-approve-gas-token-tx";
import { useApproveTx } from "../approvals/use-approve-tx";

export const useRouteGasEstimate = (route: RouteResultDto | null) => {
  const gasTokenApprovalTx = useApproveGasTokenTx(route);
  const approvalTx = useApproveTx(route);

  const initiatingTransaction =
    route?.result && isRouteQuote(route.result)
      ? route.result.initiatingTransaction
      : null;

  const account = useAccount();

  const a = useQuery({
    queryKey: [
      gasTokenApprovalTx?.chainId,
      gasTokenApprovalTx?.to,
      gasTokenApprovalTx?.data,
      gasTokenApprovalTx?.value,
      approvalTx?.chainId,
      approvalTx?.to,
      approvalTx?.data,
      approvalTx?.value,
      initiatingTransaction?.chainId,
      initiatingTransaction?.to,
      initiatingTransaction?.data,
      initiatingTransaction?.value,
    ],
    queryFn: async () => {
      if (!initiatingTransaction || !account.address) return null;

      const result = await bridgeControllerGetGasEstimate({
        from: account.address ?? deadAddress,
        transactions: [
          gasTokenApprovalTx,
          approvalTx,
          {
            ...initiatingTransaction,
            chainId: parseInt(initiatingTransaction.chainId),
          },
        ].filter(isPresent),
      });

      return result.data;
    },
  });

  return a;

  // const estimate = useEstimateGas({
  //   data: initiatingTransaction?.data as Address,
  //   to: initiatingTransaction?.to as Address,
  //   chainId: parseInt(initiatingTransaction?.chainId ?? "0"),
  //   value: BigInt(initiatingTransaction?.value ?? "0"),
  //   query: {
  //     enabled: !!initiatingTransaction && !initiatingTransaction.gas,
  //   },
  // });

  // console.log(">>>", initiatingTransaction?.gas, estimate.data);

  // if (initiatingTransaction?.gas) {
  //   return BigInt(initiatingTransaction.gas);
  // }

  // return estimate.data
  //   ? estimate.data + estimate.data / BigInt("50")
  //   : undefined;
};
