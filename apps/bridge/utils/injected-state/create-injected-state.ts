import { BridgeConfigDto } from "@/codegen/model";
import { InjectedState } from "@/state/injected";
import { MultiChainToken } from "@/types/token";

import { parseApp } from "./parse-app";
import { parseInjectedChainIds } from "./parse-injected-chain-ids";
import { parseSuperbridgeTestnets } from "./parse-superbridge-testnets";

export const createInjectedState = (props: {
  dto: BridgeConfigDto | null;
  host: string;
  url: string;
}): InjectedState => {
  const { dto, host } = props;

  const app = parseApp(props);
  const { fromChainId, toChainId } = parseInjectedChainIds(props);
  const superbridgeTestnets = parseSuperbridgeTestnets(
    { fromChainId, toChainId },
    props
  );

  return {
    acrossDomains: dto?.acrossDomains ?? [],
    cctpDomains: dto?.cctpDomains ?? [],
    deployments: dto?.deployments ?? [],
    hyperlaneMailboxes: dto?.hyperlaneMailboxes ?? [],
    superbridgeConfig:
      dto?.highlightedTokens && dto?.banner
        ? { banner: dto?.banner, highlightedTokens: dto?.highlightedTokens }
        : null,
    superbridgeTestnets,
    fromChainId,
    toChainId,
    // todo: this is only Hyperlane tokens for now
    tokens: (dto?.tokens ?? []) as MultiChainToken[],
    app,
    chains: dto?.chains ?? [],
    host,
  };
};
