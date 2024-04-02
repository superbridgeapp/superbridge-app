import { AnimatePresence } from "framer-motion";

import { DeploymentsGrid } from "@/components/Deployments";
import { ErrorComponent } from "@/components/Error";
import { Loading } from "@/components/Loading";
import { PageTransition } from "@/components/PageTransition";
import { Bridge } from "@/components/bridge";
import { useDeployments } from "@/hooks/use-deployments";
import { useConfigState } from "@/state/config";

import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import {
  bridgeControllerGetDeployments,
  bridgeControllerGetDeploymentsByDomain,
} from "../codegen";
import { DeploymentDto } from "@/codegen/model";
import { useEffect } from "react";
import { Providers } from "@/components/Providers";
import { Layout } from "@/components/Layout";

type Props = {
  deployments: DeploymentDto[];
};

export const getServerSideProps = (async () => {
  const { data } = await bridgeControllerGetDeploymentsByDomain(
    "superbridge.app"
  );
  return { props: { deployments: data } };
}) satisfies GetServerSideProps<Props>;

export default function IndexRoot({ deployments }) {
  console.log("IndexRoot");
  return (
    <Providers deployments={deployments}>
      <Layout>
        <Index deployments={deployments} />
      </Layout>
    </Providers>
  );
}

function Index({
  deployments,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const initialised = useConfigState.useInitialised();
  const deployment = useConfigState.useDeployment();

  const setDeployments = useConfigState.useSetDeployments();

  useEffect(() => {
    setDeployments(deployments);
  }, []);

  return (
    <PageTransition>
      <AnimatePresence mode="sync">
        {!initialised ? (
          <Loading key={"index-loading"} />
        ) : deployments.length === 1 || deployment ? (
          <Bridge key={"bridge"} />
        ) : !deployments.length ? (
          <ErrorComponent key={"index-error"} />
        ) : (
          <DeploymentsGrid key={"grid"} />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
