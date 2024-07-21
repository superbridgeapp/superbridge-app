import { InferGetServerSidePropsType } from "next";

import { InjectedState } from "@/state/injected";

import { getServerSideProps } from "../pages/[[...index]]";

export const useInitialInjectedState = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
): InjectedState => {
  // default Superbridge
  let fromChainId = 1;
  let toChainId = 10;

  if (props.deployments?.length === 1) {
    fromChainId = props.deployments[0].l1.id;
    toChainId = props.deployments[0].l2.id;
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