import { Address, erc20Abi, formatUnits } from "viem";
import { useReadContract } from "wagmi";

import { useAllTokens } from "@/hooks/tokens";
import { useChain } from "@/hooks/use-chain";
import { Token } from "@/types/token";

const TokenView = ({ token }: { token: Token }) => {
  const balance = useReadContract({
    abi: erc20Abi,
    functionName: "balanceOf",
    address: token.address as Address,
    args: [token.hyperlane?.router as Address],
    chainId: token.chainId,
  });

  const chain = useChain(token.chainId);

  if (!token.hyperlane) {
    return null;
  }

  return (
    <div className="">
      <div>{chain?.name}</div>
      <div>
        {token.hyperlane.type === "EvmHypSynthetic"
          ? Infinity
          : formatUnits(balance.data ?? BigInt(0), token.decimals)}
      </div>
    </div>
  );
};

export const HyperlaneLiquidity = () => {
  const tokens = useAllTokens();

  return (
    <div className="mt-20 p-8 flex w-full">
      {tokens.data.map((x) => {
        const [t] = Object.values(x);
        if (!t.hyperlane) {
          return null;
        }

        return (
          <div>
            <div className="text-2xl">{t.name}</div>

            <div className="flex gap-4">
              {Object.values(x).map((x) => (
                <TokenView token={x} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
