import { isAddress } from "viem";
import { useAccount } from "wagmi";

import { useConfigState } from "@/state/config";

import { useBridgeControllerGetRoutes } from "../codegen";
import { useFromChain, useToChain } from "./use-chain";
import { useGraffiti } from "./use-graffiti";
import { useWeiAmount } from "./use-wei-amount";

export const useBridgeV2 = () => {
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

  console.log(routes.data?.data);
  // const withdrawing = useConfigState.useWithdrawing();
  // const escapeHatch = useConfigState.useForceViaL1();

  // const bridgeArgs = useTransactionArgs();
  // const { sendTransactionAsync, isLoading } = useSendTransaction();
  // const deployment = useDeployment();

  // const chainId = withdrawing && escapeHatch ? deployment?.l1.id : from?.id;

  // const fromFeeData = useEstimateFeesPerGas({ chainId });
  // let { data: gas, refetch } = useEstimateGas({
  //   ...bridgeArgs?.tx,
  //   gasPrice: fromFeeData.data?.gasPrice,
  //   maxFeePerGas: fromFeeData.data?.maxFeePerGas,
  //   maxPriorityFeePerGas: fromFeeData.data?.maxPriorityFeePerGas,
  // });

  // if (gas) {
  //   gas = gas + gas / BigInt("10");
  // }

  // return {
  //   write: !bridgeArgs?.tx
  //     ? undefined
  //     : () =>
  //         sendTransactionAsync({
  //           ...bridgeArgs.tx,
  //           gas,
  //           gasPrice: fromFeeData.data?.gasPrice,
  //           maxFeePerGas: fromFeeData.data?.maxFeePerGas,
  //           maxPriorityFeePerGas: fromFeeData.data?.maxPriorityFeePerGas,
  //         }),
  //   isLoading,
  //   address: bridgeArgs?.approvalAddress,
  //   refetch,
  //   valid: !!bridgeArgs,
  //   args: bridgeArgs,
  //   gas,
  // };
};
