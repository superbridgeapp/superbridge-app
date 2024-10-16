import { Address, erc20Abi, formatUnits, isAddressEqual } from "viem";
import { useAccount, useBalance, useReadContracts } from "wagmi";

import { useBridgeControllerGetTokenPrices } from "@/codegen";
import { Token } from "@/types/token";
import { isEth } from "@/utils/is-eth";
import { scaleToNativeTokenDecimals } from "@/utils/native-token-scaling";

import { useChain } from "./use-chain";
import { useActiveTokens } from "./use-tokens";

export function useTokenBalances(chainId: number | undefined) {
  const account = useAccount();
  const chain = useChain(chainId);
  const ethBalance = useBalance({
    chainId: chainId,
    address: account.address,
  });
  const prices = useBridgeControllerGetTokenPrices();
  const tokens = useActiveTokens();

  const reads = useReadContracts({
    allowFailure: true,
    contracts: tokens.map((t) => ({
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account.address ?? "0x"],
      chainId: chainId,
      address: t[chainId ?? 0]?.address as Address,
    })),
    query: {
      enabled: !!account.address,
    },
  });

  const data = tokens
    .map((token, index) => {
      let balance = BigInt(0);
      if (chainId && token[chainId] && isEth(token[chainId])) {
        balance = scaleToNativeTokenDecimals({
          amount: ethBalance.data?.value ?? BigInt(0),
          decimals: chain?.nativeCurrency.decimals ?? 18,
        });
      } else if (reads.data?.[index].result) {
        balance = BigInt(reads.data[index].result!);
      }

      const id =
        chainId && token[chainId]?.coinGeckoId
          ? `coingecko:${token[chainId]?.coinGeckoId}`
          : token[1]?.coinGeckoId
          ? `coingecko:${token[1].coinGeckoId}`
          : `ethereum:${token[1]?.address}`;
      const price: number = prices.data?.data?.[id]?.price ?? 0;
      const usdValue =
        parseFloat(
          formatUnits(balance, Object.values(token)[0]?.decimals ?? 18)
        ) * price;

      return {
        token,
        balance,
        usdValue,
      };
    })
    .sort((a, b) => {
      if (b.usdValue && a.usdValue) {
        return b.usdValue - a.usdValue;
      }

      return (
        parseFloat(b.balance.toString()) - parseFloat(a.balance.toString())
      );
    });
  return {
    isLoading: reads.isLoading,
    isError: reads.isError,
    data,
    refetch: () => {
      reads.refetch();
      ethBalance.refetch();
    },
  };
}

export function useTokenBalance(token: Token | null) {
  const tokenBalances = useTokenBalances(token?.chainId);

  if (!token) {
    return BigInt(0);
  }

  return (
    tokenBalances.data.find(
      (x) =>
        x.token[token.chainId]?.address &&
        isAddressEqual(
          x.token[token.chainId]!.address as Address,
          token.address
        )
    )?.balance ?? BigInt(0)
  );
}
