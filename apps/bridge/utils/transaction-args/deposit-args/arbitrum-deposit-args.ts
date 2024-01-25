import { FetchFeeDataResult } from "@wagmi/core";
import { Address, encodeAbiParameters, encodeFunctionData } from "viem";

import { InboxAbi } from "@/abis/arbitrum/Inbox";
import { L1BridgeArbitrum } from "@/abis/arbitrum/L1Bridge";
import { L1GatewayRouterAbi } from "@/abis/arbitrum/L1GatewayRouter";
import { ArbitrumToken } from "@/types/token";

import { isArbitrumToken } from "../../guards";
import { isEth } from "../../is-eth";
import { ArbitrumDeploymentDto, isArbitrum, isMainnet } from "../../is-mainnet";
import { TransactionArgs } from "../withdraw-args/types";
import { DepositTxResolver } from "./types";

const impl = (
  deployment: ArbitrumDeploymentDto,
  l1Token: ArbitrumToken,
  l2Token: ArbitrumToken,
  proxyBridge: Address | undefined,
  recipient: Address,
  weiAmount: bigint,
  l1FeeData: FetchFeeDataResult,
  l2FeeData: FetchFeeDataResult
): TransactionArgs | undefined => {
  const l1GasLimit = BigInt(80_000);
  const l2GasLimit = BigInt(300_000);
  const l1GasCost =
    l1FeeData.lastBaseFeePerGas! + l1FeeData.lastBaseFeePerGas! / BigInt(10);
  const l2GasCost =
    l2FeeData.lastBaseFeePerGas! + l2FeeData.lastBaseFeePerGas! / BigInt(10);
  const maxSubmissionCost = l1GasCost * l1GasLimit;

  if (isEth(l2Token)) {
    const value = weiAmount + l2GasCost * l2GasLimit + maxSubmissionCost;

    if (isMainnet(deployment) && proxyBridge) {
      return {
        approvalAddress: undefined,
        tx: {
          to: proxyBridge,
          data: encodeFunctionData({
            abi: L1BridgeArbitrum,
            functionName: "initiateEtherDeposit",
            args: [
              deployment.contractAddresses.inbox as Address,
              recipient, // _to
              maxSubmissionCost,
              l2GasLimit,
              l2GasCost,
            ],
          }),
          value,
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

  if (isMainnet(deployment) && proxyBridge) {
    return {
      approvalAddress: proxyBridge,
      tx: {
        to: proxyBridge,
        data: encodeFunctionData({
          abi: L1BridgeArbitrum,
          functionName: "initiateERC20Deposit",
          args: [
            deployment.contractAddresses.l1GatewayRouter as Address, // _l1Gateway
            l1Token.arbitrumBridgeInfo[l2Token.chainId] as Address, // _bridge
            l1Token.address, // _l1Token
            l2Token.address, // _l2Token
            recipient, // _to
            weiAmount, // _amount
            maxSubmissionCost, // _maxSubmissionCost
            l2GasLimit, // _maxGas
            l2GasCost, // _gasPriceBid
          ],
        }),
        value: l2GasCost * l2GasLimit + maxSubmissionCost,
        chainId: deployment.l1.id,
      },
    };
  }

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
          encodeAbiParameters(
            [{ type: "uint256" }, { type: "bytes" }],
            [maxSubmissionCost, "0x"]
          ), // extraData
        ],
      }),
      value: l2GasCost * l2GasLimit + maxSubmissionCost,
      chainId: deployment.l1.id,
    },
  };
};

export const arbitrumDepositArgs: DepositTxResolver = ({
  deployment,
  stateToken,
  proxyBridge,
  recipient,
  weiAmount,
  l1FeeData,
  l2FeeData,
}) => {
  const l1Token = stateToken[deployment.l1.id];
  const l2Token = stateToken[deployment.l2.id];

  if (
    !isArbitrum(deployment) ||
    !l1Token ||
    !l2Token ||
    !isArbitrumToken(l1Token) ||
    !isArbitrumToken(l2Token) ||
    !l1FeeData ||
    !l2FeeData
  ) {
    return;
  }

  return impl(
    deployment,
    l1Token,
    l2Token,
    proxyBridge,
    recipient,
    weiAmount,
    l1FeeData,
    l2FeeData
  );
};
