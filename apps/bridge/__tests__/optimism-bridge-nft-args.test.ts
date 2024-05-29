import { encodeFunctionData } from "viem";
import { expect, test } from "vitest";

import { L1ERC721BridgeAbi } from "@/abis/L1ERC721Bridge";
import { GRAFFITI } from "@/constants/extra-data";
import { optimismBridgeNftArgs } from "@/hooks/transaction-args/nft-args/optimism-bridge-nft-args";

import { deployments, getAddress } from "./constants";

const recipient = getAddress();

const common = {
  deployment: deployments.mainnetOptimism,
  recipient,
  nft: {
    localConfig: {
      address: getAddress(),
      bridgeAddress: getAddress(),
      chainId: "1",
      isNative: true,
    },
    remoteConfig: {
      address: getAddress(),
      bridgeAddress: getAddress(),
      chainId: "1",
      isNative: true,
    },
    name: "mock nft",
    tokenId: "123",
  },
};

test("optimism bridge nft args", () => {
  expect(
    optimismBridgeNftArgs({
      ...common,
    })
  ).toStrictEqual({
    approvalAddress: common.nft.localConfig.bridgeAddress,
    tx: {
      to: common.nft.localConfig.bridgeAddress,
      data: encodeFunctionData({
        abi: L1ERC721BridgeAbi,
        functionName: "bridgeERC721To",
        args: [
          common.nft.localConfig.address,
          common.nft.remoteConfig.address,
          recipient,
          BigInt(common.nft.tokenId),
          300_000,
          GRAFFITI,
        ],
      }),
      value: BigInt("0"),
      chainId: common.deployment.l1.id,
    },
  });
});
