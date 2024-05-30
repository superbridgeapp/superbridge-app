import { Address, encodeFunctionData } from "viem";

import { ArbSysAbi } from "@/abis/arbitrum/ArbSys";
import { L2GatewayRouterAbi } from "@/abis/arbitrum/L2GatewayRouter";
import { useDeployment } from "@/hooks/use-deployment";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";
import { isArbitrumToken } from "@/utils/guards";
import { isEth } from "@/utils/is-eth";
import { isArbitrum } from "@/utils/is-mainnet";
import { withdrawValue } from "@/utils/withdraw-value";

import { isCctpBridgeOperation } from "../cctp-args/common";

export const ARB_SYS: Address = "0x0000000000000000000000000000000000000064";

export const useArbitrumWithdrawArgs = () => {
  const stateToken = useConfigState.useToken();
  const recipientAddress = useConfigState.useRecipientAddress();
  const easyMode = useConfigState.useEasyMode();

  const deployment = useDeployment();
  const weiAmount = useWeiAmount();

  const l1Token = stateToken?.[deployment?.l1.id ?? 0];
  const l2Token = stateToken?.[deployment?.l2.id ?? 0];

  if (
    !deployment ||
    !isArbitrum(deployment) ||
    !l1Token ||
    !l2Token ||
    !isArbitrumToken(l1Token) ||
    !isArbitrumToken(l2Token) ||
    !recipientAddress ||
    isCctpBridgeOperation(stateToken)
  ) {
    return;
  }

  const value = withdrawValue(weiAmount, deployment, l2Token, easyMode);

  if (isEth(l2Token)) {
    return {
      approvalAddress: undefined,
      tx: {
        to: ARB_SYS,
        data: encodeFunctionData({
          abi: ArbSysAbi,
          functionName: "withdrawEth",
          args: [
            recipientAddress, // _to
          ],
        }),
        value,
        chainId: deployment.l2.id,
      },
    };
  }

  return {
    approvalAddress: l2Token.arbitrumBridgeInfo[l1Token.chainId],
    tx: {
      to: deployment.contractAddresses.l2GatewayRouter as Address,
      data: encodeFunctionData({
        abi: L2GatewayRouterAbi,
        functionName: "outboundTransfer",
        args: [
          l1Token.address, // l1Token
          recipientAddress, // to
          weiAmount, // amount
          "0x", // extraData
        ],
      }),
      value: BigInt("0"),
      chainId: deployment.l2.id,
    },
  };
};
