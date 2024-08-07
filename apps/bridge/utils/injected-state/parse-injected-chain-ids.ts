import { BridgeConfigDto } from "@/codegen/model";

import { isSuperbridge } from "../is-superbridge";

const defaults = { fromChainId: 1, toChainId: 10 };

export const parseInjectedChainIds = ({
  dto,
  host,
  url,
}: {
  dto: BridgeConfigDto | null;
  host: string;
  url: string;
}): { fromChainId: number; toChainId: number } => {
  const search = new URLSearchParams(url.split("?")[1]);

  if (search.has("fromChainId") || search.has("toChainId")) {
    const searchParams = search;

    const fromChainId = searchParams.get("fromChainId") || "1";
    const toChainId = searchParams.get("toChainId") || "10";

    return {
      fromChainId: parseInt(fromChainId),
      toChainId: parseInt(toChainId),
    };
  }

  let path = "";
  try {
    path = new URL(url).pathname;
  } catch {}

  // legacy setup was to have superbridge.app/network/
  // token initialisation is handled in useInitialiseToken
  const [deploymentName]: (string | undefined)[] = path
    .split(/[?\/]/)
    .filter(Boolean);

  // Superbridge
  if (isSuperbridge(host)) {
    if (deploymentName) {
      const deployment = dto?.deployments?.find(
        (x) => x.name === deploymentName
      );
      if (deployment) {
        if (search.get("direction") === "withdraw") {
          return {
            fromChainId: deployment.l2ChainId,
            toChainId: deployment.l1ChainId,
          };
        }
        return {
          fromChainId: deployment.l1ChainId,
          toChainId: deployment.l2ChainId,
        };
      }
    }
  }

  return {
    fromChainId: dto?.initialFromChainId ?? 1,
    toChainId: dto?.initialToChainId ?? 10,
  };
};
