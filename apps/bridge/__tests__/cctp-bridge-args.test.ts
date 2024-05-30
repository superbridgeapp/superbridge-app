import { Address, encodeFunctionData } from "viem";
import { describe, expect, test } from "vitest";

import { L1BridgeAbi } from "@/abis/L1Bridge";
import { L1StandardBridgeAbi } from "@/abis/L1StandardBridge";
import { GRAFFITI } from "@/constants/extra-data";
import { depositArgs } from "@/hooks/transaction-args/deposit-args";

import {
  chainIds,
  deployments,
  getAddress,
  mainnetDeployment,
  mainnetEther,
  mainnetUsdc,
} from "./constants";

const DEFAULT_GAS_LIMIT = 200_000;

const recipient = getAddress();
const PROXY_BRIDGE = getAddress();

const common = {
  deployment: deployments.mainnetOptimism,
  recipient,
  weiAmount: BigInt("10"),
};

describe("cctp bridge args", () => {
  test("eth to proxy", () => {
    expect(
      depositArgs({
        ...common,
        stateToken: mainnetEther,
        proxyBridge: PROXY_BRIDGE,
      })?.tx
    ).toStrictEqual({
      to: PROXY_BRIDGE,
      data: encodeFunctionData({
        abi: L1BridgeAbi,
        args: [
          deployments.mainnetOptimism.contractAddresses
            .l1StandardBridge as Address,
          recipient,
        ],
        functionName: "initiateEtherDeposit",
      }),
      value: BigInt("10"),
      chainId: mainnetDeployment.l1.id,
    });
  });

  test("eth to standard bridge", () => {
    expect(
      depositArgs({
        ...common,
        stateToken: mainnetEther,
        recipient,
        weiAmount: BigInt("10"),
      })?.tx
    ).toStrictEqual({
      to: common.deployment.contractAddresses.l1StandardBridge,
      data: encodeFunctionData({
        abi: L1StandardBridgeAbi,
        args: [recipient, DEFAULT_GAS_LIMIT, GRAFFITI],
        functionName: "bridgeETHTo",
      }),
      value: BigInt("10"),
      chainId: common.deployment.l1.id,
    });
  });

  test(`mainnet token to proxy`, () => {
    expect(
      depositArgs({
        ...common,
        stateToken: mainnetUsdc,
        proxyBridge: PROXY_BRIDGE,
      })?.tx
    ).toStrictEqual({
      to: PROXY_BRIDGE,
      data: encodeFunctionData({
        abi: L1BridgeAbi,
        functionName: "initiateERC20Deposit",
        args: [
          mainnetUsdc[common.deployment.l1.id]!.standardBridgeAddresses[
            common.deployment.l2.id
          ]!,
          mainnetUsdc[common.deployment.l1.id].address,
          mainnetUsdc[common.deployment.l2.id].address,
          recipient,
          BigInt("10"),
          true,
        ],
      }),
      value: BigInt("0"),
      chainId: common.deployment.l1.id,
    });
  });

  test(`token to standard bridge`, () => {
    expect(
      depositArgs({
        ...common,
        stateToken: mainnetUsdc,
      })?.tx
    ).toStrictEqual({
      to: mainnetUsdc[common.deployment.l1.id].standardBridgeAddresses[
        common.deployment.l2.id
      ],
      data: encodeFunctionData({
        abi: L1StandardBridgeAbi,
        functionName: "depositERC20To",
        args: [
          mainnetUsdc[common.deployment.l1.id].address,
          mainnetUsdc[common.deployment.l2.id].address,
          recipient,
          BigInt("10"),
          DEFAULT_GAS_LIMIT,
          GRAFFITI,
        ],
      }),
      value: BigInt("0"),
      chainId: common.deployment.l1.id,
    });
  });
});
