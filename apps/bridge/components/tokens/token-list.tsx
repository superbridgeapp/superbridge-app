import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";
import { Address, isAddress, isAddressEqual } from "viem";

import { Input } from "@/components/ui/input";
import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useTokenBalances } from "@/hooks/use-balances";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useModal } from "@/hooks/use-modal";
import { useTrackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";
import { MultiChainToken } from "@/types/token";

import { TokenIcon } from "../token-icon";
import { TokenImport } from "./token-import";
import { TokenItem } from "./token-item";

const highlightedTokenStyles: { [symbol: string]: string | undefined } = {
  wstETH:
    "bg-gradient-to-r from-sky-400/20 to-indigo-400/20 border-indigo-400/40",
};

export const TokenList = () => {
  const [search, setSearch] = useState("");

  const from = useFromChain();
  const to = useToChain();
  const deployment = useDeployment();
  const setToken = useConfigState.useSetToken();
  const tokens = useTokenBalances();
  const { t } = useTranslation();
  const modal = useModal("TokenSelector");
  const highlightedTokens =
    useInjectedStore((s) => s.superbridgeConfig)?.highlightedTokens ?? [];
  const trackEvent = useTrackEvent();

  const filteredTokens = tokens.data?.filter(({ token }) => {
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
    const fromToken = t[from?.id ?? 0];
    const toToken = t[to?.id ?? 0];

    if (!fromToken || !toToken) {
      return;
    }

    setToken(t);
    modal.close();

    if (
      highlightedTokens.find(
        (x) =>
          x.deploymentName === deployment?.name &&
          t[deployment.l1ChainId]?.address.toLowerCase() ===
            x.address.toLowerCase()
      )
    ) {
      trackEvent({
        event: "highlighted-token-select",
        symbol: t[from?.id ?? 0]?.symbol ?? "",
        network: from?.name ?? "",
      });
    } else {
      trackEvent({
        event: "token-select",
        symbol: t[from?.id ?? 0]?.symbol ?? "",
        network: from?.name ?? "",
      });
    }
  };

  return (
    <>
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
            ...highlightedTokens
              .filter((x) => x.deploymentName === deployment?.name)
              .map((x) => x.address),
            "ETH",
            "USDC",
            "stETH",
            "USDT",
          ]
            .filter(Boolean)
            .map((symbolOrAddress) => {
              const token = tokens.data?.find((t) => {
                const l1 = t.token[deployment?.l1.id ?? 0];
                const l2 = t.token[deployment?.l2.id ?? 0];

                return (
                  l2?.symbol === symbolOrAddress ||
                  (!!l1?.address &&
                    isAddress(symbolOrAddress) &&
                    isAddressEqual(l1.address as Address, symbolOrAddress))
                );
              })?.token;

              const fromToken = token?.[from?.id ?? 0];
              if (!token || !fromToken) {
                return null;
              }

              return (
                <div
                  key={fromToken.address}
                  className={clsx(
                    "border rounded-full flex items-center gap-1 pl-1.5 pr-3 py-1 cursor-pointer hover:bg-muted transition",
                    highlightedTokenStyles[fromToken.symbol]
                  )}
                  onClick={() => onClickToken(token)}
                >
                  <TokenIcon token={fromToken} className="h-5 w-5" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm inline-flex">
                      {fromToken.symbol}
                    </span>
                    {highlightedTokenStyles[fromToken.symbol] && (
                      <span className="text-[9px] font-heading tracking-tighter text-black/30 dark:text-white/40">
                        Ad
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="overflow-y-scroll flex flex-col basis-full">
        {match({ filteredTokens, searchIsToken: isAddress(search) })
          .with(
            {
              filteredTokens: P.when((x) => x?.length === 0),
              searchIsToken: true,
            },
            () => <TokenImport address={search as Address} />
          )
          .with({ filteredTokens: P.when((x) => x?.length === 0) }, () => (
            <div className="pt-8 pb-12 text-center font-heading text-sm">
              <span>{t("tokens.noneFound")}</span>
            </div>
          ))
          .with(
            { filteredTokens: P.when((x) => x?.length && x.length > 0) },
            () =>
              filteredTokens?.map(({ token, balance }) => (
                <TokenItem
                  key={token[from!.id]!.address}
                  token={token[from!.id]!}
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
