import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { deploymentTheme } from "@/config/theme";
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
  const theme = deploymentTheme(deployment);
  const { t } = useTranslation();

  useEffect(() => {
    setNfts(false);
  }, [deployment]);

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent>
        {deployment?.supportsNftBridging && (
          <div className="flex justify-between items-center px-4 pt-14 pb-0">
            {/* {nfts ? (
              <h1 className="text-base font-bold">Select an NFT</h1>
            ) : (
              <h1 className="text-base font-bold">Select a token</h1>
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
                    className={`text-xs text-center font-medium inline-flex ${
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
                    className={`text-xs text-center font-medium inline-flex ${
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
          <div className="flex justify-between items-center px-4 pt-8 pb-0">
            <h1 className="text-base font-bold">{t("tokens.selectToken")}</h1>
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
