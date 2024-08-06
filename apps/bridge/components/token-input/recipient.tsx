import clsx from "clsx";
import { useAccount } from "wagmi";

import { ModalNames } from "@/constants/modal-names";
import { useConfigState } from "@/state/config";

import { IconAddCircle, IconCheckCircle } from "../icons";

export const Recipient = () => {
  const recipientName = useConfigState.useRecipientName();
  const recipientAddress = useConfigState.useRecipientAddress();
  const account = useAccount();
  const openModal = useConfigState.useAddModal();

  return (
    <div
      className="flex items-center justify-between"
      onClick={
        !account.address
          ? () => {}
          : () => openModal(ModalNames.RecipientAddress)
      }
    >
      {!account.address ? (
        <span className={"text-xs text-muted-foreground"}>{/* empty */}</span>
      ) : !recipientAddress ? (
        <div className="flex justify-center items-center gap-1 pl-2 pr-1 py-1 rounded-full cursor-pointer hover:scale-105 transition-all bg-muted">
          <span className="text-xs text-foreground">Add recipient</span>
          <IconAddCircle className="w-3 h-3 fill-foreground" />
        </div>
      ) : (
        <div
          className={clsx(
            `flex justify-center items-center gap-1 px-2 py-1 -mr-0.5 rounded-full cursor-pointer hover:scale-105 transition-all bg-card`
          )}
        >
          {/* <IconCheckCircle className="w-3 h-3 fill-muted-foreground" /> */}
          <span className="text-xs text-muted-foreground">
            {recipientName
              ? recipientName
              : `${recipientAddress.slice(0, 4)}...${recipientAddress.slice(
                  recipientAddress.length - 4
                )}`}
          </span>
        </div>
      )}
    </div>
  );
};
