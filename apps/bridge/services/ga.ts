import { sendGAEvent } from "@next/third-parties/google";

import { isSuperbridge } from "@/config/superbridge";

type DeploymentClick = {
  event: "deployment-click";
  name: string;
};
type ChainSelect = {
  event: "chain-select";
  name: string;
};
type TokenSelect = {
  event: "token-select";
  symbol: string;
  network: string;
};
type TokenBannerClick = {
  event: "token-banner-click";
  symbol: string;
};
type Bridge = {
  event: "bridge";
  from: string;
  to: string;
  amount: number;
  token: string;
  type: string;
};

export const trackEvent = (
  args: DeploymentClick | ChainSelect | TokenSelect | TokenBannerClick | Bridge
) => {
  if (isSuperbridge) {
    sendGAEvent("event", args.event, args);
  }
};
