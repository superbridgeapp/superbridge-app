import { AnimatePresence } from "framer-motion";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useEffect, useState } from "react";

import { bridgeControllerGetDeployments } from "@/codegen";
import { DeploymentType } from "@/codegen/model";
import { DeploymentsGrid } from "@/components/Deployments";
import { ErrorComponent } from "@/components/Error";
import { Layout } from "@/components/Layout";
import { Loading } from "@/components/Loading";
import { PageTransition } from "@/components/PageTransition";
import { Providers } from "@/components/Providers";
import { Bridge } from "@/components/bridge";
import { useConfigState } from "@/state/config";
import { ThemeContext } from "@/state/theme";
import { useInitialiseTheme } from "@/hooks/use-initialise-theme";

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const ignored = ["favicon", "locales", "_vercel"];

  if (!req.url || !req.headers.host) return { props: { deployments: [] } };

  if (ignored.find((x) => req.url?.includes(x))) {
    return { props: { deployments: [] } };
  }

  if (req.headers.host?.includes("localhost")) {
    const { data } = await bridgeControllerGetDeployments({
      names: ["innocent-salmon-alpaca-cb255w1oxu"],
    });
    return { props: { deployments: data } };
  }

  if (req.headers.host === "superbridge.app") {
    return {
      names: ["optimism", "base", "zora", "pgn", "mode", "orderly", "lyra"],
    };
  }

  if (req.headers.host === "testnets.superbridge.app") {
    return {
      names: [
        "op-sepolia",
        "base-sepolia",
        "zora-sepolia-0thyhxtf5e",
        "pgn-sepolia-i4td3ji6i0",
        "mode-sepolia-vtnhnpim72",
        "orderly-l2-4460-sepolia-8tc3sd7dvy",
      ],
    };
  }

  if (req.headers.host === "app.rollbridge.app") {
    return { type: DeploymentType.mainnet };
  }

  // these need to go last so they don't clash with devnets. or testnets. subdomains
  const [id] = req.headers.host?.split(".");

  // [id].devnets.superbridge|rollbridge.app
  if (
    req.headers.host.includes("devnets.superbridge.app") ||
    req.headers.host.includes("devnets.rollbridge.app")
  ) {
    const { data } = await bridgeControllerGetDeployments({
      names: [id],
    });
    return { props: { deployments: data } };
  }

  // [id].testnets.superbridge|rollbridge.app
  if (
    req.headers.host.includes("testnets.superbridge.app") ||
    req.headers.host.includes("testnets.rollbridge.app")
  ) {
    const { data } = await bridgeControllerGetDeployments({
      names: [id],
    });
    return { props: { deployments: data } };
  }

  return { props: { deployments: [] } };
};

export default function IndexRoot({
  deployments,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const themeValues = useInitialiseTheme();

  return (
    <ThemeContext.Provider value={themeValues}>
      <Providers deployments={deployments}>
        <Layout>
          <Index deployments={deployments} />
        </Layout>
      </Providers>
    </ThemeContext.Provider>
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
