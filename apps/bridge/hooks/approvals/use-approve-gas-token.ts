import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { useConfig, useWalletClient } from "wagmi";

import { useCustomGasTokenAddress } from "../custom-gas-token/use-custom-gas-token-address";
import { useDeployment } from "../deployments/use-deployment";
import { useEstimateFeesPerGas } from "../gas/use-estimate-fees-per-gas";
import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";
import { useTokenBalances } from "../use-balances";
import { useFromChain } from "../use-chain";
import { useRequiredCustomGasTokenBalance } from "../use-required-custom-gas-token-balance";
import { useAllowanceGasToken } from "./use-allowance-gas-token";
import { useApprovalAddressGasToken } from "./use-approval-address-gas-token";
import { useApproveGasTokenGasEstimate } from "./use-approve-gas-token-gas-estimate";
import { useApproveGasTokenTx } from "./use-approve-gas-token-tx";

export function useApproveGasToken() {
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const deployment = useDeployment();
  const gasTokenAddress = useCustomGasTokenAddress(deployment?.id);
  const from = useFromChain();
  const balances = useTokenBalances();
  const allowance = useAllowanceGasToken();
  const wallet = useWalletClient();
  const fees = useEstimateFeesPerGas(from?.id);
  const gasTokenApprovalAmount = useRequiredCustomGasTokenBalance();
  const route = useSelectedBridgeRoute();
  const tx = useApproveGasTokenTx(route.data);
  const approvalAddress = useApprovalAddressGasToken();
  const estimate = useApproveGasTokenGasEstimate();

  return {
    write: async () => {
      if (
        !gasTokenAddress ||
        !approvalAddress ||
        !gasTokenApprovalAmount ||
        !wallet.data ||
        !tx ||
        !estimate
      )
        return;
      setIsLoading(true);

      try {
        const hash = await wallet.data.sendTransaction({
          ...tx,
          value: BigInt(tx.value ?? "0"),
          gas: BigInt(estimate),
          ...(fees.data?.gasPrice
            ? {
                gasPrice: fees.data?.gasPrice,
              }
            : {
                maxFeePerGas: fees.data?.maxFeePerGas,
                maxPriorityFeePerGas: fees.data?.maxPriorityFeePerGas,
              }),
        });
        await waitForTransactionReceipt(config, {
          hash,
          chainId: from?.id,
          pollingInterval: 2_000,
          timeout: 60_000,
        });
        setTimeout(() => {
          allowance.refetch();
          balances.refetch();
        }, 200);
      } catch {
      } finally {
        setIsLoading(false);
      }
    },
    isLoading,
  };
}
