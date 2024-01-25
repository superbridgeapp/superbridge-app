import { Address, encodeFunctionData } from "viem";

import { CctpBridgeAbi } from "@/abis/cctp/CctpBridge";
import { CctpDomainDto, DeploymentDto } from "@/codegen/model";
import { CCTP_MINT_GAS_COST, hyperlaneDomains } from "@/constants/hyperlane";
import { Token } from "@/types/token";

import { TransactionArgs } from "../withdraw-args/types";
import { CctpBridgeTxResolver, addressToBytes32 } from "./common";

const impl = (
  deployment: DeploymentDto,
  fromConfig: CctpDomainDto,
  toConfig: CctpDomainDto,
  fromToken: Token,
  toToken: Token,
  recipient: Address,
  weiAmount: bigint,
  hyperlaneGasQuote: bigint
): TransactionArgs | undefined => {
  const hyperlaneDestinationDomain = hyperlaneDomains[toToken.chainId];
  if (!hyperlaneDestinationDomain) {
    return;
  }

  return {
    approvalAddress: fromConfig.contractAddresses.bridge as Address,
    tx: {
      to: fromConfig.contractAddresses.bridge as Address,
      data: encodeFunctionData({
        abi: CctpBridgeAbi,
        functionName: "initiateTokenTransfer",
        args: [
          // CCTP
          weiAmount, // _amount
          toConfig.domain, // _destinationCircleDomain
          addressToBytes32(recipient), // _recipient
          fromToken.address, // _token
          // Hyperlane
          toConfig.contractAddresses.bridge as Address, // _router
          hyperlaneDestinationDomain, // _destinationDomain
          CCTP_MINT_GAS_COST, // _gasAmount
        ],
      }),
      value: hyperlaneGasQuote,
      chainId: fromToken.chainId,
    },
  };
};

export const cctpBridgeArgs: CctpBridgeTxResolver = (
  { deployment, stateToken, cctp, recipient, weiAmount, hyperlaneGasQuote },
  withdrawing
) => {
  const fromToken = withdrawing
    ? stateToken[deployment.l2.id]
    : stateToken[deployment.l1.id];
  const toToken = withdrawing
    ? stateToken[deployment.l1.id]
    : stateToken[deployment.l2.id];

  if (!fromToken || !toToken || !cctp?.from || !cctp.to || !hyperlaneGasQuote) {
    return;
  }

  return impl(
    deployment,
    cctp.from,
    cctp.to,
    fromToken,
    toToken,
    recipient,
    weiAmount,
    hyperlaneGasQuote
  );
};
