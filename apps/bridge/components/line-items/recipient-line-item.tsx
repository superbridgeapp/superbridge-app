import clsx from "clsx";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";

import { useConfigState } from "@/state/config";
import { ModalNames } from "@/constants/modal-names";

export const RecipientAddressLineItem = () => {
  const recipientName = useConfigState.useRecipientName();
  const recipientAddress = useConfigState.useRecipientAddress();
  const account = useAccount();
  const { t } = useTranslation();
  const openModal = useConfigState.useAddModal();

  return (
    <div
      className="flex items-center justify-between px-3 py-2 -mr-0.5"
      onClick={
        !account.address
          ? () => {}
          : () => openModal(ModalNames.RecipientAddress)
      }
    >
      <div className="flex justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 14 14"
          className="fill-foreground w-4 h-4"
        >
          <path d="M7 2.866c.193 0 .382.06.531.202l3.7 3.268c.179.16.341.372.341.664 0 .292-.159.501-.341.664l-3.7 3.268a.773.773 0 01-.531.202.806.806 0 01-.531-1.408l2.171-1.92H3.231a.806.806 0 01-.804-.803c0-.441.362-.803.804-.803h5.41L6.468 4.28A.806.806 0 017 2.872v-.006z"></path>
        </svg>
        <span className={`text-xs `}>{t("toAddress")}</span>
      </div>

      {!account.address ? (
        <span className={"text-xs  text-muted-foreground"}>…</span>
      ) : !recipientAddress ? (
        <div className="flex justify-center gap-1 pl-2 pr-1 py-1 rounded-full cursor-pointer hover:scale-105 transition-all bg-muted">
          <span className="text-xs  text-foreground">Add address</span>
          <Image
            alt="Address icon"
            src={"/img/address-add.svg"}
            height={14}
            width={14}
          />
        </div>
      ) : (
        <div
          className={clsx(
            `flex justify-center gap-1 pl-2 pr-1 py-1 -mr-0.5 rounded-full cursor-pointer hover:scale-105 transition-all bg-green-500/10`
          )}
        >
          <span className={clsx(`text-xs  `, "text-green-500")}>
            {recipientName
              ? recipientName
              : `${recipientAddress.slice(0, 4)}...${recipientAddress.slice(
                  recipientAddress.length - 4
                )}`}
          </span>
          <Image
            alt="Address icon"
            src={"/img/address-ok.svg"}
            height={14}
            width={14}
          />
        </div>
      )}
    </div>
  );
};
