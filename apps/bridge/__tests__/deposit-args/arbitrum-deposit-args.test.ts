import { Address, encodeAbiParameters, encodeFunctionData } from "viem";
import { describe, expect, test } from "vitest";
import { FetchFeeDataResult } from "@wagmi/core";

import { InboxAbi } from "@/abis/arbitrum/Inbox";
import { L1BridgeArbitrum } from "@/abis/arbitrum/L1Bridge";
import { L1GatewayRouterAbi } from "@/abis/arbitrum/L1GatewayRouter";
import { arbitrumDepositArgs } from "@/hooks/transaction-args/deposit-args/arbitrum-deposit-args";

import {
  chainIds,
  deployments,
  feeData,
  getAddress,
  mainnetDeployment,
  mainnetEther,
  mainnetUsdc,
} from "../constants";

const recipient = getAddress();
const proxyBridge = getAddress();

const increase = (x: bigint, pct: number) => {
  return x + x / BigInt(pct);
};

const l2FeeData = feeData;
const l1FeeData: FetchFeeDataResult = {
  formatted: l2FeeData.formatted,
  gasPrice: increase(l2FeeData.gasPrice!, 10),
  lastBaseFeePerGas: increase(l2FeeData.lastBaseFeePerGas!, 10),
  maxFeePerGas: increase(l2FeeData.maxFeePerGas!, 10),
  maxPriorityFeePerGas: increase(l2FeeData.maxPriorityFeePerGas!, 10),
};

const l1GasCost = increase(l1FeeData.lastBaseFeePerGas!, 10);
const l2GasCost = increase(l2FeeData.lastBaseFeePerGas!, 10);

const l1GasLimit = BigInt(80_000);
const l2GasLimit = BigInt(300_000);

const maxSubmissionCost = l1GasCost * l1GasLimit;

const common = {
  deployment: deployments.mainnetArbitrum,
  recipient,
  weiAmount: BigInt("10"),
  l1FeeData,
  l2FeeData,
};

describe("arbitrum deposit args", () => {
  test("needs fee data", () => {
    expect(
      arbitrumDepositArgs({
        ...common,
        stateToken: mainnetEther,
        proxyBridge,
        l1FeeData: undefined,
        l2FeeData: undefined,
      })
    ).toStrictEqual(undefined);
  });

  test("ETH to proxy", () => {
    expect(
      arbitrumDepositArgs({
        ...common,
        stateToken: mainnetEther,
        proxyBridge,
      })?.tx
    ).toStrictEqual({
      to: proxyBridge,
      data: encodeFunctionData({
        abi: L1BridgeArbitrum,
        args: [
          deployments.mainnetArbitrum.contractAddresses.inbox as Address, // inbox
          recipient, // to
          maxSubmissionCost, // maxSubmissionCost
          l2GasLimit, // maxFeePerGas
          l2GasCost, // maxFeePerGas
        ],
        functionName: "initiateEtherDeposit",
      }),
      value: BigInt("10") + l2GasCost * l2GasLimit + maxSubmissionCost,
      chainId: deployments.mainnetArbitrum.l1.id,
    });
  });

  test("ETH to inbox", () => {
    expect(
      arbitrumDepositArgs({
        ...common,
        stateToken: mainnetEther,
      })?.tx
    ).toStrictEqual({
      to: deployments.mainnetArbitrum.contractAddresses.inbox,
      data: encodeFunctionData({
        abi: InboxAbi,
        args: [
          recipient, // to
          BigInt("10"), // l2CallValue
          maxSubmissionCost, // maxSubmissionCost
          recipient, // excessFeeRefundAddress
          recipient, // callValueRefundAddress
          l2GasLimit, // gasLimit
          l2GasCost, // maxFeePerGas
          "0x", // data
        ],
        functionName: "createRetryableTicket",
      }),
      value: BigInt("10") + l2GasCost * l2GasLimit + maxSubmissionCost,
      chainId: mainnetDeployment.l1.id,
    });
  });

  test(`token to router`, () => {
    expect(
      arbitrumDepositArgs({
        ...common,
        stateToken: mainnetUsdc,
      })?.tx
    ).toStrictEqual({
      to: deployments.mainnetArbitrum.contractAddresses.l1GatewayRouter,
      data: encodeFunctionData({
        abi: L1GatewayRouterAbi,
        functionName: "outboundTransferCustomRefund",
        args: [
          mainnetUsdc[chainIds.mainnetL1].address,
          recipient,
          recipient,
          BigInt("10"),
          l2GasLimit,
          l2GasCost,
          encodeAbiParameters(
            [{ type: "uint256" }, { type: "bytes" }],
            [maxSubmissionCost, "0x"]
          ), //
        ],
      }),
      value: l2GasCost * l2GasLimit + maxSubmissionCost,
      chainId: chainIds.mainnetL1,
    });
  });

  test(`token to proxy`, () => {
    expect(
      arbitrumDepositArgs({
        ...common,
        proxyBridge,
        stateToken: mainnetUsdc,
        weiAmount: BigInt("10"),
      })
    ).toStrictEqual({
      approvalAddress: proxyBridge,
      tx: {
        to: proxyBridge,
        data: encodeFunctionData({
          abi: L1BridgeArbitrum,
          functionName: "initiateERC20Deposit",
          args: [
            common.deployment.contractAddresses.l1GatewayRouter,
            mainnetUsdc[common.deployment.l1.id].arbitrumBridgeInfo[
              common.deployment.l2.id
            ],
            mainnetUsdc[common.deployment.l1.id].address,
            mainnetUsdc[common.deployment.l2.id].address,
            recipient,
            BigInt("10"),
            maxSubmissionCost,
            l2GasLimit,
            l2GasCost,
          ],
        }),
        value: l2GasCost * l2GasLimit + maxSubmissionCost,
        chainId: chainIds.mainnetL1,
      },
    });
  });
});
