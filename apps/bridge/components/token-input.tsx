import { useTranslation } from "react-i18next";
import { formatUnits } from "viem";

import { useTokenBalance } from "@/hooks/use-balances";
import { useIsCustomToken } from "@/hooks/use-is-custom-token";
import { useIsCustomTokenFromList } from "@/hooks/use-is-custom-token-from-list";
import { useTokenPrice } from "@/hooks/use-prices";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { isNativeUsdc } from "@/utils/is-usdc";

import { CctpBadge } from "./cttp-badge";
import { TokenIcon } from "./token-icon";

export const TokenInput = () => {
  const token = useSelectedToken();
  const { t } = useTranslation();

  const withdrawing = useConfigState.useWithdrawing();
  const rawAmount = useConfigState.useRawAmount();
  const stateToken = useConfigState.useToken();
  const setRawAmount = useConfigState.useSetRawAmount();
  const fast = useConfigState.useFast();
  const setTokensModal = useConfigState.useSetTokensModal();

  const tokenBalance = useTokenBalance(token);
  const usdPrice = useTokenPrice(stateToken);

  const receive = parseFloat(rawAmount) || 0;

  const isCustomToken = useIsCustomToken(stateToken);
  const isCustomTokenFromList = useIsCustomTokenFromList(stateToken);

  if (!token) {
    return null;
  }

  return (
    <div
      className={`relative rounded-[16px] px-4 py-3 border-2 border-transparent focus-within:border-border transition-colors bg-muted `}
    >
      <label
        htmlFor="amount"
        className={`block text-sm font-heading leading-6 text-foreground`}
      >
        {fast ? "Fast bridge" : withdrawing ? t("withdraw") : t("deposit")}
      </label>
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
          className={`block w-full shadow-none bg-transparent focus:outline-none text-3xl md:text-4xl sm:leading-6 placeholder:text-muted-foreground text-foreground`}
          placeholder="0"
        />

        <button
          onClick={() => setTokensModal(true)}
          className={`flex shrink-0 relative gap-1 rounded-full pl-3 pr-3 items-center font-button transition-all hover:scale-105 text-foreground bg-card`}
        >
          <TokenIcon token={token} className="h-[20px] w-[20px] shrink-0" />
          {token?.symbol}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={14}
            height={14}
            className={`w-3.5 h-3.5 fill-foreground shrink-0`}
            viewBox="0 0 16 16"
          >
            <path d="M13.53 6.031l-5 5a.75.75 0 01-1.062 0l-5-5A.751.751 0 113.531 4.97L8 9.439l4.47-4.47a.751.751 0 011.062 1.062h-.001z"></path>
          </svg>

          {(isCustomToken || isCustomTokenFromList) && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="absolute top-4 left-6 w-3 h-3"
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
          )}
        </button>
      </div>
      <div className="pt-1 flex items-center justify-between">
        <div>
          {usdPrice && (
            <span className="text-muted-foreground text-xs">
              ${(receive * usdPrice).toLocaleString("en")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-muted-foreground text-xs`}>
            {t("availableBalance", {
              amount: parseFloat(
                formatUnits(tokenBalance, token?.decimals ?? 18)
              ).toLocaleString("en", {
                maximumFractionDigits: 4,
              }),
              symbol: token?.symbol,
            })}
          </span>
          {isNativeUsdc(stateToken) && !fast && <CctpBadge />}
        </div>
      </div>
    </div>
  );
};
