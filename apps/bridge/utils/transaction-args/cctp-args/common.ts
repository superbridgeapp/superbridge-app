import { Address } from "viem";

import { CctpDomainDto, DeploymentDto } from "@/codegen/model";
import { MultiChainToken } from "@/types/token";
import { isNativeUsdc } from "@/utils/is-usdc";

import { TransactionArgs } from "../withdraw-args/types";

export function addressToBytes32(address: Address): Address {
  // "0x" + 24 zeros + Rest of the address string with leading "0x" trimmed
  return (address.slice(0, 2) +
    "000000000000000000000000" +
    address.slice(2, address.length)) as Address;
}

export type CctpBridgeArgs = {
  deployment: DeploymentDto;
  stateToken: MultiChainToken;
  cctp?: { from: CctpDomainDto | undefined; to: CctpDomainDto | undefined };
  recipient: Address;
  weiAmount: bigint;
  hyperlaneGasQuote?: bigint | undefined;
};

export type CctpBridgeTxResolver = (
  args: CctpBridgeArgs,
  withdrawing: boolean
) => TransactionArgs | undefined;

export const isCctpBridgeOperation = (
  deployment: DeploymentDto,
  stateToken: MultiChainToken,
  withdrawing: boolean
) => {
  return isNativeUsdc(stateToken);
};
