import { Address, encodeFunctionData } from "viem";

import { L1BridgeAbi } from "@/abis/L1Bridge";
import { L1StandardBridgeAbi } from "@/abis/L1StandardBridge";
import { OptimismPortalAbi } from "@/abis/OptimismPortal";
import { GRAFFITI } from "@/constants/extra-data";
import { MultiChainToken, OptimismToken } from "@/types/token";

import { isOptimismToken } from "../../guards";
import { isEth } from "../../is-eth";
import { OptimismDeploymentDto, isMainnet, isOptimism } from "../../is-mainnet";
import { TransactionArgs } from "../withdraw-args/types";
import { DepositTxResolver } from "./types";

const onlyHasNewMethods = (d: OptimismDeploymentDto) => {
  return d.name === "kroma";
};

const impl = (
  deployment: OptimismDeploymentDto,
  l1Token: OptimismToken,
  l2Token: OptimismToken,
  proxyBridge: Address | undefined,
  recipient: Address,
  weiAmount: bigint,
  gasToken: MultiChainToken | null
): TransactionArgs | undefined => {
  if (isMainnet(deployment) && proxyBridge) {
    // proxy
    if (isEth(l1Token)) {
      return {
        approvalAddress: undefined,
        tx: {
          to: proxyBridge,
          data: encodeFunctionData({
            abi: L1BridgeAbi,
            functionName: "initiateEtherDeposit",
            args: [
              deployment.contractAddresses.l1StandardBridge as Address,
              recipient,
            ],
          }),
          value: weiAmount,
          chainId: deployment.l1.id,
        },
      };
    }

    return {
      approvalAddress: proxyBridge,
      tx: {
        to: proxyBridge,
        data: encodeFunctionData({
          abi: L1BridgeAbi,
          functionName: "initiateERC20Deposit",
          args: [
            l1Token.standardBridgeAddresses![deployment.l2.id]!,
            l1Token.address, // _localToken
            l2Token.address, // _remoteToken
            recipient, // _to
            weiAmount, // _amount
            onlyHasNewMethods(deployment) ? false : true, // _legacy
          ],
        }),
        value: BigInt("0"),
        chainId: deployment.l1.id,
      },
    };
  }

  // standard bridge
  if (isEth(l2Token)) {
    if (gasToken) {
      return {
        approvalAddress: deployment.contractAddresses.optimismPortal as Address,
        tx: {
          to: deployment.contractAddresses.optimismPortal as Address,
          data: encodeFunctionData({
            abi: OptimismPortalAbi,
            functionName: "depositERC20Transaction",
            args: [
              recipient, // _to
              weiAmount, // _mint
              weiAmount, // _value
              BigInt(200_000), // _gasLimit
              false, // _isCreation
              GRAFFITI, // _extraData
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
        to: deployment.contractAddresses.l1StandardBridge as Address,
        data: encodeFunctionData({
          abi: L1StandardBridgeAbi,
          functionName: "bridgeETHTo",
          args: [
            recipient, // _to
            200_000, // _gas
            GRAFFITI, // _extraData
          ],
        }),
        value: weiAmount,
        chainId: deployment.l1.id,
      },
    };
  }

  return {
    approvalAddress: l1Token.standardBridgeAddresses[deployment.l2.id]!,
    tx: {
      to: l1Token.standardBridgeAddresses[deployment.l2.id]!,
      data: encodeFunctionData({
        abi: L1StandardBridgeAbi,
        functionName: onlyHasNewMethods(deployment)
          ? "bridgeERC20To"
          : "depositERC20To",
        args: [
          l1Token.address, // _localToken
          l2Token.address, // _remoteToken
          recipient, // _to
          weiAmount, // _amount
          200_000, // _minGasLimit
          GRAFFITI, // _extraData
        ],
      }),
      value: BigInt(0),
      chainId: deployment.l1.id,
    },
  };
};

export const optimismDepositArgs: DepositTxResolver = ({
  deployment,
  stateToken,
  proxyBridge,
  recipient,
  weiAmount,
  gasToken,
}) => {
  const l1Token = stateToken[deployment.l1.id];
  const l2Token = stateToken[deployment.l2.id];

  if (
    !l1Token ||
    !l2Token ||
    !isOptimismToken(l1Token) ||
    !isOptimismToken(l2Token) ||
    !isOptimism(deployment)
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
    gasToken
  );
};
