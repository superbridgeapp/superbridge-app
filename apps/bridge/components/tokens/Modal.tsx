import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDeployment } from "@/hooks/use-deployment";

import { Dialog, DialogContent } from "../ui/dialog";
import { NonFungibleTokenPicker } from "./NFTs";
import { FungibleTokenPicker } from "./Tokens";

export const TokenModal = (props: {
  open: boolean;
  setOpen: (b: boolean) => void;
}) => {
  const [nfts, setNfts] = useState(false);
  const deployment = useDeployment();
  const { t } = useTranslation();

  useEffect(() => {
    setNfts(false);
  }, [deployment]);

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent
        onOpenAutoFocus={(event: Event) => event.preventDefault()}
        className="min-h-[96dvh] max-h-[96dvh] md:min-h-[680px] md:max-h-[680px]"
      >
        {deployment?.supportsNftBridging && (
          <div className="flex justify-between items-center px-4 pt-14 pb-0">
            {/* {nfts ? (
              <h1 className="text-base font-heading">Select an NFT</h1>
            ) : (
              <h1 className="text-base font-heading">Select a token</h1>
            )} */}

            <div className="flex items-center space-x-2 w-full">
              <div
                className={`bg-muted flex p-1 rounded-full transition-colors w-full`}
              >
                <div
                  role="button"
                  className={`flex justify-center items-center rounded-full px-3 h-10 cursor-pointer transition-colors duration-200 w-full ${
                    !nfts ? "bg-primary" : "bg-transparent"
                  } `}
                  onClick={() => setNfts((n) => !n)}
                >
                  <span
                    className={`text-xs text-center  inline-flex ${
                      !nfts ? "text-primary" : "bg-transparent"
                    }`}
                  >
                    {t("tokens.tokens")}
                  </span>
                </div>
                <div
                  role="button"
                  className={`flex justify-center items-center rounded-full px-3 h-10 cursor-pointer transition-colors duration-200 w-full ${
                    nfts ? "bg-primary" : "bg-transparent"
                  }`}
                  onClick={() => setNfts((n) => !n)}
                >
                  <span
                    className={`text-xs text-center  inline-flex ${
                      nfts ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {t("tokens.nfts")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!deployment?.supportsNftBridging && (
          <div className="flex flex-col space-y-1.5 text-left px-6 py-6">
            <h1 className="text-lg font-heading">{t("tokens.selectToken")}</h1>
          </div>
        )}

        {nfts ? (
          <NonFungibleTokenPicker {...props} />
        ) : (
          <FungibleTokenPicker {...props} />
        )}
      </DialogContent>
    </Dialog>
  );
};
