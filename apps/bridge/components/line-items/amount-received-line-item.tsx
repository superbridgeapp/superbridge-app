import clsx from "clsx";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useAcrossFee } from "@/hooks/across/use-across-fee";
import { useToChain } from "@/hooks/use-chain";
import { useTokenPrice } from "@/hooks/use-prices";
import { useReceiveAmount } from "@/hooks/use-receive-amount";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { formatDecimals } from "@/utils/format-decimals";

import { NftImage } from "../nft";
import { Skeleton } from "../ui/skeleton";

export const AmountReceivedLineItem = () => {
  const to = useToChain();
  const { t } = useTranslation();

  const stateToken = useConfigState.useToken();
  const nft = useConfigState.useNft();
  const currency = useSettingsState.useCurrency();

  const usdPrice = useTokenPrice(stateToken);
  const receive = useReceiveAmount();
  const acrossFee = useAcrossFee();

  const fiatValueBeingBridged =
    usdPrice && receive.data ? receive.data * usdPrice : null;

  return (
    <div
      className={clsx("flex items-center justify-between px-3 py-2 md:py-3")}
    >
      <div className="flex justify-center gap-2">
        <Image
          alt={"/img/receive.svg"}
          src={"/img/receive.svg"}
          height={16}
          width={16}
          className="w-4 h-4"
        />
        <span className={`text-foreground text-xs `}>
          {t("receiveOnChain", { chain: to?.name })}
        </span>
      </div>

      {stateToken && (
        <>
          {acrossFee.isFetching ? (
            <Skeleton className="h-4 w-[88px]" />
          ) : (
            <>
              <span className={`text-muted-foreground ml-auto text-xs  mr-2`}>
                {fiatValueBeingBridged
                  ? `${
                      currencySymbolMap[currency]
                    }${fiatValueBeingBridged.toLocaleString("en")}`
                  : ""}
              </span>

              {receive.data ? (
                <span className={`text-xs text-foreground text-right`}>
                  {formatDecimals(receive.data)}{" "}
                  {stateToken?.[to?.id ?? 0]?.symbol}
                </span>
              ) : (
                <span className={`text-xs text-muted-foreground text-right`}>
                  …
                </span>
              )}
            </>
          )}
        </>
      )}

      {nft && (
        <div className="flex items-center gap-2">
          <div className="text-xs ">#{nft.tokenId}</div>
          <NftImage
            nft={{
              address: nft.localConfig.address,
              chainId: nft.localConfig.chainId,
              tokenId: nft.tokenId,
              image: nft.image,
              tokenUri: nft.tokenUri,
            }}
            className="h-6 w-6 rounded-sm"
          />
        </div>
      )}
    </div>
  );
};
