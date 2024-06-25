import clsx from "clsx";
import Image from "next/image";

import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { ModalNames } from "@/constants/modal-names";
import { useToChain } from "@/hooks/use-chain";
import { useTokenPrice } from "@/hooks/use-prices";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { useAcrossFee } from "@/hooks/across/use-across-fee";
import { Skeleton } from "../ui/skeleton";

export const FeeLineItem = () => {
  const to = useToChain();

  const stateToken = useConfigState.useToken();
  const currency = useSettingsState.useCurrency();
  const openModal = useConfigState.useAddModal();

  const usdPrice = useTokenPrice(stateToken);

  const acrossFee = useAcrossFee();

  return (
    <div
      className={clsx(
        "flex items-center justify-between px-3 py-2 md:py-3 cursor-pointer"
      )}
      onClick={() => openModal(ModalNames.FeeBreakdown)}
    >
      <div className="flex justify-center gap-2">
        <Image
          alt={"/img/icon-superfast.svg"}
          src={"/img/icon-superfast.svg"}
          height={16}
          width={16}
          className="w-4 h-4"
        />
        <span className={`text-foreground text-xs `}>Superfast fee</span>
      </div>

      <div className="flex items-center">
        {acrossFee.isFetching ? (
          <Skeleton className="h-4 w-[88px]" />
        ) : (
          <>
            <span className={`text-muted-foreground ml-auto text-xs  mr-2`}>
              {acrossFee.data && usdPrice
                ? `${currencySymbolMap[currency]}${(
                    acrossFee.data * usdPrice
                  ).toLocaleString("en")}`
                : undefined}
            </span>
            <span className={`text-xs text-foreground text-right`}>
              {acrossFee.data ? (
                `${acrossFee.data.toLocaleString("en", {
                  maximumFractionDigits: 4,
                })} ${stateToken?.[to?.id ?? 0]?.symbol}`
              ) : (
                <Skeleton className="h-4 w-[88px] animate-none" />
              )}
            </span>
          </>
        )}

        <button className="ml-2 transition-all hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="w-4 h-4 fill-foreground"
          >
            <g clip-path="url(#clip0_47_568)">
              <path d="M7.00133 0C3.13393 0 0 3.13393 0 7.00133C0 10.8687 3.13393 14.0027 7.00133 14.0027C10.8687 14.0027 14.0027 10.8687 14.0027 7.00133C14.0027 3.13393 10.8687 0 7.00133 0ZM7.75881 10.426C7.67613 10.578 7.56144 10.6954 7.41475 10.7781C7.26805 10.8607 7.09735 10.9034 6.90798 10.9034C6.71861 10.9034 6.55325 10.8607 6.40655 10.7781C6.25986 10.6954 6.14517 10.578 6.06249 10.426C5.97981 10.274 5.9398 10.1033 5.9398 9.90855C5.9398 9.71385 5.98247 9.55115 6.06516 9.40179C6.14784 9.25243 6.26519 9.13241 6.41189 9.04706C6.55858 8.96171 6.72395 8.91903 6.91065 8.91903C7.09735 8.91903 7.26272 8.96171 7.41208 9.04706C7.56144 9.13241 7.6788 9.24976 7.76148 9.40179C7.84416 9.55382 7.88684 9.72185 7.88684 9.90855C7.88684 10.0953 7.84683 10.2766 7.76415 10.426H7.75881ZM9.30311 6.04648C9.16708 6.3212 8.96171 6.57725 8.68966 6.8173L8.46561 7.00934C8.21223 7.22538 8.02286 7.40141 7.8975 7.54277C7.77215 7.68413 7.6948 7.83349 7.66279 7.99352C7.61478 8.17756 7.5241 8.31092 7.38807 8.39627C7.25472 8.48162 7.09202 8.52429 6.89998 8.52429C6.68127 8.52429 6.51057 8.46561 6.39055 8.35092C6.26786 8.23357 6.20918 8.07087 6.20918 7.8575C6.20918 7.60678 6.27319 7.35073 6.39855 7.08935C6.52658 6.82797 6.72928 6.57992 7.00934 6.34788L7.26538 6.14517C7.41475 6.03315 7.52943 5.9398 7.61212 5.86512C7.6948 5.78777 7.76148 5.70242 7.81482 5.60373C7.86817 5.50772 7.89484 5.39836 7.89484 5.27567C7.89484 5.03563 7.80682 4.84892 7.63345 4.71556C7.46009 4.58221 7.22804 4.51553 6.93999 4.51553C6.67594 4.51553 6.44923 4.59554 6.25719 4.75557C6.06516 4.9156 5.92646 5.12898 5.83578 5.39569C5.77443 5.56639 5.67308 5.69708 5.53705 5.79044C5.40103 5.88379 5.233 5.9318 5.03829 5.9318C4.84359 5.9318 4.68089 5.85712 4.56087 5.71042C4.44085 5.56373 4.38217 5.38503 4.38217 5.17699C4.38217 5.01429 4.41951 4.83559 4.49419 4.64088C4.56887 4.44618 4.65689 4.28615 4.75824 4.16079C5.00362 3.84873 5.32101 3.60602 5.70509 3.43265C6.09183 3.25929 6.54525 3.17127 7.07068 3.17127C7.54277 3.17127 7.96418 3.25662 8.33492 3.42465C8.70566 3.59268 8.99105 3.82473 9.19642 4.11812C9.40179 4.41151 9.50314 4.7369 9.50314 5.0943C9.50314 5.4517 9.43646 5.77443 9.30044 6.04648H9.30311Z" />
            </g>
            <defs>
              <clipPath id="clip0_47_568">
                <rect width="14" height="14" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </div>
  );
};
