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
