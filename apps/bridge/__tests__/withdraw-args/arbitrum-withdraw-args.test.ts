import { encodeFunctionData } from "viem";
import { describe, expect, test } from "vitest";

import { ArbSysAbi } from "@/abis/arbitrum/ArbSys";
import { L2BridgeArbitrumAbi } from "@/abis/arbitrum/L2Bridge";
import { L2GatewayRouterAbi } from "@/abis/arbitrum/L2GatewayRouter";
import {
  ARB_SYS,
  arbitrumWithdrawArgs,
} from "@/hooks/transaction-args/withdraw-args/arbitrum-withdraw-args";

import {
  chainIds,
  deployments,
  getAddress,
  mainnetDeployment,
  mainnetEther,
  mainnetUsdc,
} from "../constants";

const recipient = getAddress();
const proxyBridge = getAddress();

const common = {
  deployment: deployments.mainnetArbitrum,
  recipient,
  weiAmount: BigInt("10"),
};

describe("arbitrum withdraw args", () => {
  test("force doesn't work with arbitrum", () => {
    expect(
      arbitrumWithdrawArgs({
        ...common,
        stateToken: mainnetEther,
        options: { forceViaL1: true, easyMode: false },
      })
    ).toStrictEqual(undefined);
  });

  test("eth to arb sys", () => {
    expect(
      arbitrumWithdrawArgs({
        ...common,
        stateToken: mainnetEther,
        options: { forceViaL1: false, easyMode: false },
      })?.tx
    ).toStrictEqual({
      to: ARB_SYS,
      data: encodeFunctionData({
        abi: ArbSysAbi,
        args: [recipient],
        functionName: "withdrawEth",
      }),
      value: BigInt("10"),
      chainId: mainnetDeployment.l2.id,
    });
  });

  test("token to router", () => {
    expect(
      arbitrumWithdrawArgs({
        ...common,
        stateToken: mainnetUsdc,
        options: { forceViaL1: false, easyMode: false },
      })
    ).toStrictEqual({
      approvalAddress:
        mainnetUsdc[chainIds.mainnetL2].arbitrumBridgeInfo[chainIds.mainnetL1],
      tx: {
        to: deployments.mainnetArbitrum.contractAddresses.l2GatewayRouter,
        data: encodeFunctionData({
          abi: L2GatewayRouterAbi,
          args: [
            mainnetUsdc[chainIds.mainnetL1].address,
            recipient,
            BigInt("10"),
            "0x",
          ],
          functionName: "outboundTransfer",
        }),
        value: BigInt("0"),
        chainId: mainnetDeployment.l2.id,
      },
    });
  });

  test("eth to proxy", () => {
    expect(
      arbitrumWithdrawArgs({
        ...common,
        proxyBridge,
        stateToken: mainnetEther,
        options: { forceViaL1: false, easyMode: false },
      })?.tx
    ).toStrictEqual({
      to: proxyBridge,
      data: encodeFunctionData({
        abi: L2BridgeArbitrumAbi,
        args: [recipient, common.weiAmount],
        functionName: "initiateEtherWithdrawal",
      }),
      value: common.weiAmount,
      chainId: common.deployment.l2.id,
    });
  });

  test("token to proxy", () => {
    expect(
      arbitrumWithdrawArgs({
        ...common,
        proxyBridge,
        stateToken: mainnetUsdc,
        options: { forceViaL1: false, easyMode: false },
      })
    ).toStrictEqual({
      approvalAddress: proxyBridge,
      tx: {
        to: proxyBridge,
        data: encodeFunctionData({
          abi: L2BridgeArbitrumAbi,
          args: [
            common.deployment.contractAddresses.l2GatewayRouter,
            mainnetUsdc[common.deployment.l2.id].arbitrumBridgeInfo[
              common.deployment.l1.id
            ],
            mainnetUsdc[common.deployment.l1.id].address,
            mainnetUsdc[common.deployment.l2.id].address,
            recipient,
            BigInt("10"),
          ],
          functionName: "initiateERC20Withdrawal",
        }),
        value: BigInt("0"),
        chainId: mainnetDeployment.l2.id,
      },
    });
  });
});
