import { Address, Hex } from "viem";
import { UseEstimateFeesPerGasReturnType } from "wagmi";

import { CctpDomainDto, DeploymentDto } from "@/codegen/model";
import { MultiChainToken } from "@/types/token";

export type TransactionArgs = {
  approvalAddress: Address | undefined;
  tx: {
    to: Address;
    value: bigint;
    data: Address;
    chainId: number;
    gas?: bigint;
  };
};

export type WithdrawArgs = {
  deployment: DeploymentDto;
  stateToken: MultiChainToken;
  proxyBridge?: Address | undefined;
  cctp?: { from: CctpDomainDto | undefined; to: CctpDomainDto | undefined };
  l2TokenIsLegacy?: boolean;
  recipient: Address;
  weiAmount: bigint;
  options: { forceViaL1: boolean; easyMode: boolean };
  l1FeeData?: UseEstimateFeesPerGasReturnType;
  l2FeeData?: UseEstimateFeesPerGasReturnType;
  hyperlaneGasQuote?: bigint | undefined;
  gasToken: MultiChainToken | null;
  graffiti: Hex;
};

export type WithdrawTxResolver = (
  args: WithdrawArgs
) => TransactionArgs | undefined;
