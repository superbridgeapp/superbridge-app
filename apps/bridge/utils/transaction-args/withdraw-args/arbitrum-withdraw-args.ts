import { Address, encodeFunctionData } from "viem";

import { ArbSysAbi } from "@/abis/arbitrum/ArbSys";
import { L2BridgeArbitrumAbi } from "@/abis/arbitrum/L2Bridge";
import { L2GatewayRouterAbi } from "@/abis/arbitrum/L2GatewayRouter";
import { ArbitrumToken } from "@/types/token";

import { isArbitrumToken } from "../../guards";
import { isEth } from "../../is-eth";
import { ArbitrumDeploymentDto, isArbitrum, isMainnet } from "../../is-mainnet";
import { withdrawValue } from "../../withdraw-value";
import { WithdrawTxResolver } from "./types";

export const ARB_SYS: Address = "0x0000000000000000000000000000000000000064";

const impl = (
  deployment: ArbitrumDeploymentDto,
  l1Token: ArbitrumToken,
  l2Token: ArbitrumToken,
  proxyBridge: Address | undefined,
  recipient: Address,
  weiAmount: bigint,
  options: { easyMode: boolean }
) => {
  const value = withdrawValue(weiAmount, deployment, l2Token, options.easyMode);

  if (proxyBridge && options.easyMode) {
    if (isEth(l2Token)) {
      return {
        approvalAddress: undefined,
        tx: {
          to: proxyBridge,
          data: encodeFunctionData({
            abi: L2BridgeArbitrumAbi,
            functionName: "initiateEtherWithdrawal",
            args: [
              recipient, // _to
              weiAmount, // _amount
            ],
          }),
          value,
          chainId: deployment.l2.id,
        },
      };
    }

    return {
      approvalAddress: proxyBridge,
      tx: {
        to: proxyBridge,
        data: encodeFunctionData({
          abi: L2BridgeArbitrumAbi,
          functionName: "initiateERC20Withdrawal",
          args: [
            deployment.contractAddresses.l2GatewayRouter as Address, // _router
            l2Token.arbitrumBridgeInfo[l1Token.chainId] as Address, // _gateway
            l1Token.address, // l1Token
            l2Token.address, // l1Token
            recipient, // to
            weiAmount, // amount
          ],
        }),
        value,
        chainId: deployment.l2.id,
      },
    };
  }

  if (isEth(l2Token)) {
    return {
      approvalAddress: undefined,
      tx: {
        to: ARB_SYS,
        data: encodeFunctionData({
          abi: ArbSysAbi,
          functionName: "withdrawEth",
          args: [
            recipient, // _to
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
          recipient, // to
          weiAmount, // amount
          "0x", // extraData
        ],
      }),
      value: BigInt("0"),
      chainId: deployment.l2.id,
    },
  };
};

export const arbitrumWithdrawArgs: WithdrawTxResolver = ({
  deployment,
  stateToken,
  proxyBridge,
  recipient,
  weiAmount,
  options,
}) => {
  const l1Token = stateToken[deployment.l1.id];
  const l2Token = stateToken[deployment.l2.id];

  if (
    !isArbitrum(deployment) ||
    !l1Token ||
    !l2Token ||
    !isArbitrumToken(l1Token) ||
    !isArbitrumToken(l2Token) ||
    options.forceViaL1
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
    options
  );
};
