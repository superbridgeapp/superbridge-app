import { Address } from "viem";
import { useAccount, useWalletClient, useWriteContract } from "wagmi";

import { ArbRetryableTxAbi } from "@/abis/arbitrum/ArbRetryableTx";
import {
  ArbitrumDepositRetryableDto,
  ArbitrumForcedWithdrawalDto,
} from "@/codegen/model";
import { isArbitrumDeposit } from "@/utils/guards";

export function useRedeemArbitrum(
  tx: ArbitrumDepositRetryableDto | ArbitrumForcedWithdrawalDto
) {
  const account = useAccount();
  const wallet = useWalletClient();
  const { writeContract, isLoading } = useWriteContract();

  const deployment = isArbitrumDeposit(tx)
    ? tx.deployment
    : tx.deposit.deployment;
  const l2TransactionHash = isArbitrumDeposit(tx)
    ? tx.l2TransactionHash
    : tx.deposit.l2TransactionHash;

  const onRedeem = async () => {
    if (!account.address || !wallet.data) {
      return;
    }

    writeContract({
      abi: ArbRetryableTxAbi,
      functionName: "redeem",
      chainId: deployment.l2.id,
      address: "0x000000000000000000000000000000000000006e",
      args: [l2TransactionHash as Address],
    });
  };

  return { write: onRedeem, isLoading };
}
