import { Address, erc20Abi, formatUnits, isAddressEqual } from "viem";
import { useAccount, useBalance, useReadContracts } from "wagmi";

import { useBridgeControllerGetTokenPrices } from "@/codegen";
import { BridgeableTokenDto } from "@/codegen/model";
import { scaleToNativeTokenDecimals } from "@/utils/native-token-scaling";
import { isEth } from "@/utils/tokens/is-eth";

import { useActiveTokens } from "./tokens/use-active-tokens";
import { useChain } from "./use-chain";

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
    contracts: tokens.data?.map((t) => ({
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

  const data = tokens.data
    ?.map((token, index) => {
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
      // @ts-expect-error
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
    isLoading: reads.isFetching,
    isError: reads.isError,
    data,
  };
}

export function useTokenBalance(token: BridgeableTokenDto | null) {
  const tokenBalances = useTokenBalances(token?.chainId);

  if (!token) {
    return {
      isLoading: false,
      data: 0n,
    };
  }

  if (tokenBalances.isLoading) {
    return {
      isLoading: true,
      data: 0n,
    };
  }

  return {
    isLoading: false,
    data:
      tokenBalances.data?.find(
        (x) =>
          x.token[token.chainId]?.address &&
          isAddressEqual(
            x.token[token.chainId]!.address as Address,
            token.address as Address
          )
      )?.balance ?? 0n,
  };
}
