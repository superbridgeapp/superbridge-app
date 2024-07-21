import { InferGetServerSidePropsType } from "next";

import { InjectedState } from "@/state/injected";

import { getServerSideProps } from "../pages/[[...index]]";

export const useInitialInjectedState = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
): InjectedState => {
  // default Superbridge
  let fromChainId = 1;
  let toChainId = 10;

  if (props.deployments.length === 1) {
    fromChainId = props.deployments[0].l1.id;
    toChainId = props.deployments[0].l2.id;
  }

  if (props.deployments.length === 0) {
    if (props.cctpDomains && props.cctpDomains.length >= 2) {
      fromChainId = props.cctpDomains[0].chainId;
      toChainId = props.cctpDomains[1].chainId;
    }

    if (props.acrossDomains && props.acrossDomains.length >= 2) {
      fromChainId = props.acrossDomains[0].chain.id;
      toChainId = props.acrossDomains[1].chain.id;
    }
  }

  return {
    acrossDomains: props.acrossDomains ?? [],
    cctpDomains: props.cctpDomains ?? [],
    deployments: props.deployments,
    superbridgeConfig: props.superbridgeConfig ?? null,
    testnets: props.testnets ?? false,
    fromChainId,
    toChainId,
  };
};
