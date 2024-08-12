import { BridgeConfigDto } from "@/codegen/model";
import { InjectedState } from "@/state/injected";

import { parseApp } from "./parse-app";
import { parseInjectedChainIds } from "./parse-injected-chain-ids";
import { parseSuperbridgeTestnets } from "./parse-superbridge-testnets";

export const createInjectedState = (props: {
  dto: BridgeConfigDto | null;
  host: string;
  url: string;
}): InjectedState => {
  const { dto, host } = props;

  console.time("parseApp");
  const app = parseApp(props);
  console.timeEnd("parseApp");
  console.time("parseInjectedChainIds");
  const { fromChainId, toChainId } = parseInjectedChainIds(props);
  console.timeEnd("parseInjectedChainIds");
  console.time("parseSuperbridgeTestnets");
  const superbridgeTestnets = parseSuperbridgeTestnets(
    { fromChainId, toChainId },
    props
  );
  console.timeEnd("parseSuperbridgeTestnets");

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
    app,
    chains: dto?.chains ?? [],
    host,
  };
};
