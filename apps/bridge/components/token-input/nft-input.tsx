import { useTranslation } from "react-i18next";

import { useIsWithdrawal } from "@/hooks/use-withdrawing";
import { useConfigState } from "@/state/config";

import { NftImage } from "../nft";

export const NftTokenInput = () => {
  const { t } = useTranslation();
  const withdrawing = useIsWithdrawal();

  const nft = useConfigState.useNft();
  const setTokensModal = useConfigState.useSetTokensModal();

  if (!nft) {
    return null;
  }

  return (
    <div
      className={`relative rounded-[16px] px-4 py-3 border-2 border-transparent focus-within:border-border transition-colors bg-muted `}
    >
      <label
        htmlFor="amount"
        className={`block text-xs  leading-6 text-foreground`}
      >
        {withdrawing ? t("withdraw") : t("deposit")}
      </label>
      <div className="relative">
        <div
          className="flex justify-between items-center gap-2 cursor-pointer group"
          onClick={() => setTokensModal(true)}
          role="button"
        >
          <div className="flex gap-2  items-center ">
            <NftImage nft={nft} className="h-12 w-12 rounded-lg" />
            <div className="flex flex-col gap-0">
              <div>#{nft.tokenId}</div>
              <div className="text-xs">{nft.name}</div>
            </div>
          </div>
          <div
            className={`flex h-8 w-8 justify-center rounded-full p-2 items-center  transition-all group-hover:scale-105 text-foreground bg-card`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={14}
              height={14}
              className={`w-3.5 h-3.5 fill-foreground`}
              viewBox="0 0 16 16"
            >
              <path d="M13.53 6.031l-5 5a.75.75 0 01-1.062 0l-5-5A.751.751 0 113.531 4.97L8 9.439l4.47-4.47a.751.751 0 011.062 1.062h-.001z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
