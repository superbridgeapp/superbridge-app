import { Address, encodeFunctionData } from "viem";
import { describe, expect, test } from "vitest";

import { GRAFFITI } from "@/constants/extra-data";

import { L2BridgeAbi } from "@/abis/L2Bridge";
import { L2StandardBridgeAbi } from "@/abis/L2StandardBridge";
import { OptimismPortalAbi } from "@/abis/OptimismPortal";
import { withdrawArgs } from "@/hooks/transaction-args/withdraw-args";

import {
  chainIds,
  deployments,
  getAddress,
  mainnetEther,
  mainnetUsdc,
  testnetEther,
  testnetUsdc,
} from "../constants";

const DEFAULT_GAS_LIMIT = 200_000;
const DEFAULT_GAS_LIMIT_BIGINT = BigInt(DEFAULT_GAS_LIMIT.toString());

const recipient = getAddress();
const PROXY_BRIDGE = getAddress();

describe("optimism withdraw args", () => {
  describe("mainnet eth", () => {
    test("should be to proxy", () => {
      expect(
        withdrawArgs({
          deployment: deployments.mainnetOptimism,
          stateToken: mainnetEther,
          proxyBridge: PROXY_BRIDGE,
          l2TokenIsLegacy: false,
          recipient,
          weiAmount: BigInt("10"),
          options: { forceViaL1: false, easyMode: false },
        })?.tx
      ).toStrictEqual({
        to: PROXY_BRIDGE,
        data: encodeFunctionData({
          abi: L2BridgeAbi,
          args: [
            deployments.mainnetOptimism.contractAddresses.l2
              .L2StandardBridge as Address,
            recipient,
            BigInt("10"),
          ],
          functionName: "initiateEtherWithdrawal",
        }),
        value: BigInt("10"),
        chainId: deployments.mainnetOptimism.l2.id,
      });
    });

    test("easy mode", () => {
      expect(
        withdrawArgs({
          deployment: deployments.mainnetOptimism,
          stateToken: mainnetEther,
          proxyBridge: PROXY_BRIDGE,
          l2TokenIsLegacy: false,
          recipient,
          weiAmount: BigInt("10"),
          options: { forceViaL1: false, easyMode: true },
        })?.tx
      ).toStrictEqual({
        to: PROXY_BRIDGE,
        data: encodeFunctionData({
          abi: L2BridgeAbi,
          args: [
            deployments.mainnetOptimism.contractAddresses.l2
              .L2StandardBridge as Address,
            recipient,
            BigInt("10"),
          ],
          functionName: "initiateEtherWithdrawal",
        }),
        value: BigInt("40000000000000010"),
        chainId: deployments.mainnetOptimism.l2.id,
      });
    });

    test("force", () => {
      expect(
        withdrawArgs({
          deployment: deployments.mainnetOptimism,
          stateToken: mainnetEther,
          proxyBridge: PROXY_BRIDGE,
          l2TokenIsLegacy: false,
          recipient,
          weiAmount: BigInt("10"),
          options: { forceViaL1: true, easyMode: false },
        })?.tx
      ).toStrictEqual({
        to: deployments.mainnetOptimism.contractAddresses.optimismPortal,
        data: encodeFunctionData({
          abi: OptimismPortalAbi,
          functionName: "depositTransaction",
          args: [
            PROXY_BRIDGE,
            BigInt("10"),
            DEFAULT_GAS_LIMIT_BIGINT,
            false,
            encodeFunctionData({
              abi: L2BridgeAbi,
              functionName: "initiateEtherWithdrawal",
              args: [
                deployments.mainnetOptimism.contractAddresses.l2
                  .L2StandardBridge as Address,
                recipient,
                BigInt("10"),
              ],
            }),
          ],
        }),
        value: BigInt("0"),
        chainId: deployments.mainnetOptimism.l1.id,
        gas: BigInt("300000"),
      });
    });

    test("easy mode + force", () => {
      expect(
        withdrawArgs({
          deployment: deployments.mainnetOptimism,
          stateToken: mainnetEther,
          proxyBridge: PROXY_BRIDGE,
          l2TokenIsLegacy: false,
          recipient,
          weiAmount: BigInt("10"),
          options: { forceViaL1: true, easyMode: true },
        })?.tx
      ).toStrictEqual({
        to: deployments.mainnetOptimism.contractAddresses.optimismPortal,
        data: encodeFunctionData({
          abi: OptimismPortalAbi,
          functionName: "depositTransaction",
          args: [
            PROXY_BRIDGE,
            BigInt("40000000000000010"),
            DEFAULT_GAS_LIMIT_BIGINT,
            false,
            encodeFunctionData({
              abi: L2BridgeAbi,
              functionName: "initiateEtherWithdrawal",
              args: [
                deployments.mainnetOptimism.contractAddresses.l2
                  .L2StandardBridge as Address,
                recipient,
                BigInt("10"),
              ],
            }),
          ],
        }),
        value: BigInt("0"),
        chainId: deployments.mainnetOptimism.l1.id,
        gas: BigInt("300000"),
      });
    });
  });

  describe("testnet eth", () => {
    test("should be to standard bridge", () => {
      expect(
        withdrawArgs({
          deployment: deployments.testnetOptimism,
          stateToken: testnetEther,
          proxyBridge: PROXY_BRIDGE,
          l2TokenIsLegacy: false,
          recipient,
          weiAmount: BigInt("10"),
          options: { forceViaL1: false, easyMode: false },
        })?.tx
      ).toStrictEqual({
        to: deployments.testnetOptimism.contractAddresses.l2.L2StandardBridge,
        data: encodeFunctionData({
          abi: L2StandardBridgeAbi,
          args: [recipient, DEFAULT_GAS_LIMIT, GRAFFITI],
          functionName: "bridgeETHTo",
        }),
        value: BigInt("10"),
        chainId: deployments.testnetOptimism.l2.id,
      });
    });

    test("force", () => {
      expect(
        withdrawArgs({
          deployment: deployments.testnetOptimism,
          stateToken: testnetEther,
          proxyBridge: PROXY_BRIDGE,
          l2TokenIsLegacy: false,
          recipient,
          weiAmount: BigInt("10"),
          options: { forceViaL1: true, easyMode: false },
        })?.tx
      ).toStrictEqual({
        to: deployments.testnetOptimism.contractAddresses.optimismPortal,
        data: encodeFunctionData({
          abi: OptimismPortalAbi,
          functionName: "depositTransaction",
          args: [
            deployments.testnetOptimism.contractAddresses.l2
              .L2StandardBridge as Address,
            BigInt("10"),
            DEFAULT_GAS_LIMIT_BIGINT,
            false,
            encodeFunctionData({
              abi: L2StandardBridgeAbi,
              functionName: "bridgeETHTo",
              args: [recipient, DEFAULT_GAS_LIMIT, GRAFFITI],
            }),
          ],
        }),
        value: BigInt("0"),
        chainId: deployments.testnetOptimism.l1.id,
        gas: BigInt("300000"),
      });
    });
  });

  describe("mainnet token", () => {
    for (const legacy of [true, false]) {
      test(`should be to proxy ${legacy ? "(legacy)" : ""}`, () => {
        expect(
          withdrawArgs({
            deployment: deployments.mainnetOptimism,
            stateToken: mainnetUsdc,
            proxyBridge: PROXY_BRIDGE,
            l2TokenIsLegacy: legacy,
            recipient,
            weiAmount: BigInt("1"),
            options: { forceViaL1: false, easyMode: false },
          })?.tx
        ).toStrictEqual({
          to: PROXY_BRIDGE,
          data: encodeFunctionData({
            abi: L2BridgeAbi,
            functionName: legacy
              ? "legacy_initiateERC20Withdrawal"
              : "initiateERC20Withdrawal",
            args: [
              mainnetUsdc[chainIds.mainnetL2]!.standardBridgeAddresses[
                chainIds.mainnetL1
              ]!,
              mainnetUsdc[chainIds.mainnetL2].address,
              mainnetUsdc[chainIds.mainnetL1].address,
              recipient,
              BigInt("1"),
            ],
          }),
          value: BigInt("0"),
          chainId: chainIds.mainnetL2,
        });
      });

      test(`force ${legacy ? "(legacy)" : ""}`, () => {
        expect(
          withdrawArgs({
            deployment: deployments.mainnetOptimism,
            stateToken: mainnetUsdc,
            proxyBridge: PROXY_BRIDGE,
            l2TokenIsLegacy: legacy,
            recipient,
            weiAmount: BigInt("10"),
            options: { forceViaL1: true, easyMode: false },
          })?.tx
        ).toStrictEqual({
          to: deployments.mainnetOptimism.contractAddresses.optimismPortal,
          data: encodeFunctionData({
            abi: OptimismPortalAbi,
            functionName: "depositTransaction",
            args: [
              PROXY_BRIDGE,
              BigInt("0"),
              DEFAULT_GAS_LIMIT_BIGINT,
              false,
              encodeFunctionData({
                abi: L2BridgeAbi,
                functionName: legacy
                  ? "legacy_initiateERC20Withdrawal"
                  : "initiateERC20Withdrawal",
                args: [
                  mainnetUsdc[chainIds.mainnetL2]!.standardBridgeAddresses[
                    chainIds.mainnetL1
                  ]!,
                  mainnetUsdc[chainIds.mainnetL2].address,
                  mainnetUsdc[chainIds.mainnetL1].address,
                  recipient,
                  BigInt("10"),
                ],
              }),
            ],
          }),
          value: BigInt("0"),
          chainId: deployments.mainnetOptimism.l1.id,
          gas: BigInt("300000"),
        });
      });
    }

    // test("easy mode", () => {});

    // test("force + easy mode", () => {});
  });

  describe("testnet token", () => {
    for (const legacy of [true, false]) {
      test(`should be to standard bridge ${legacy ? "(legacy)" : ""}`, () => {
        expect(
          withdrawArgs({
            deployment: deployments.testnetOptimism,
            stateToken: testnetUsdc,
            proxyBridge: PROXY_BRIDGE,
            l2TokenIsLegacy: legacy,
            recipient,
            weiAmount: BigInt("1"),
            options: { forceViaL1: false, easyMode: false },
          })?.tx
        ).toStrictEqual({
          to: testnetUsdc[chainIds.testnetL2].standardBridgeAddresses[
            chainIds.testnetL1
          ],
          // @ts-expect-error doesn't like the args ternary
          data: encodeFunctionData({
            abi: L2StandardBridgeAbi,
            functionName: legacy ? "withdrawTo" : "bridgeERC20To",
            args: legacy
              ? [
                  testnetUsdc[chainIds.testnetL2].address,
                  recipient,
                  BigInt("1"),
                  DEFAULT_GAS_LIMIT,
                  GRAFFITI,
                ]
              : [
                  testnetUsdc[chainIds.testnetL2].address,
                  testnetUsdc[chainIds.testnetL1].address,
                  recipient,
                  BigInt("1"),
                  DEFAULT_GAS_LIMIT,
                  GRAFFITI,
                ],
          }),
          value: BigInt("0"),
          chainId: chainIds.testnetL2,
        });
      });

      test(`force ${legacy ? "(legacy)" : ""}`, () => {
        expect(
          withdrawArgs({
            deployment: deployments.testnetOptimism,
            stateToken: testnetUsdc,
            proxyBridge: PROXY_BRIDGE,
            l2TokenIsLegacy: legacy,
            recipient,
            weiAmount: BigInt("1"),
            options: { forceViaL1: true, easyMode: false },
          })?.tx
        ).toStrictEqual({
          to: deployments.testnetOptimism.contractAddresses.optimismPortal,
          data: encodeFunctionData({
            abi: OptimismPortalAbi,
            functionName: "depositTransaction",
            args: [
              testnetUsdc[chainIds.testnetL2]!.standardBridgeAddresses[
                chainIds.testnetL1
              ]!,
              BigInt("0"),
              DEFAULT_GAS_LIMIT_BIGINT,
              false,
              // @ts-expect-error doesn't like the args ternary
              encodeFunctionData({
                abi: L2StandardBridgeAbi,
                functionName: legacy ? "withdrawTo" : "bridgeERC20To",
                args: legacy
                  ? [
                      testnetUsdc[chainIds.testnetL2].address,
                      recipient,
                      BigInt("1"),
                      DEFAULT_GAS_LIMIT,
                      GRAFFITI,
                    ]
                  : [
                      testnetUsdc[chainIds.testnetL2].address,
                      testnetUsdc[chainIds.testnetL1].address,
                      recipient,
                      BigInt("1"),
                      DEFAULT_GAS_LIMIT,
                      GRAFFITI,
                    ],
              }),
            ],
          }),
          value: BigInt("0"),
          chainId: 5,
          gas: BigInt("300000"),
        });
      });
    }
  });
});
