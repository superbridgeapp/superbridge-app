import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";
import { formatUnits } from "viem";
import { Chain } from "wagmi";

import { ChainDto } from "@/codegen/model";
import { deploymentTheme } from "@/config/theme";
import { useTokenBalances } from "@/hooks/use-balances";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { MultiChainToken } from "@/types/token";
import { isBridgedUsdc, isNativeUsdc } from "@/utils/is-usdc";
import { TokenIcon } from "../token-icon";

const Token = ({
  token,
  from,
  balance,
  onClick,
}: {
  token: MultiChainToken;
  from: ChainDto | Chain | undefined;
  balance: bigint;
  onClick: () => void;
}) => {
  const selectedToken = useSelectedToken();
  return (
    <div
      className={clsx(
        "flex justify-between hover:bg-black/[0.025] hover:dark:bg-white/[0.05] transition cursor-pointer p-4",
        token[from?.id ?? 0]?.address === selectedToken?.address &&
          "bg-black/[0.025] dark:bg-white/[0.05]"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <TokenIcon token={token[from?.id ?? 0] ?? null} className="h-8 w-8" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">
              {token[from?.id ?? 0]?.name}
            </span>
            {isNativeUsdc(token) && (
              <div className="h-[18px] pr-1.5 pl-1 flex items-center gap-0.5 bg-gradient-to-l from-[#7AECC2] via-[#65BCFF] to-[#A796F6] rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 233 233"
                  className="fill-white dark:fill-zinc-950"
                >
                  <path d="M217.43 59.37L212.43 50.59C212.038 49.9019 211.492 49.3137 210.835 48.8713C210.178 48.429 209.428 48.1444 208.643 48.0399C207.858 47.9353 207.059 48.0136 206.309 48.2686C205.559 48.5236 204.879 48.9485 204.32 49.51L192.82 61C191.979 61.845 191.456 62.9546 191.34 64.141C191.223 65.3273 191.52 66.5175 192.18 67.51C196.373 73.9178 199.734 80.8334 202.18 88.09C206.75 101.655 208.027 116.114 205.903 130.27C203.78 144.426 198.318 157.874 189.969 169.501C181.62 181.128 170.623 190.602 157.888 197.138C145.152 203.674 131.045 207.085 116.73 207.09C101.994 207.131 87.4765 203.527 74.47 196.6L93.92 177.14C105.972 181.699 119.115 182.537 131.649 179.548C144.183 176.559 155.532 169.879 164.23 160.371C172.927 150.864 178.574 138.966 180.438 126.216C182.303 113.466 180.301 100.45 174.69 88.85C174.334 88.1073 173.805 87.4607 173.147 86.9648C172.489 86.4689 171.722 86.1379 170.91 85.9998C170.098 85.8617 169.264 85.9204 168.48 86.171C167.695 86.4216 166.982 86.8568 166.4 87.44L154.76 99C154.139 99.6198 153.688 100.388 153.448 101.232C153.208 102.075 153.188 102.966 153.39 103.82L154.39 108C156.111 115.322 155.656 122.987 153.083 130.055C150.509 137.123 145.928 143.285 139.902 147.787C133.876 152.288 126.667 154.932 119.16 155.395C111.652 155.857 104.173 154.118 97.64 150.39L92.51 147.45C91.5297 146.885 90.3902 146.661 89.2688 146.811C88.1475 146.961 87.1073 147.477 86.31 148.28L38.8 195.78C38.2814 196.299 37.8795 196.922 37.6213 197.609C37.3631 198.295 37.2545 199.029 37.3028 199.761C37.3511 200.492 37.5551 201.206 37.9013 201.852C38.2475 202.499 38.7277 203.064 39.31 203.51L46.31 208.88C66.4969 224.437 91.2844 232.837 116.77 232.76C137.06 232.734 156.988 227.386 174.566 217.251C192.143 207.116 206.754 192.547 216.941 175C227.128 157.453 232.535 137.54 232.62 117.25C232.706 96.9604 227.468 77.0029 217.43 59.37Z" />
                  <path d="M187.21 24.82C167.025 9.2578 142.237 0.853117 116.75 0.929966C96.4501 0.945745 76.5098 6.28841 58.9214 16.4241C41.333 26.5599 26.7123 41.1337 16.5203 58.6896C6.32834 76.2455 0.921852 96.1686 0.841068 116.468C0.760284 136.768 6.00803 156.734 16.06 174.37L21.06 183.14C21.4538 183.827 22.0005 184.415 22.6579 184.857C23.3154 185.299 24.0657 185.584 24.8509 185.689C25.6361 185.795 26.435 185.718 27.1858 185.465C27.9365 185.212 28.6188 184.789 29.18 184.23L40.66 172.75C41.495 171.904 42.0142 170.796 42.1307 169.613C42.2472 168.43 41.9539 167.243 41.3 166.25C37.1028 159.844 33.7422 152.928 31.3 145.67C26.7295 132.105 25.4531 117.646 27.5765 103.49C29.6998 89.334 35.1619 75.8864 43.5112 64.259C51.8604 52.6316 62.8571 43.1583 75.5923 36.6221C88.3275 30.0859 102.435 26.6745 116.75 26.67C131.486 26.6366 146 30.2507 159 37.19L139.54 56.64C129.792 52.9453 119.292 51.6729 108.943 52.9319C98.5948 54.191 88.7066 57.9439 80.1286 63.8681C71.5506 69.7924 64.5392 77.7108 59.6971 86.943C54.855 96.1752 52.3268 106.445 52.33 116.87C52.33 117.94 52.62 122.82 52.71 123.66C53.4986 131.046 55.5518 138.241 58.78 144.93C59.1374 145.673 59.6677 146.319 60.3263 146.815C60.9849 147.311 61.7528 147.642 62.5656 147.78C63.3784 147.918 64.2124 147.859 64.9978 147.609C65.7833 147.358 66.4973 146.923 67.08 146.34L78.72 134.69C79.3399 134.072 79.792 133.305 80.0335 132.464C80.2749 131.622 80.2978 130.733 80.1 129.88L79.1 125.69C77.377 118.368 77.8298 110.701 80.4031 103.633C82.9763 96.5644 87.5578 90.4012 93.5849 85.9002C99.6121 81.3992 106.823 78.7563 114.331 78.2962C121.839 77.836 129.318 79.5786 135.85 83.31L140.98 86.25C141.962 86.8096 143.1 87.0315 144.22 86.8816C145.34 86.7316 146.38 86.2181 147.18 85.42L194.68 37.92C195.199 37.4011 195.602 36.7774 195.861 36.0905C196.12 35.4036 196.23 34.6694 196.182 33.9368C196.135 33.2041 195.932 32.4901 195.587 31.8422C195.241 31.1944 194.762 30.6277 194.18 30.18L187.21 24.82Z" />
                </svg>
                <span className="leading-4 mt-[1px] align-text-bottom font-medium text-[10px] text-white dark:text-zinc-950">
                  CCTP
                </span>
              </div>
            )}
          </div>
          <span className="text-xs font-medium text-zinc-400">
            {token[from?.id ?? 0]?.symbol}
          </span>
        </div>
      </div>
      <div>
        <span className="text-sm font-medium text-zinc-400">
          {parseFloat(
            formatUnits(balance, token[from?.id ?? 0]?.decimals ?? 18)
          ).toLocaleString("en", { maximumFractionDigits: 3 })}
        </span>
      </div>
    </div>
  );
};

// const TokenImport: FC<{
//   from: Chain;
//   address: Address;
// }> = ({ from, address }) => {
//   const { setToken } = useConfigState();
//   const account = useAccount();
//   const tokens = useTokens();
//   const reads = useContractReads({
//     allowFailure: true,
//     contracts: [
//       { address, abi: erc20ABI, chainId: from.id, functionName: "name" },
//       { address, abi: erc20ABI, chainId: from.id, functionName: "symbol" },
//       { address, abi: erc20ABI, chainId: from.id, functionName: "decimals" },
//       {
//         address,
//         abi: erc20ABI,
//         chainId: from.id,
//         functionName: "balanceOf",
//         args: [account?.address ?? "0x"],
//       },
//     ],
//   });

//   const importToken = () => {};

//   const token: OptimismToken | false = reads.data?.every(
//     (x) => x.status === "success"
//   ) && {
//     name: reads.data[0].result!,
//     symbol: reads.data[1].result!,
//     decimals: reads.data[2].result!,
//     chainId: from.id,
//     address,
//     logoURI: "",
//   };

//   if (reads.isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (reads.isError || !token) {
//     return <div>Error...</div>;
//   }

//   return (
//     <div
//       className="flex justify-between hover:bg-zinc-50 transition cursor-pointer p-4 rounded-sm"
//       // onClick={() => setToken(token)}
//     >
//       <div className="flex items-center space-x-4">
//         <img src={token.logoURI} className="h-8 w-8 rounded-full" />
//         <div className="text-sm font-bold text-left">
//           <div>{token.name}</div>
//           <div>{token.symbol}</div>
//         </div>
//       </div>
//       <div>
//         {/* {parseFloat(
//           formatUnits(balance, token[from.id]!.decimals)
//         ).toLocaleString("en", { maximumFractionDigits: 3 })} */}
//       </div>
//     </div>
//   );
// };

export const FungibleTokenPicker = ({
  setOpen,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
}) => {
  const [search, setSearch] = useState("");

  const from = useFromChain();
  const to = useToChain();
  const deployment = useConfigState.useDeployment();
  const setToken = useConfigState.useSetToken();
  const tokens = useTokenBalances(from?.id);
  const { t } = useTranslation();

  const filteredTokens = tokens.data.filter(({ token }) => {
    if (search)
      return (
        token[from?.id ?? 0]!.name.toLowerCase().includes(
          search.toLowerCase()
        ) ||
        token[to?.id ?? 0]!.symbol.toLowerCase().includes(
          search.toLowerCase()
        ) ||
        token[to?.id ?? 0]!.address.toLowerCase().includes(search.toLowerCase())
      );
    return true;
  });

  const onClickToken = (t: MultiChainToken) => {
    setToken(t);
    setOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-4  border-b border-zinc-100 dark:border-zinc-900">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          name="token"
          id="token"
          className={`${
            deploymentTheme(deployment).bgMuted
          } block w-full rounded-lg border-0 py-3 px-4 pr-10 text-sm font-medium text-zinc-900 dark:text-zinc-50 text-zinc-900 outline-0 ring-0 placeholder:text-zinc-400 sm:leading-6`}
          placeholder="Search"
        />

        {/* highlighted tokens */}
        <div className="flex flex-wrap items-center gap-1">
          {[
            "ETH",
            "USDC",
            "DAI",
            "USDT",
            // "rETH",
            "BITCOIN", // HarryPotterObamaSonicInu
            "WBTC",
            "wstETH",
            deployment?.name === "base" && "DOG",
          ]
            .filter(Boolean)
            .map((symbol) => {
              const token = tokens.data.find(
                (t) => t.token[deployment?.l2.id ?? 0]?.symbol === symbol
              )?.token;
              if (!token) {
                return null;
              }
              return (
                <div
                  key={token[from?.id ?? 0]?.address ?? "0x"}
                  className="border border-zinc-100 dark:border-zinc-800 rounded-full flex items-center space-x-1 px-2 pr-3 py-1  cursor-pointer hover:bg-zinc-200 hover:dark:bg-zinc-800 transition"
                  onClick={() => onClickToken(token)}
                >
                  <img
                    src={token[from?.id ?? 0]?.logoURI}
                    className="h-5 w-5 rounded-full"
                  />
                  <span className="text-sm font-medium inline-flex">
                    {token[from?.id ?? 0]?.symbol}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      <div className="overflow-y-scroll flex flex-col basis-full">
        {match({ filteredTokens })
          // .with(
          //   {
          //     filteredTokens: P.when((x) => x.length === 0),
          //     searchIsToken: true,
          //   },
          //   () => (
          //     <div className="p-4 text-center font-bold text-sm">
          //       <TokenImport address={search as Address} from={from} />
          //     </div>
          //   )
          // )
          .with({ filteredTokens: P.when((x) => x.length === 0) }, () => (
            <div className="p-4 text-center font-bold text-sm">
              {t("tokens.noneFound")}
            </div>
          ))
          .with({ filteredTokens: P.when((x) => x.length > 0) }, () =>
            filteredTokens.map(({ token, balance }) => (
              <Token
                key={token[1]?.address ?? token[5]?.address ?? "0x"}
                token={token}
                from={from}
                balance={balance}
                onClick={() => onClickToken(token)}
              />
            ))
          )
          .otherwise(() => null)}
      </div>
    </>
  );
};
