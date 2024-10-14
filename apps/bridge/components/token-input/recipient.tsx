import clsx from "clsx";
import { useAccount } from "wagmi";

import { useModal } from "@/hooks/use-modal";
import { useConfigState } from "@/state/config";

import { IconAddCircle, IconWallet } from "../icons";

export const Recipient = () => {
  const recipientName = useConfigState.useRecipientName();
  const recipientAddress = useConfigState.useRecipientAddress();
  const account = useAccount();
  const recipientAddressModal = useModal("RecipientAddress");

  return (
    <div
      className="flex items-center justify-between shrink-0"
      onClick={!account.address ? () => {} : () => recipientAddressModal.open()}
    >
      {!account.address ? (
        <span className={"text-xs text-muted-foreground"}>{/* empty */}</span>
      ) : !recipientAddress ? (
        <div className="flex justify-center items-center gap-1 pl-2 pr-1 py-1 rounded-full cursor-pointer hover:scale-105 transition-all bg-card">
          <span className="text-[10px] font-button leading-none">
            Add address
          </span>
          <IconAddCircle className="w-3 h-3 fill-foreground" />
        </div>
      ) : (
        <div
          className={clsx(
            `h-5 flex justify-center items-center gap-1 px-2 py-1 mr-0.5 rounded-full cursor-pointer hover:scale-105 transition-all bg-card`,
            account.address !== recipientAddress && "bg-card text-foreground"
          )}
        >
          {account.address !== recipientAddress ? (
            <>
              <span className="text-[10px] font-button leading-none">
                {recipientName
                  ? recipientName
                  : `${recipientAddress.slice(0, 4)}...${recipientAddress.slice(
                      recipientAddress.length - 4
                    )}`}
              </span>
              <IconWallet className="w-3 h-3 fill-foreground" />
            </>
          ) : (
            <IconWallet className="w-3 h-3 fill-muted-foreground" />
          )}
        </div>
      )}
    </div>
  );
};
