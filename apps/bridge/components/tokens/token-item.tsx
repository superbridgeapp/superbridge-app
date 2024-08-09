import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { formatUnits } from "viem";

import { useSelectedToken } from "@/hooks/tokens";
import { useIsCustomToken } from "@/hooks/tokens/use-is-custom-token";
import { useIsCustomTokenFromList } from "@/hooks/tokens/use-is-custom-token-from-list";
import { Token } from "@/types/token";
import { formatDecimals } from "@/utils/format-decimals";

import { TokenIcon } from "../token-icon";

export const TokenItem = ({
  balance,
  onClick,
  token,
}: {
  token: Token;
  balance: bigint;
  onClick: () => void;
}) => {
  const selectedToken = useSelectedToken();
  const { t } = useTranslation();

  const isCustomToken = useIsCustomToken(token);
  const isCustomTokenFromList = useIsCustomTokenFromList(token);

  return (
    <div
      className={clsx(
        "flex justify-between hover:bg-muted transition cursor-pointer p-4 relative",
        selectedToken?.address === token?.address && "bg-muted"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <TokenIcon token={token ?? null} className="h-8 w-8" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-heading">{token?.name}</span>
          </div>
          <span className="text-xs  text-muted-foreground">
            {token?.symbol}
          </span>
        </div>
      </div>
      <div className="ml-auto flex flex-col text-right gap-1">
        <span className="text-sm  text-muted-foreground">
          {formatDecimals(
            parseFloat(formatUnits(balance, token?.decimals ?? 18))
          )}
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
              <g clipPath="url(#clip0_995_5016)">
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
