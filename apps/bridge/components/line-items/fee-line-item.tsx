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
import { IconHelp } from "../icons";

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
        "flex items-center justify-between px-3 py-2 md:py-3",
        !!acrossFee.data && "cursor-pointer"
      )}
      onClick={
        !!acrossFee.data ? () => openModal(ModalNames.FeeBreakdown) : undefined
      }
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
            {acrossFee.data ? (
              <span className={`text-xs text-foreground text-right`}>
                {acrossFee.data.toLocaleString("en", {
                  maximumFractionDigits: 4,
                })}{" "}
                {stateToken?.[to?.id ?? 0]?.symbol}
              </span>
            ) : (
              <span className={`text-xs text-muted-foreground text-right`}>
                …
              </span>
            )}
          </>
        )}

        {!!acrossFee.data && (
          <div className="ml-1 transition-all hover:scale-105">
            <IconHelp className="w-3.5 h-3.5 fill-muted-foreground opacity-50" />
          </div>
        )}
      </div>
    </div>
  );
};
