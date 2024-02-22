import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";
import { Address, formatUnits, isAddress } from "viem";
import { Chain } from "wagmi";

import { ChainDto } from "@/codegen/model";
import { deploymentTheme } from "@/config/theme";
import { useTokenBalances } from "@/hooks/use-balances";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { MultiChainToken } from "@/types/token";
import { isNativeUsdc } from "@/utils/is-usdc";

import { Button } from "../ui/button";
import { useCustomToken } from "./use-custom-token";

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
  const customTokens = useSettingsState.useCustomTokens();

  const isCustomToken = customTokens.find(
    (x) => x[from?.id ?? 0]?.address === token[from?.id ?? 0]?.address
  );

  return (
    <div
      className={clsx(
        "flex justify-between hover:bg-black/[0.025] hover:dark:bg-white/[0.05] transition cursor-pointer p-4 relative",
        token[from?.id ?? 0]?.address === selectedToken?.address &&
          "bg-black/[0.025] dark:bg-white/[0.05]"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        {/* TODO: do we need a fallback to the text thing here */}
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
      <div className="ml-auto flex flex-col text-right gap-1">
        <span className="text-sm font-medium text-zinc-400">
          {parseFloat(
            formatUnits(balance, token[from?.id ?? 0]?.decimals ?? 18)
          ).toLocaleString("en", { maximumFractionDigits: 3 })}
        </span>
        {isCustomToken && (
          <div className="flex gap-1 bg-orange-50 items-center px-2 py-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <g clip-path="url(#clip0_995_5016)">
                <path
                  d="M5.68325 4.28632C5.68325 4.02007 5.80325 3.87195 6.05263 3.87195C6.302 3.87195 6.42763 4.02007 6.42763 4.28632C6.42763 4.55257 6.15575 6.8982 6.09763 7.3407C6.092 7.39132 6.08075 7.44195 6.05263 7.44195C6.0245 7.44195 6.01325 7.40257 6.00763 7.3332C5.957 6.89632 5.68325 4.54132 5.68325 4.28445V4.28632ZM5.68325 9.40507C5.68325 9.20632 5.84825 9.04132 6.05263 9.04132C6.257 9.04132 6.41638 9.20632 6.41638 9.40507C6.41638 9.60382 6.25138 9.77445 6.05263 9.77445C5.85388 9.77445 5.68325 9.60945 5.68325 9.40507ZM1.2545 11.4038H10.8414C11.5801 11.4038 11.9364 10.8188 11.5914 10.1832L6.77263 1.28257C6.38638 0.573823 5.72825 0.573823 5.342 1.27695L0.506377 10.1776C0.165127 10.8132 0.517627 11.4038 1.25638 11.4038H1.2545Z"
                  fill="#F97316"
                />
                <path
                  d="M5.00074 4.28625C5.00074 4.58625 5.29512 6.94313 5.37012 7.4475C5.43199 7.87875 5.70012 8.1225 6.05074 8.1225C6.42574 8.1225 6.66387 7.845 6.72574 7.4475C6.85137 6.66375 7.10637 4.58625 7.10637 4.28625C7.10637 3.72375 6.67512 3.19125 6.05074 3.19125C5.42637 3.19125 5.00074 3.73125 5.00074 4.28625ZM6.05637 10.4606C6.63012 10.4606 7.10074 9.99 7.10074 9.39938C7.10074 8.80875 6.63012 8.355 6.05637 8.355C5.48262 8.355 4.99512 8.82563 4.99512 9.39938C4.99512 9.97313 5.46574 10.4606 6.05637 10.4606Z"
                  fill="#FFEDD5"
                />
              </g>
              <defs>
                <clipPath id="clip0_995_5016">
                  <rect
                    width="11.3494"
                    height="10.6537"
                    fill="white"
                    transform="translate(0.375 0.75)"
                  />
                </clipPath>
              </defs>
            </svg>
            <span className="text-[10px] tracking-tighter font-bold leading-4 text-orange-500 ">
              Custom import
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const TokenImport = ({ address }: { address: Address }) => {
  const showCustomImportModal =
    useConfigState.useSetShowCustomTokenImportModal();

  const deployment = useConfigState.useDeployment();
  const theme = deploymentTheme(deployment);
  const {
    balance,
    isOptimismToken,
    isArbitrumToken,
    isValidToken,
    name,
    symbol,
    decimals,

    isLoading,
    isError,
  } = useCustomToken(address);

  const onImportToken = () => {
    if (!isArbitrumToken && !isOptimismToken) {
      return;
    }

    if (!deployment || !isValidToken) {
      return;
    }

    showCustomImportModal(address);
    return;
  };

  if (isLoading) {
    return (
      <div className="pt-8 pb-12 text-center font-bold text-sm">
        <span>Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-8 pb-12 text-center font-bold text-sm">
        <span>Error...</span>
      </div>
    );
  }

  if (!isValidToken) {
    return <div>Invalid token</div>;
  }

  if (!isArbitrumToken && !isOptimismToken) {
    return (
      <div className="pt-8 pb-12 text-center font-bold text-sm">
        <span>Invalid token</span>
      </div>
    );
  }

  return (
    <div className="flex justify-between hover:bg-zinc-50 transition p-4 rounded-sm">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 h-8 w-8 flex items-center justify-center">
          <span className="text-[10px] tracking-tighter font-bold text-zinc-400 leading-4 mt-0.5">
            {symbol?.substring(0, 3)}
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">{name}</span>
          </div>
          <span className="text-xs font-medium text-zinc-400">{symbol}</span>
        </div>
      </div>
      <div className="ml-auto flex flex-col text-right gap-1">
        <span className="text-sm font-medium text-zinc-400">
          {parseFloat(
            formatUnits(BigInt(balance ?? "0"), decimals ?? 0)
          ).toLocaleString("en", {
            maximumFractionDigits: 3,
          })}
        </span>
        {(!isOptimismToken && !isArbitrumToken) ?? (
          <div className="flex gap-1 bg-orange-50 items-center px-2 py-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <g clip-path="url(#clip0_995_5016)">
                <path
                  d="M5.68325 4.28632C5.68325 4.02007 5.80325 3.87195 6.05263 3.87195C6.302 3.87195 6.42763 4.02007 6.42763 4.28632C6.42763 4.55257 6.15575 6.8982 6.09763 7.3407C6.092 7.39132 6.08075 7.44195 6.05263 7.44195C6.0245 7.44195 6.01325 7.40257 6.00763 7.3332C5.957 6.89632 5.68325 4.54132 5.68325 4.28445V4.28632ZM5.68325 9.40507C5.68325 9.20632 5.84825 9.04132 6.05263 9.04132C6.257 9.04132 6.41638 9.20632 6.41638 9.40507C6.41638 9.60382 6.25138 9.77445 6.05263 9.77445C5.85388 9.77445 5.68325 9.60945 5.68325 9.40507ZM1.2545 11.4038H10.8414C11.5801 11.4038 11.9364 10.8188 11.5914 10.1832L6.77263 1.28257C6.38638 0.573823 5.72825 0.573823 5.342 1.27695L0.506377 10.1776C0.165127 10.8132 0.517627 11.4038 1.25638 11.4038H1.2545Z"
                  fill="#F97316"
                />
                <path
                  d="M5.00074 4.28625C5.00074 4.58625 5.29512 6.94313 5.37012 7.4475C5.43199 7.87875 5.70012 8.1225 6.05074 8.1225C6.42574 8.1225 6.66387 7.845 6.72574 7.4475C6.85137 6.66375 7.10637 4.58625 7.10637 4.28625C7.10637 3.72375 6.67512 3.19125 6.05074 3.19125C5.42637 3.19125 5.00074 3.73125 5.00074 4.28625ZM6.05637 10.4606C6.63012 10.4606 7.10074 9.99 7.10074 9.39938C7.10074 8.80875 6.63012 8.355 6.05637 8.355C5.48262 8.355 4.99512 8.82563 4.99512 9.39938C4.99512 9.97313 5.46574 10.4606 6.05637 10.4606Z"
                  fill="#FFEDD5"
                />
              </g>
              <defs>
                <clipPath id="clip0_995_5016">
                  <rect
                    width="11.3494"
                    height="10.6537"
                    fill="white"
                    transform="translate(0.375 0.75)"
                  />
                </clipPath>
              </defs>
            </svg>
            <span className="text-[10px] tracking-tighter font-bold leading-4 text-orange-500 ">
              Not bridgeable
            </span>
          </div>
        )}
      </div>
      <div className="ml-4">
        <Button
          onClick={onImportToken}
          className={`flex w-full justify-center rounded-full h-8 px-3  text-xs tracking-tight font-bold leading-3 text-white shadow-sm ${theme.accentText} ${theme.accentBg}`}
        >
          Import
        </Button>
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
      <div className="flex flex-col gap-2 p-4 border-b border-zinc-100 dark:border-zinc-900">
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
          } block w-full rounded-lg border-0 py-3 px-4 pr-10 text-sm font-medium text-zinc-900 dark:text-zinc-50 text-zinc-900 outline-none focus:ring-2 ring-inset ring-zinc-900/5 dark:ring-zinc-50/5 placeholder:text-zinc-400 sm:leading-6`}
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
            () => <TokenImport address={search as Address} />
          )
          .with({ filteredTokens: P.when((x) => x.length === 0) }, () => (
            <div className="pt-8 pb-12 text-center font-bold text-sm">
              <span>{t("tokens.noneFound")}</span>
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
