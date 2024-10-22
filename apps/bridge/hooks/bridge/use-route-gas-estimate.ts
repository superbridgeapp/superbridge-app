import { useQuery } from "@tanstack/react-query";
import { isPresent } from "ts-is-present";
import { useAccount } from "wagmi";

import { bridgeControllerGetGasEstimate } from "@/codegen/index";
import { RouteResultDto } from "@/codegen/model";
import { isRouteQuote } from "@/utils/guards";
import { deadAddress } from "@/utils/tokens/is-eth";

import { useApproveGasTokenTx } from "../approvals/use-approve-gas-token-tx";
import { useApproveTx } from "../approvals/use-approve-tx";
import { useEstimateFeesPerGas } from "../gas/use-estimate-fees-per-gas";
import { useFromChain } from "../use-chain";
import { useHost } from "../use-metadata";

const useTenderlyGasPrice = () => {
  const gasPrice = useEstimateFeesPerGas(useFromChain()?.id);

  if (gasPrice.data?.gasPrice) {
    return { gasPrice: gasPrice.data.gasPrice.toString() };
  }

  if (gasPrice.data?.maxFeePerGas) {
    return { gasPrice: gasPrice.data.maxFeePerGas.toString() };
  }

  return {};
};

export const useRouteGasEstimate = (route: RouteResultDto | null) => {
  const host = useHost();
  const gasTokenApprovalTx = useApproveGasTokenTx(route);
  const approvalTx = useApproveTx(route);

  const initiatingTransaction =
    route?.result && isRouteQuote(route.result)
      ? route.result.initiatingTransaction
      : null;

  const gasPrice = useTenderlyGasPrice();

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
      gasPrice.gasPrice,
    ],
    queryFn: async () => {
      if (!initiatingTransaction) return null;

      const result = await bridgeControllerGetGasEstimate({
        from: account.address ?? deadAddress,
        domain: host,
        transactions: [
          gasTokenApprovalTx
            ? {
                ...gasTokenApprovalTx,
                gasPrice: gasPrice.gasPrice,
              }
            : null,
          approvalTx
            ? {
                ...approvalTx,
                gasPrice: gasPrice.gasPrice,
              }
            : null,
          {
            ...initiatingTransaction,
            chainId: parseInt(initiatingTransaction.chainId),
            gasPrice: gasPrice.gasPrice,
          },
        ].filter(isPresent),
      });

      return result.data;
    },
    enabled: !!initiatingTransaction,
  });

  return a;
};
