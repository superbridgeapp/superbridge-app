import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";
import { Address, formatUnits, isAddress } from "viem";
import { Chain, erc20ABI, useAccount, useContractReads } from "wagmi";

import { L2StandardBridgeAbi } from "@/abis/L2StandardBridge";
import { OptimismMintableERC20Abi } from "@/abis/OptimismMintableERC20";
import { ChainDto } from "@/codegen/model";
import { deploymentTheme } from "@/config/theme";
import { useTokenBalances } from "@/hooks/use-balances";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { MultiChainToken, OptimismToken, Token } from "@/types/token";
import { isNativeUsdc } from "@/utils/is-usdc";
import { useSettingsState } from "@/state/settings";

const TokenComponent = ({
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
        <img
          src={token[from?.id ?? 0]?.logoURI}
          className="h-8 w-8 rounded-full bg-zinc-50 overflow-hidden"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">
              {token[from?.id ?? 0]?.name}
            </span>
            {isNativeUsdc(token) && (
              <span className="px-1 font-bold text-[9px] bg-zinc-100 text-zinc-400 dark:bg-zinc-800 rounded-lg">
                CCTP
              </span>
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

const TokenImport = ({
  address,
  onChooseToken,
}: {
  address: Address;
  onChooseToken: (o: MultiChainToken) => void;
}) => {
  const customTokens = useSettingsState.useCustomTokens();
  const setCustomTokens = useSettingsState.useSetCustomTokens();

  const deployment = useConfigState.useDeployment();
  const account = useAccount();
  const reads = useContractReads({
    allowFailure: true,
    contracts: [
      {
        address,
        abi: erc20ABI,
        chainId: deployment?.l2.id,
        functionName: "name",
      },
      {
        address,
        abi: erc20ABI,
        chainId: deployment?.l2.id,
        functionName: "symbol",
      },
      {
        address,
        abi: erc20ABI,
        chainId: deployment?.l2.id,
        functionName: "decimals",
      },
      {
        address,
        abi: erc20ABI,
        chainId: deployment?.l2.id,
        functionName: "balanceOf",
        args: [account?.address ?? "0x"],
      },
      {
        address,
        abi: OptimismMintableERC20Abi,
        chainId: deployment?.l2.id,
        functionName: "BRIDGE",
      },
      {
        address,
        abi: OptimismMintableERC20Abi,
        chainId: deployment?.l2.id,
        functionName: "REMOTE_TOKEN",
      },
    ],
  });
  const name = reads?.data?.[0].result;
  const symbol = reads?.data?.[1].result;
  const decimals = reads?.data?.[2].result;
  const balance = reads?.data?.[3].result;
  const L2_BRIDGE = reads?.data?.[4].result;
  const L1_TOKEN = reads?.data?.[5].result;

  const reads2 = useContractReads({
    allowFailure: true,
    contracts: [
      {
        address: L2_BRIDGE,
        abi: L2StandardBridgeAbi,
        chainId: deployment?.l2.id,
        functionName: "OTHER_BRIDGE",
      },
    ],
  });
  const L1_BRIDGE = reads2?.data?.[0].result as Address | undefined;

  const isValidToken = !!name && !!symbol && typeof decimals === "number";
  const isOptimismMintableToken = !!L2_BRIDGE && !!L1_BRIDGE && !!L1_TOKEN;

  const onImportToken = () => {
    if (!deployment || !isValidToken || !isOptimismMintableToken) {
      return;
    }

    const l1Token: OptimismToken = {
      address: L1_TOKEN,
      chainId: deployment.l1.id,
      decimals,
      name,
      symbol,
      opTokenId: `custom-${symbol}`,
      logoURI: "",
      standardBridgeAddresses: {
        [deployment.l2.id]: L1_BRIDGE,
      },
    };
    const l2Token: OptimismToken = {
      address,
      chainId: deployment.l2.id,
      decimals,
      name,
      symbol,
      opTokenId: `custom-${symbol}`,
      logoURI: "",
      standardBridgeAddresses: {
        [deployment.l1.id]: L2_BRIDGE,
      },
    };
    const token: MultiChainToken = {
      [deployment.l1.id]: l1Token,
      [deployment.l2.id]: l2Token,
    };

    setCustomTokens([...customTokens, token]);
    onChooseToken(token);
  };

  if (reads.isLoading || reads2.isLoading) {
    return <div>Loading...</div>;
  }

  if (reads.isError || reads2.isError) {
    return <div>Error...</div>;
  }

  if (!isValidToken) {
    return <div>Invalid token</div>;
  }

  if (!isOptimismMintableToken) {
    return (
      <div className="flex justify-between hover:bg-zinc-50 transition cursor-pointer p-4 rounded-sm">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-zinc-100 text-zinc-800 h-8 w-8 flex items-center justify-center">
            {symbol.substring(0, 3)}
          </div>
          <div className="text-sm font-bold text-left">
            <div>{name}</div>
            <div>{symbol}</div>
          </div>
        </div>
        <div>
          {parseFloat(
            formatUnits(BigInt(balance ?? "0"), decimals)
          ).toLocaleString("en", {
            maximumFractionDigits: 3,
          })}
        </div>

        <div>NOT BRIDGEABLE</div>
      </div>
    );
  }

  return (
    <div
      className="flex justify-between hover:bg-zinc-50 transition cursor-pointer p-4 rounded-sm"
      onClick={onImportToken}
    >
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-zinc-100 text-zinc-800 h-8 w-8 flex items-center justify-center">
          {symbol.substring(0, 3)}
        </div>
        <div className="text-sm font-bold text-left">
          <div>{name}</div>
          <div>{symbol}</div>
        </div>
      </div>
      <div>
        {parseFloat(
          formatUnits(BigInt(balance ?? "0"), decimals)
        ).toLocaleString("en", {
          maximumFractionDigits: 3,
        })}
      </div>
    </div>
  );
};

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
        {match({ filteredTokens, searchIsToken: isAddress(search) })
          .with(
            {
              filteredTokens: P.when((x) => x.length === 0),
              searchIsToken: true,
            },
            () => (
              <div className="p-4 text-center font-bold text-sm">
                <TokenImport
                  address={search as Address}
                  onChooseToken={onClickToken}
                />
              </div>
            )
          )
          .with({ filteredTokens: P.when((x) => x.length === 0) }, () => (
            <div className="p-4 text-center font-bold text-sm">
              {t("tokens.noneFound")}
            </div>
          ))
          .with({ filteredTokens: P.when((x) => x.length > 0) }, () =>
            filteredTokens.map(({ token, balance }) => (
              <TokenComponent
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
