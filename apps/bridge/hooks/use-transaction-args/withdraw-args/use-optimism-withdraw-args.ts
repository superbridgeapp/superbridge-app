import { Address, encodeFunctionData } from "viem";

import { L2StandardBridgeAbi } from "@/abis/L2StandardBridge";
import { L2ToL1MessagePasserAbi } from "@/abis/L2ToL1MessagePasser";
import { OptimismPortalAbi } from "@/abis/OptimismPortal";
import { useGasToken } from "@/hooks/use-approve-gas-token";
import { useDeployment } from "@/hooks/use-deployment";
import { useGraffiti } from "@/hooks/use-graffiti";
import { useL2TokenIsLegacy } from "@/hooks/use-l2-token-is-legacy";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";
import { isOptimismToken } from "@/utils/guards";
import { isEth } from "@/utils/is-eth";
import { isOptimism } from "@/utils/is-mainnet";

import { isCctpBridgeOperation } from "../cctp-args/common";

export const useOptimismWithdrawArgs = () => {
  const stateToken = useConfigState.useToken();
  const recipientAddress = useConfigState.useRecipientAddress();

  const deployment = useDeployment();
  const gasToken = useGasToken();
  const graffiti = useGraffiti();
  const weiAmount = useWeiAmount();

  const l2TokenIsLegacy = useL2TokenIsLegacy();

  const l1Token = stateToken?.[deployment?.l1.id ?? 0];
  const l2Token = stateToken?.[deployment?.l2.id ?? 0];

  if (
    !deployment ||
    !l1Token ||
    !l2Token ||
    !isOptimismToken(l1Token) ||
    !isOptimismToken(l2Token) ||
    !isOptimism(deployment) ||
    typeof l2TokenIsLegacy === "undefined" ||
    !recipientAddress ||
    isCctpBridgeOperation(stateToken)
  ) {
    return;
  }

  // standard bridge
  if (isEth(l2Token)) {
    if (gasToken) {
      return {
        approvalAddress: undefined,
        tx: {
          to: deployment.contractAddresses.l2.L2ToL1MessagePasser as Address,
          data: encodeFunctionData({
            abi: L2ToL1MessagePasserAbi,
            functionName: "initiateWithdrawal",
            args: [
              recipientAddress, // _to
              BigInt(200_000), // _gasLimit
              "0x", // _data
            ],
          }),
          value: weiAmount,
          chainId: deployment.l2.id,
        },
      };
    }
    return {
      approvalAddress: undefined,
      tx: {
        to: deployment.contractAddresses.l2.L2StandardBridge as Address,
        data: encodeFunctionData({
          abi: L2StandardBridgeAbi,
          functionName: "bridgeETHTo",
          args: [
            recipientAddress, // _to
            200_000, // _gas
            graffiti, // _extraData
          ],
        }),
        value: weiAmount,
        chainId: deployment.l2.id,
      },
    };
  }

  if (l2TokenIsLegacy) {
    return {
      approvalAddress: l2Token.standardBridgeAddresses[deployment.l1.id]!,
      tx: {
        to: l2Token.standardBridgeAddresses[deployment.l1.id]!,
        data: encodeFunctionData({
          abi: L2StandardBridgeAbi,
          functionName: "withdrawTo",
          args: [
            l2Token.address, // _localToken
            recipientAddress, // _to
            weiAmount, // _amount
            200_000, // _minGasLimit
            graffiti, // _extraData
          ],
        }),
        value: BigInt(0),
        chainId: deployment.l2.id,
      },
    };
  }

  return {
    approvalAddress: l2Token.standardBridgeAddresses[deployment.l1.id]!,
    tx: {
      to: l2Token.standardBridgeAddresses[deployment.l1.id]!,
      data: encodeFunctionData({
        abi: L2StandardBridgeAbi,
        functionName: "bridgeERC20To",
        args: [
          l2Token.address, // _localToken
          l1Token.address, // _remoteToken
          recipientAddress, // _to
          weiAmount, // _amount
          200_000, // _minGasLimit
          graffiti, // _extraData
        ],
      }),
      value: BigInt(0),
      chainId: deployment.l2.id,
    },
  };
};
