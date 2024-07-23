import { useSelectedToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";

import { ERC20TokenInput } from "./erc20-token-input";
import { NftTokenInput } from "./nft-input";

export const TokenInput = () => {
  const nft = useConfigState.useNft();
  const token = useSelectedToken();

  return token ? <ERC20TokenInput /> : nft ? <NftTokenInput /> : null;
};
