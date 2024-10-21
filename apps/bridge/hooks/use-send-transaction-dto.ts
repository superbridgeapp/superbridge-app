import { AxiosResponse } from "axios";
import { useState } from "react";
import { Address, Chain, Hex } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

import { ChainDto, TransactionDto } from "@/codegen/model";

import { bridgeControllerGetGasEstimate } from "../codegen";
import { useEstimateFeesPerGas } from "./gas/use-estimate-fees-per-gas";
import { useHost } from "./use-metadata";
import { useSwitchChain } from "./use-switch-chain";

export function useSendTransactionDto(
  chain: ChainDto | undefined,
  getTransactionDto: () => Promise<AxiosResponse<TransactionDto>>
) {
  const host = useHost();
  const account = useAccount();
  const wallet = useWalletClient({ chainId: chain?.id });
  const client = usePublicClient({ chainId: chain?.id });
  const switchChain = useSwitchChain();
  const fees = useEstimateFeesPerGas(chain?.id);

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

      const gas = await bridgeControllerGetGasEstimate({
        domain: host,
        from: account.address,
        transactions: [result],
      }).then((x) => {
        console.log(x.data);
        return BigInt(x.data.estimates[0].limit);
      });

      return await wallet.data.sendTransaction({
        to,
        data,
        chain: chain as unknown as Chain,
        gas,
        ...(fees.data?.gasPrice
          ? {
              gasPrice: fees.data?.gasPrice,
            }
          : {
              maxFeePerGas: fees.data?.maxFeePerGas,
              maxPriorityFeePerGas: fees.data?.maxPriorityFeePerGas,
            }),
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
