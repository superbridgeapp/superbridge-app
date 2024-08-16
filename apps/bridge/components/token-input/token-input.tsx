import { useTranslation } from "react-i18next";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

import { useActiveTokens } from "@/hooks/tokens";
import { useIsCustomToken } from "@/hooks/tokens/use-is-custom-token";
import { useIsCustomTokenFromList } from "@/hooks/tokens/use-is-custom-token-from-list";
import { useSelectedToken } from "@/hooks/tokens/use-token";
import { useTokenBalance } from "@/hooks/use-balances";
import { useGetFormattedAmount } from "@/hooks/use-get-formatted-amount";
import { useModal } from "@/hooks/use-modal";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";
import { formatDecimals } from "@/utils/format-decimals";
import { isEth } from "@/utils/tokens/is-eth";

import { IconAlert, IconCaretDown } from "../icons";
import { TokenIcon } from "../token-icon";
import { Skeleton } from "../ui/skeleton";
import { Recipient } from "./recipient";

export const TokenInput = () => {
  const token = useSelectedToken();
  const { t } = useTranslation();
  const tokens = useActiveTokens();

  const rawAmount = useConfigState.useRawAmount();
  const setRawAmount = useConfigState.useSetRawAmount();
  const tokenSelectorModal = useModal("TokenSelector");
  const weiAmount = useWeiAmount();

  const tokenBalance = useTokenBalance(token);
  const getFormattedAmount = useGetFormattedAmount(token);

  const isCustomToken = useIsCustomToken(token);
  const isCustomTokenFromList = useIsCustomTokenFromList(token);

  const account = useAccount();

  const formattedTokenBalance = formatUnits(
    tokenBalance.data,
    token?.decimals ?? 18
  );

  const amount = getFormattedAmount(weiAmount.toString());

  return (
    <div
      className={`flex flex-col gap-1.5 relative rounded-xl px-4 py-3 border border-transparent focus-within:border-border transition-colors bg-muted `}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-heading">Send</span>
        <Recipient />
      </div>
      <div className="flex gap-1 items-center">
        <input
          value={rawAmount}
          onChange={(e) => {
            const parsed = e.target.value.replaceAll(",", ".");
            setRawAmount(parsed);
          }}
          type="text"
          inputMode="decimal"
          minLength={1}
          maxLength={79}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          pattern="^[0-9]*[.,]?[0-9]*$"
          name="amount"
          id="amount"
          className={`block w-full shadow-none bg-transparent focus:outline-none text-4xl leading-none placeholder:text-muted-foreground text-foreground`}
          placeholder="0"
        />

        {tokens.isFetching || !token ? (
          <div
            className={`flex shrink-0 relative gap-1 rounded-full py-2 pl-3 pr-3 items-center font-button transition-all text-foreground bg-card`}
          >
            <Skeleton className="h-[25px] w-[25px] rounded-full" />
            <Skeleton className="h-[14px] w-[50px]" />
          </div>
        ) : tokens.data?.length === 1 ? (
          <div
            className={`flex shrink-0 relative gap-1 rounded-full py-2 pl-3 pr-4 items-center font-button transition-all text-foreground bg-card`}
          >
            <TokenIcon token={token} className="h-[20px] w-[20px] shrink-0" />
            {token?.symbol}
          </div>
        ) : (
          <button
            onClick={() => tokenSelectorModal.open()}
            className={`flex shrink-0 relative gap-1 rounded-full py-2 pl-3 pr-3 items-center font-button transition-all hover:scale-105 text-foreground bg-card`}
          >
            <TokenIcon token={token} className="h-[20px] w-[20px] shrink-0" />
            {token?.symbol}
            <IconCaretDown className="w-3.5 h-3.5 fill-foreground" />
            {(isCustomToken || isCustomTokenFromList) && (
              <IconAlert className="absolute top-4 left-6 w-3 h-3" />
            )}
          </button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>
          {amount.fiat && (
            <span className="text-muted-foreground text-xs leading-none">
              {amount.fiat.formatted}
            </span>
          )}
        </div>

        {account.address && (
          <div className="flex items-center gap-1">
            {tokenBalance.isLoading ? (
              <Skeleton className="h-4 w-[88px] bg-muted-foreground" />
            ) : (
              <>
                <span className={`text-muted-foreground text-xs leading-none`}>
                  {t("availableBalance", {
                    amount: formatDecimals(parseFloat(formattedTokenBalance)),
                    symbol: token?.symbol,
                  })}
                </span>

                {!isEth(token) && (
                  <button
                    onClick={() => setRawAmount(formattedTokenBalance)}
                    className="text-[10px] font-button bg-card rounded-full px-1.5 py-1 leading-none text-muted-foreground transition-all hover:scale-105"
                  >
                    Max
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
