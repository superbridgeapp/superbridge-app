import { Chain } from "viem";

import { ChainDto } from "@/codegen/model";
import { useSettingsState } from "@/state/settings";

const statelessTransactionLink = (
  type: "tx" | "address",
  payload: string,
  chain: Chain | ChainDto | undefined | null,
  preferredExplorer: string
) => {
  const etherscan = chain?.blockExplorers?.etherscan?.url;
  // @ts-expect-error
  const onceupon = chain?.blockExplorers?.onceupon?.url;
  const blockscout =
    (chain?.blockExplorers as any)?.blockScout?.url ??
    (chain?.blockExplorers as any)?.blockscout?.url;

  if (preferredExplorer === "etherscan" && etherscan) {
    return { name: "Etherscan", link: `${etherscan}/${type}/${payload}` };
  }

  if (preferredExplorer === "blockscout" && blockscout) {
    return { name: "Blockscout", link: `${blockscout}/${type}/${payload}` };
  }

  if (preferredExplorer === "onceupon" && onceupon) {
    const link =
      type === "tx"
        ? `${onceupon}/tx/${payload}`
        : `${onceupon}/${payload}:${chain.id}`;
    return { name: "Once Upon", link };
  }

  const defaultName = chain?.blockExplorers?.default?.name;
  const deafultUrl = chain?.blockExplorers?.default?.url;
  return { name: defaultName, link: `${deafultUrl}/${type}/${payload}` };
};

export const transactionLink = (
  payload: string,
  chain: Chain | ChainDto | undefined | null
) => {
  const preferredExplorer = useSettingsState.getState().preferredExplorer;
  return statelessTransactionLink("tx", payload, chain, preferredExplorer).link;
};

export const addressLink = (
  payload: string,
  chain: Chain | ChainDto | undefined
) => {
  const preferredExplorer = useSettingsState.getState().preferredExplorer;
  return statelessTransactionLink("address", payload, chain, preferredExplorer);
};

export const useExplorerLink = (
  type: "tx" | "address",
  payload: string,
  chain: Chain | ChainDto | undefined | null
) => {
  const preferredExplorer = useSettingsState.usePreferredExplorer();
  return statelessTransactionLink(type, payload, chain, preferredExplorer);
};
