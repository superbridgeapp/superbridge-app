import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";
import { Address, Chain, formatUnits, isAddress } from "viem";

import { ChainDto } from "@/codegen/model";
import { Input } from "@/components/ui/input";
import { useTokenBalances } from "@/hooks/use-balances";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { useIsCustomToken } from "@/hooks/use-is-custom-token";
import { useIsCustomTokenFromList } from "@/hooks/use-is-custom-token-from-list";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { MultiChainToken } from "@/types/token";
import { formatDecimals } from "@/utils/format-decimals";
import { isNativeUsdc } from "@/utils/is-usdc";

import { CctpBadge } from "../cttp-badge";
import { TokenIcon } from "../token-icon";
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
  const { t } = useTranslation();
  const selectedToken = useSelectedToken();

  const fast = useConfigState.useFast();

  const isCustomToken = useIsCustomToken(token);
  const isCustomTokenFromList = useIsCustomTokenFromList(token);

  return (
    <div
      className={clsx(
        "flex justify-between hover:bg-muted transition cursor-pointer p-4 relative",
        token[from?.id ?? 0]?.address === selectedToken?.address && "bg-muted"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <TokenIcon token={token[from?.id ?? 0] ?? null} className="h-8 w-8" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-heading">
              {token[from?.id ?? 0]?.name}
            </span>
            {isNativeUsdc(token) && !fast && <CctpBadge />}
          </div>
          <span className="text-xs  text-muted-foreground">
            {token[from?.id ?? 0]?.symbol}
          </span>
        </div>
      </div>
      <div className="ml-auto flex flex-col text-right gap-1">
        <span className="text-sm  text-muted-foreground">
          {parseFloat(
            formatUnits(balance, token[from?.id ?? 0]?.decimals ?? 18)
          ).toLocaleString("en", { maximumFractionDigits: 4 })}
        </span>
        {(isCustomToken || isCustomTokenFromList) && (
          <div className="flex gap-1 bg-orange-50 dark:bg-orange-900 items-center px-2 py-1 rounded-full">
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
            <span className="text-[10px]  font-heading leading-4 text-orange-500 whitespace-nowrap">
              {isCustomToken
                ? t("tokens.customImport")
                : t("tokens.customImportFromList", {
                    name: isCustomTokenFromList,
                  })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const TokenImport = ({ address }: { address: Address }) => {
  const { t } = useTranslation();
  const showCustomImportModal =
    useConfigState.useSetShowCustomTokenImportModal();

  const deployment = useDeployment();
  const {
    balance,
    isOptimismToken,
    isArbitrumToken,
    isValidToken,
    name,
    symbol,
    decimals,
    isL1Token,

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
      <div className="pt-8 pb-12 text-center font-heading text-sm">
        <span>Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-8 pb-12 text-center font-heading text-sm">
        <span>Error...</span>
      </div>
    );
  }

  if (!isValidToken) {
    if (isL1Token) {
      return (
        <div className="py-8 px-4 text-center font-heading text-xs space-y-2">
          <div>
            This looks like a token on {deployment?.l1.name}. You need to enter
            the contract address for a token on {deployment?.l2.name}.
          </div>

          <div>
            See our{" "}
            <a
              target="_blank"
              href="https://docs.superbridge.app/custom-tokens"
              className="underline"
            >
              documentation
            </a>{" "}
            for more info on bridging unsupported tokens.
          </div>
        </div>
      );
    }

    return (
      <div className="pt-8 pb-12 text-center font-heading text-sm">
        <span>Invalid token</span>
      </div>
    );
  }

  return (
    <div className="flex justify-between hover:bg-black/[0.025] hover:dark:bg-white/[0.05] transition p-4 rounded-sm">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 h-8 w-8 flex items-center justify-center">
          <span className="text-[10px]  font-heading text-muted-foreground leading-4 mt-0.5">
            {symbol?.substring(0, 3)}
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-heading">{name}</span>
          </div>
          <span className="text-xs  text-muted-foreground">{symbol}</span>
        </div>
      </div>
      <div className="ml-auto flex flex-col text-right gap-1">
        <span className="text-sm  text-muted-foreground">
          {formatDecimals(
            parseFloat(formatUnits(BigInt(balance ?? "0"), decimals ?? 0))
          )}
        </span>
        {!isOptimismToken && !isArbitrumToken && (
          <div className="flex gap-1 bg-orange-50 dark:bg-orange-900 items-center px-2 py-1 rounded-full">
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
            <span className="text-[10px]  font-heading leading-4 text-orange-500 ">
              {t("tokens.notBridgeable")}
            </span>
          </div>
        )}
      </div>
      {(isOptimismToken || isArbitrumToken) && (
        <div className="ml-4">
          <Button onClick={onImportToken}>{t("tokens.import")}</Button>
        </div>
      )}
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
  const deployment = useDeployment();
  const setToken = useConfigState.useSetToken();
  const fast = useConfigState.useFast();
  const tokens = useTokenBalances(from?.id);
  const { t } = useTranslation();

  const filteredTokens = tokens.data.filter(({ token }) => {
    if (!search) {
      return true;
    }

    const fromT = token[from?.id ?? 0];
    const toT = token[to?.id ?? 0];

    return (
      fromT?.name.toLowerCase().includes(search.toLowerCase()) ||
      fromT?.symbol.toLowerCase().includes(search.toLowerCase()) ||
      fromT?.address.toLowerCase().includes(search.toLowerCase()) ||
      toT?.name.toLowerCase().includes(search.toLowerCase()) ||
      toT?.symbol.toLowerCase().includes(search.toLowerCase()) ||
      toT?.address.toLowerCase().includes(search.toLowerCase())
    );
  });

  const onClickToken = (t: MultiChainToken) => {
    setToken(t);
    setOpen(false);
  };

  return (
    <>
      {!fast && (
        <div className="flex flex-col gap-2 p-4 border-b ">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            name="token"
            id="token"
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
            ]
              .filter(Boolean)
              .map((symbol) => {
                const token = tokens.data.find(
                  (t) => t.token[deployment?.l2.id ?? 0]?.symbol === symbol
                )?.token;
                const fromToken = token?.[from?.id ?? 0];
                if (!token || !fromToken) {
                  return null;
                }

                return (
                  <div
                    key={fromToken.address}
                    className="border rounded-full flex items-center space-x-1 px-2 pr-3 py-1  cursor-pointer hover:bg-muted transition"
                    onClick={() => onClickToken(token)}
                  >
                    <TokenIcon token={fromToken} className="h-5 w-5" />
                    <span className="text-sm inline-flex">
                      {fromToken.symbol}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

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
            <div className="pt-8 pb-12 text-center font-heading text-sm">
              <span>{t("tokens.noneFound")}</span>
            </div>
          ))
          .with({ filteredTokens: P.when((x) => x.length > 0) }, () =>
            filteredTokens.map(({ token, balance }) => (
              <TokenComponent
                key={token[from?.id ?? 0]?.address}
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
