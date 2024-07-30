import { useTranslation } from "react-i18next";
import { formatUnits } from "viem";

import { useTokenBalance } from "@/hooks/use-balances";
import { useFromChain } from "@/hooks/use-chain";
import { useGetFormattedAmount } from "@/hooks/use-get-formatted-amount";
import { useIsCustomToken } from "@/hooks/use-is-custom-token";
import { useIsCustomTokenFromList } from "@/hooks/use-is-custom-token-from-list";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";
import { formatDecimals } from "@/utils/format-decimals";
import { isEth } from "@/utils/is-eth";

import { IconAlert, IconCaretDown } from "../icons";
import { TokenIcon } from "../token-icon";
import { Recipient } from "./recipient";

export const ERC20TokenInput = () => {
  const token = useSelectedToken();
  const { t } = useTranslation();

  const from = useFromChain();
  const rawAmount = useConfigState.useRawAmount();
  const stateToken = useConfigState.useToken();
  const setRawAmount = useConfigState.useSetRawAmount();
  const setTokensModal = useConfigState.useSetTokensModal();
  const weiAmount = useWeiAmount();

  const tokenBalance = useTokenBalance(token);
  const getFormattedAmount = useGetFormattedAmount(stateToken, from?.id);

  const isCustomToken = useIsCustomToken(stateToken);
  const isCustomTokenFromList = useIsCustomTokenFromList(stateToken);

  const formattedTokenBalance = formatUnits(
    tokenBalance,
    token?.decimals ?? 18
  );

  if (!token) {
    return null;
  }

  const amount = getFormattedAmount(weiAmount.toString());

  return (
    <div
      className={`flex flex-col gap-1.5 relative rounded-xl px-4 py-3 border-2 border-transparent focus-within:border-border transition-colors bg-muted `}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-heading">Send</span>
        <Recipient />
      </div>
      <div className="flex gap-1">
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
          className={`block w-full shadow-none bg-transparent focus:outline-none text-3xl md:text-4xl leading-none placeholder:text-muted-foreground text-foreground`}
          placeholder="0"
        />

        <button
          onClick={() => setTokensModal(true)}
          className={`flex shrink-0 relative gap-1 rounded-full pl-3 pr-3 items-center font-button transition-all hover:scale-105 text-foreground bg-card`}
        >
          <TokenIcon token={token} className="h-[20px] w-[20px] shrink-0" />
          {token?.symbol}
          <IconCaretDown className="w-3.5 h-3.5 fill-foreground" />
          {(isCustomToken || isCustomTokenFromList) && (
            <IconAlert className="absolute top-4 left-6 w-3 h-3" />
          )}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          {amount.fiat && (
            <span className="text-muted-foreground text-xs leading-none">
              {amount.fiat.formatted}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-muted-foreground text-xs leading-none`}>
            {t("availableBalance", {
              amount: formatDecimals(parseFloat(formattedTokenBalance)),
              symbol: token?.symbol,
            })}
          </span>

          {!isEth(token) && (
            <button
              onClick={() => {
                setRawAmount(formattedTokenBalance);
              }}
              className="text-[10px] font-button bg-card rounded-full px-1.5 py-1 leading-none text-muted-foreground transition-all hover:scale-105"
            >
              Max
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
