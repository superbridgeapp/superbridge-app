import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import { isSuperbridge } from "@/config/app";
import { InjectedState } from "@/state/injected";

import { getServerSideProps } from "../pages/[[...index]]";

export const useInitialInjectedState = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
): InjectedState => {
  const router = useRouter();

  // default Superbridge
  let fromChainId = parseInt(
    (router.query.fromChainId as string | undefined) ?? "1"
  );
  let toChainId = parseInt(
    (router.query.toChainId as string | undefined) ?? "10"
  );

  // legacy setup was to have superbridge.app/network/
  // token initialisation is handled in useInitialiseToken
  const [deploymentName]: (string | undefined)[] = router.asPath
    .split(/[?\/]/)
    .filter(Boolean);

  if (deploymentName) {
    const deployment = props.deployments?.find(
      (x) => x.name === deploymentName
    );
    if (deployment) {
      if (router.query.direction === "withdraw") {
        fromChainId = deployment.l2ChainId;
        toChainId = deployment.l1ChainId;
      } else {
        fromChainId = deployment.l1ChainId;
        toChainId = deployment.l2ChainId;
      }
    }
    // rollie
  } else if (props.deployments?.length === 1) {
    fromChainId = props.deployments[0].l1ChainId;
    toChainId = props.deployments[0].l2ChainId;
  } else if (isSuperbridge) {
    // leave empty to use defaults
  } else if (props.chains && props.chains.length >= 2) {
    fromChainId = props.chains[0].id;
    toChainId = props.chains[1].id;
  }

  return {
    acrossDomains: props.acrossDomains ?? [],
    cctpDomains: props.cctpDomains ?? [],
    deployments: props.deployments ?? [],
    hyperlaneMailboxes: props.hyperlaneMailboxes ?? [],
    superbridgeConfig:
      props.highlightedTokens && props.banner
        ? { banner: props.banner, highlightedTokens: props.highlightedTokens }
        : null,
    testnets: props.testnets ?? false,
    fromChainId,
    toChainId,
    tokens: props.tokens ?? [],
    chains: props.chains ?? [],
  };
};
