import { Chain } from "viem";

import { ChainDto } from "@/codegen/model";
import { useSettingsState } from "@/state/settings";

export const transactionLink = (tx: string, chain?: Chain | ChainDto) => {
  const preferredExplorer = useSettingsState.getState().preferredExplorer;

  const etherscan = chain?.blockExplorers?.etherscan?.url;
  // @ts-expect-error
  const onceupon = chain?.blockExplorers?.onceupon?.url;
  const blockscout =
    (chain?.blockExplorers as any)?.blockScout?.url ??
    (chain?.blockExplorers as any)?.blockscout?.url;

  const _default = chain?.blockExplorers?.default?.url;

  if (preferredExplorer === "etherscan" && etherscan) {
    return `${etherscan}/tx/${tx}`;
  }

  if (preferredExplorer === "blockscout" && blockscout) {
    return `${blockscout}/tx/${tx}`;
  }

  if (preferredExplorer === "onceupon" && onceupon) {
    return `${onceupon}/tx/${tx}`;
  }

  return `${_default}/tx/${tx}`;
};
