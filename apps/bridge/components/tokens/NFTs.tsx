import { useState } from "react";
import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";
import { useAccount } from "wagmi";

import { useBridgeControllerGetNfts } from "@/codegen/index";
import { BridgeNftDto } from "@/codegen/model";
import { deploymentTheme } from "@/config/theme";
import { useConfigState } from "@/state/config";

import { NftImage } from "../nft";
import { Input } from "@/components/ui/input";

export const NonFungibleTokenPicker = ({
  setOpen,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
}) => {
  const [search, setSearch] = useState("");

  const deployment = useConfigState.useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  const account = useAccount();
  const nfts = useBridgeControllerGetNfts(
    deployment!.id,
    withdrawing ? "true" : "false",
    account.address!
  );
  const { t } = useTranslation();

  const setNft = useConfigState.useSetNft();

  const filteredTokens = nfts.data?.data.filter((nft) => {
    if (search) return nft.name.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const onClickNft = (t: BridgeNftDto) => {
    setNft(t);
    setOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-4 border-b">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          name="token"
          id="token"
          // className="bg-muted block w-full rounded-lg border-0 py-3 px-4 pr-10 text-sm font-medium  outline-0 ring-0 placeholder:text-muted-foreground sm:leading-6"
          placeholder="Search"
        />
      </div>

      <div className="overflow-y-scroll h-96">
        {match({
          filteredTokens,
          isLoading: nfts.isLoading,
          account: account.address,
        })
          .with({ account: undefined }, () => (
            <div className="p-4 text-center font-bold text-sm">
              {t("noAccountConnected")}
            </div>
          ))
          .with({ isLoading: true }, () => (
            <div className="p-4 text-center font-bold text-sm">
              {t("loading")}
            </div>
          ))
          .with({ filteredTokens: undefined }, () => (
            <div className="p-4 text-center font-bold text-sm">
              {t("tokens.noneFound")}
            </div>
          ))
          .with({ filteredTokens: [] }, () => (
            <div className="p-4 text-center font-bold text-sm">
              {t("tokens.noneFound")}
            </div>
          ))
          .with({ filteredTokens: P.array() }, ({ filteredTokens }) => (
            <div className="p-4 flex flex-wrap gap-4">
              {filteredTokens.map((nft) => (
                <div
                  key={`${nft.localConfig.address}-${nft.tokenId}`}
                  className="flex flex-col gap-2 cursor-pointer"
                  onClick={() => onClickNft(nft)}
                >
                  <NftImage nft={nft} className="h-24 w-24 rounded-md" />
                  <div className="text-xs">#{nft.tokenId}</div>
                </div>
              ))}
            </div>
          ))
          .exhaustive()}
      </div>
    </>
  );
};
