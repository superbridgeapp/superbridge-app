import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  isAddress,
} from "viem";
import { useEstimateFeesPerGas } from "wagmi";

import { ERC20InboxAbi } from "@/abis/arbitrum/ERC20Inbox";
import { InboxAbi } from "@/abis/arbitrum/Inbox";
import { L1GatewayRouterAbi } from "@/abis/arbitrum/L1GatewayRouter";
import { useGasToken } from "@/hooks/use-approve-gas-token";
import { useDeployment } from "@/hooks/use-deployment";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";
import { isArbitrumToken } from "@/utils/guards";
import { isEth } from "@/utils/is-eth";
import { isArbitrum } from "@/utils/is-mainnet";

export const useArbitrumGasCostsInWei = () => {
  const deployment = useDeployment();
  const l1FeeData = useEstimateFeesPerGas({
    chainId: deployment?.l1.id,
    query: {
      enabled: !!deployment && isArbitrum(deployment),
    },
  });
  const l2FeeData = useEstimateFeesPerGas({
    chainId: deployment?.l2.id,
    query: {
      enabled: !!deployment && isArbitrum(deployment),
    },
  });

  const l1GasLimit = BigInt(80_000);
  const l2GasLimit = BigInt(300_000);
  const l1GasCost =
    (l1FeeData.data?.maxFeePerGas ?? BigInt(0)) +
    (l1FeeData.data?.maxFeePerGas ?? BigInt(0)) / BigInt(10);
  const l2GasCost =
    (l2FeeData.data?.maxFeePerGas ?? BigInt(0)) +
    (l2FeeData.data?.maxFeePerGas ?? BigInt(0)) / BigInt(10);
  const maxSubmissionCost = l1GasCost * l1GasLimit;

  return {
    l1GasLimit,
    l2GasLimit,
    l1GasCost,
    l2GasCost,

    maxSubmissionCost,
    extraAmount: l2GasCost * l2GasLimit + maxSubmissionCost,
  };
};

export const useArbitrumDepositArgs = () => {
  const deployment = useDeployment();
  const stateToken = useConfigState.useToken();
  const gasToken = useGasToken();
  const recipient = useConfigState.useRecipientAddress();
  const weiAmount = useWeiAmount();

  const costs = useArbitrumGasCostsInWei();

  const l1Token = stateToken?.[deployment?.l1.id ?? 0];
  const l2Token = stateToken?.[deployment?.l2.id ?? 0];

  if (
    !deployment ||
    !l1Token ||
    !l2Token ||
    !isArbitrumToken(l1Token) ||
    !isArbitrumToken(l2Token) ||
    !isArbitrum(deployment) ||
    !recipient ||
    !isAddress(recipient) ||
    !costs
  ) {
    return;
  }

  const { l2GasCost, l2GasLimit, maxSubmissionCost, extraAmount } = costs;

  if (isEth(l2Token)) {
    const value = weiAmount + extraAmount;
    if (gasToken) {
      return {
        approvalAddress: deployment.contractAddresses.inbox as Address,
        tx: {
          to: deployment.contractAddresses.inbox as Address,
          data: encodeFunctionData({
            abi: ERC20InboxAbi,
            functionName: "createRetryableTicket",
            args: [
              recipient, // to
              weiAmount, // l2CallValue
              maxSubmissionCost, // maxSubmissionCost
              recipient, // excessFeeRefundAddress
              recipient, // callValueRefundAddress
              l2GasLimit, // gasLimit
              l2GasCost, // maxFeePerGas
              value,
              "0x", // data
            ],
          }),
          value: BigInt(0),
          chainId: deployment.l1.id,
        },
      };
    }

    return {
      approvalAddress: undefined,
      tx: {
        to: deployment.contractAddresses.inbox as Address,
        data: encodeFunctionData({
          abi: InboxAbi,
          functionName: "createRetryableTicket",
          args: [
            recipient, // to
            weiAmount, // l2CallValue
            maxSubmissionCost, // maxSubmissionCost
            recipient, // excessFeeRefundAddress
            recipient, // callValueRefundAddress
            l2GasLimit, // gasLimit
            l2GasCost, // maxFeePerGas
            "0x", // data
          ],
        }),
        value,
        chainId: deployment.l1.id,
      },
    };
  }

  const value = gasToken ? BigInt(0) : extraAmount;
  const extraData = gasToken
    ? encodeAbiParameters(
        [{ type: "uint256" }, { type: "bytes" }, { type: "uint256" }],
        [maxSubmissionCost, "0x", extraAmount]
      )
    : encodeAbiParameters(
        [{ type: "uint256" }, { type: "bytes" }],
        [maxSubmissionCost, "0x"]
      );
  return {
    approvalAddress: l1Token.arbitrumBridgeInfo[l2Token.chainId] as Address,
    tx: {
      to: deployment.contractAddresses.l1GatewayRouter as Address,
      data: encodeFunctionData({
        abi: L1GatewayRouterAbi,
        functionName: "outboundTransferCustomRefund",
        args: [
          l1Token.address, // _l1Token
          recipient, // refundTo
          recipient, // to
          weiAmount, // amount
          l2GasLimit, // _maxGas
          l2GasCost, // _gasPriceBid
          extraData, // extraData
        ],
      }),
      value,
      chainId: deployment.l1.id,
    },
  };
};
