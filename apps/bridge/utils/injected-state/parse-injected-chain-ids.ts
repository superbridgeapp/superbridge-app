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
  console.log(">>> search", search);

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
  console.log(">>> path", path);

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
    return defaults;
  }

  // rollie
  if (dto?.deployments?.length) {
    return {
      fromChainId: dto.deployments[0].l1ChainId,
      toChainId: dto.deployments[0].l2ChainId,
    };
  }

  if (dto?.hyperlaneMailboxes && dto?.hyperlaneMailboxes.length >= 2) {
    return {
      fromChainId: dto.hyperlaneMailboxes[0].chainId,
      toChainId: dto.hyperlaneMailboxes[1].chainId,
    };
  }

  if (dto?.acrossDomains && dto?.acrossDomains.length >= 2) {
    return {
      fromChainId: dto.acrossDomains[0].chain.id,
      toChainId: dto.acrossDomains[1].chain.id,
    };
  }

  if (dto?.cctpDomains && dto?.cctpDomains.length >= 2) {
    return {
      fromChainId: dto.cctpDomains[0].chainId,
      toChainId: dto.cctpDomains[1].chainId,
    };
  }

  return defaults;
};
