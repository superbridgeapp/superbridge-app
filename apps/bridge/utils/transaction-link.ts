import { Chain } from "viem";

import { ChainDto } from "@/codegen/model";
import { useSettingsState } from "@/state/settings";

export const transactionLink = (tx: string, chain?: Chain | ChainDto) => {
  const preferredExplorer = useSettingsState.getState().preferredExplorer;

  const etherscan = chain?.blockExplorers?.etherscan?.url;
  const blockscout =
    (chain?.blockExplorers as any)?.blockScout?.url ??
    (chain?.blockExplorers as any)?.blockscout?.url;
  const _default = chain?.blockExplorers?.default?.url;

  return preferredExplorer === "etherscan" && etherscan
    ? `${etherscan}/tx/${tx}`
    : preferredExplorer === "blockscout" && blockscout
    ? `${blockscout}/tx/${tx}`
    : `${_default}/tx/${tx}`;
};
