import Image from "next/image";
import { useTranslation } from "react-i18next";

import { Skeleton } from "@/components/ui/skeleton";
import { useNetworkFee } from "@/hooks/use-network-fee";

export const NetworkFees = () => {
  const { t } = useTranslation();
  const fee = useNetworkFee();

  return (
    <div>
      <div className="flex items-center justify-between px-3 py-2 md:py-3">
        <div className="flex items-center gap-2">
          <Image
            alt="fees icon"
            src="/img/fees.svg"
            className="h-4 w-4"
            height={16}
            width={16}
          />
          <span className={`text-xs `}>{t("fees.fees")}</span>
        </div>

        <div className="flex items-center gap-2">
          {fee.isLoading ? (
            <Skeleton className="h-4 w-[88px]" />
          ) : fee.data ? (
            <span className={`text-xs  text-foreground`}>
              {fee.data.fiat && (
                <span className={`text-muted-foreground ml-auto text-xs  mr-2`}>
                  {fee.data.fiat.formatted}
                </span>
              )}
              <span className={`text-xs  text-foreground`}>
                {fee.data.token.formatted}
              </span>
            </span>
          ) : (
            "…"
          )}
        </div>
      </div>
    </div>
  );
};
