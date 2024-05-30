import { Address, encodeFunctionData, isAddress } from "viem";

import { L1StandardBridgeAbi } from "@/abis/L1StandardBridge";
import { OptimismPortalAbi } from "@/abis/OptimismPortal";
import { useGasToken } from "@/hooks/use-approve-gas-token";
import { useDeployment } from "@/hooks/use-deployment";
import { useGraffiti } from "@/hooks/use-graffiti";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";
import { isOptimismToken } from "@/utils/guards";
import { isEth } from "@/utils/is-eth";
import { OptimismDeploymentDto, isOptimism } from "@/utils/is-mainnet";

import { isCctpBridgeOperation } from "../cctp-args/common";
import { TransactionArgs } from "../types";

const onlyHasNewMethods = (d: OptimismDeploymentDto) => {
  return d.name === "kroma";
};

export const useOptimismDepositArgs = (): TransactionArgs | undefined => {
  const deployment = useDeployment();
  const stateToken = useConfigState.useToken();
  const gasToken = useGasToken();
  const recipient = useConfigState.useRecipientAddress();
  const weiAmount = useWeiAmount();
  const graffiti = useGraffiti();

  const l1Token = stateToken?.[deployment?.l1.id ?? 0];
  const l2Token = stateToken?.[deployment?.l2.id ?? 0];

  if (
    !deployment ||
    !l1Token ||
    !l2Token ||
    !isOptimismToken(l1Token) ||
    !isOptimismToken(l2Token) ||
    !isOptimism(deployment) ||
    !recipient ||
    !isAddress(recipient) ||
    isCctpBridgeOperation(stateToken)
  ) {
    return;
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
              BigInt(100_000), // _gasLimit
              false, // _isCreation
              graffiti, // _extraData
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
            graffiti, // _extraData
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
          graffiti, // _extraData
        ],
      }),
      value: BigInt(0),
      chainId: deployment.l1.id,
    },
  };
};
