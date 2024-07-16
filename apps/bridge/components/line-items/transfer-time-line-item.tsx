import clsx from "clsx";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { ModalNames } from "@/constants/modal-names";
import { useTransferTime } from "@/hooks/use-transfer-time";
import { useConfigState } from "@/state/config";

import { IconHelp } from "../icons";

export const TransferTimeLineItem = () => {
  const transferTime = useTransferTime();
  const { t } = useTranslation();

  const fast = useConfigState.useFast();
  const openModal = useConfigState.useAddModal();

  return (
    <div
      className={clsx(
        "flex items-center justify-between px-3 py-2 md:py-3",
        !!fast && "cursor-pointer"
      )}
      onClick={fast ? () => openModal(ModalNames.TransferTime) : undefined}
    >
      <div className="flex justify-center gap-2">
        <Image
          alt={"/img/transfer-time.svg"}
          src={"/img/transfer-time.svg"}
          height={16}
          width={16}
          className="w-4 h-4"
        />
        <span className={`text-foreground text-xs `}>{t("transferTime")}</span>
      </div>

      <div className="flex items-center">
        <span className={`text-xs text-foreground text-right`}>
          {transferTime}
        </span>

        {fast && (
          <div className="ml-1 transition-all hover:scale-105">
            <IconHelp className="w-3.5 h-3.5 fill-muted-foreground opacity-50" />
          </div>
        )}
      </div>
    </div>
  );
};
