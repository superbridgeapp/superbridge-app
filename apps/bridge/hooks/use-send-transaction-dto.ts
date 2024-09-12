import { AxiosResponse } from "axios";
import { useState } from "react";
import { Address, Chain, Hex } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

import { ChainDto, TransactionDto } from "@/codegen/model";

import { useSwitchChain } from "./use-switch-chain";

export function useSendTransactionDto(
  chain: ChainDto | undefined,
  getTransactionDto: () => Promise<AxiosResponse<TransactionDto>>
) {
  const account = useAccount();
  const wallet = useWalletClient({ chainId: chain?.id });
  const client = usePublicClient({ chainId: chain?.id });
  const switchChain = useSwitchChain();

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!account.address || !wallet.data || !client || !chain) {
      return;
    }

    if (account.chainId !== chain.id || wallet.data.chain.id !== chain.id) {
      await switchChain(chain);
    }

    try {
      setLoading(true);

      const { data: result } = await getTransactionDto();

      const to = result.to as Address;
      const data = result.data as Hex;
      // @ts-expect-error
      const value = result.value as string | undefined;

      const [gas, fees] = await Promise.all([
        client.estimateGas({
          to,
          data,
        }),
        client.estimateFeesPerGas({
          chain: chain as unknown as Chain,
        }),
      ]);

      return await wallet.data.sendTransaction({
        to,
        data,
        chain: chain as unknown as Chain,
        gas: gas + gas / BigInt("10"),
        ...(fees.gasPrice
          ? { gasPrice: fees.gasPrice }
          : {
              maxFeePerGas: fees.maxFeePerGas,
              maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
            }),
        value: BigInt(value ?? "0"),
      });
    } catch (e: any) {
      if (
        e.message.includes("rejected the request") ||
        e.message.includes("denied transaction signature")
      ) {
        // no error
      } else {
        console.log(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    onSubmit,
    loading,
  };
}
