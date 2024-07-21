import clsx from "clsx";
import Image from "next/image";

import { ModalNames } from "@/constants/modal-names";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useFees } from "@/hooks/use-fees";
import { useTokenPrice } from "@/hooks/use-prices";
import { useSelectedBridgeRoute } from "@/hooks/use-selected-bridge-route";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";

import { IconHelp } from "../icons";
import { Skeleton } from "../ui/skeleton";

export const FeeLineItem = () => {
  const to = useToChain();
  const from = useFromChain();

  const stateToken = useConfigState.useToken();
  const currency = useSettingsState.useCurrency();
  const openModal = useConfigState.useAddModal();

  const usdPrice = useTokenPrice(stateToken);

  const route = useSelectedBridgeRoute();
  const fees = useFees();

  return (
    <div
      className={clsx(
        "flex items-center justify-between px-3 py-2 md:py-3",
        !!fees.data && fees.data.totals.token > 0 && "cursor-pointer"
      )}
      onClick={
        !!fees.data && fees.data.totals.token > 0
          ? () => openModal(ModalNames.FeeBreakdown)
          : undefined
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
        <span className={`text-foreground text-xs `}>Fees</span>
      </div>

      <div className="flex items-center">
        {route.isLoading ? (
          <Skeleton className="h-4 w-[88px]" />
        ) : (
          <>
            <span className={`text-muted-foreground ml-auto text-xs  mr-2`}>
              {fees.data?.totals.fiatFormatted}
            </span>
            <span className={`text-xs text-foreground text-right`}>
              {fees.data?.totals.tokenFormatted}
            </span>
          </>
        )}

        {!!fees.data && fees.data.totals.token > 0 && (
          <div className="ml-1 transition-all hover:scale-105">
            <IconHelp className="w-3.5 h-3.5 fill-muted-foreground opacity-50" />
          </div>
        )}
      </div>
    </div>
  );
};
