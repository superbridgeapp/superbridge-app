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
        fromChainId = deployment.l2.id;
        toChainId = deployment.l1.id;
      } else {
        fromChainId = deployment.l1.id;
        toChainId = deployment.l2.id;
      }
    }
    // rollie
  } else if (props.deployments?.length === 1) {
    fromChainId = props.deployments[0].l1.id;
    toChainId = props.deployments[0].l2.id;
  } else if (isSuperbridge) {
    // leave empty to use defaults
  } else if (props.cctpDomains && props.cctpDomains.length >= 2) {
    fromChainId = props.cctpDomains[0].chainId;
    toChainId = props.cctpDomains[1].chainId;
  } else if (props.acrossDomains && props.acrossDomains.length >= 2) {
    fromChainId = props.acrossDomains[0].chain.id;
    toChainId = props.acrossDomains[1].chain.id;
  } else if (props.hyperlaneMailboxes && props.hyperlaneMailboxes.length >= 2) {
    fromChainId = props.hyperlaneMailboxes[0].chain.id;
    toChainId = props.hyperlaneMailboxes[1].chain.id;
  }

  return {
    acrossDomains: props.acrossDomains ?? [],
    cctpDomains: props.cctpDomains ?? [],
    deployments: props.deployments ?? [],
    hyperlaneMailboxes: props.hyperlaneMailboxes ?? [],
    superbridgeConfig: props.superbridgeConfig ?? null,
    testnets: props.testnets ?? false,
    fromChainId,
    toChainId,
  };
};
