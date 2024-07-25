import clsx from "clsx";
import Image from "next/image";
import { useAccount } from "wagmi";

import { ModalNames } from "@/constants/modal-names";
import { useConfigState } from "@/state/config";

export const Recipient = () => {
  const recipientName = useConfigState.useRecipientName();
  const recipientAddress = useConfigState.useRecipientAddress();
  const account = useAccount();
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
      {!account.address ? (
        <span className={"text-xs  text-muted-foreground"}>{/* empty */}</span>
      ) : !recipientAddress ? (
        <div className="flex justify-center gap-1 pl-2 pr-1 py-1 rounded-full cursor-pointer hover:scale-105 transition-all bg-muted">
          <span className="text-xs  text-foreground">Add recipient</span>
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
