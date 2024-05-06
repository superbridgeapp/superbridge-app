import { AnimatePresence } from "framer-motion";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";

import {
  bridgeControllerGetDeployments,
  bridgeControllerGetDeploymentsByDomain,
} from "@/codegen";
import { DeploymentsGrid } from "@/components/Deployments";
import { ErrorComponent } from "@/components/Error";
import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { Providers } from "@/components/Providers";
import { Bridge } from "@/components/bridge";
import { Head } from "@/components/head";
import { isSuperbridge } from "@/config/superbridge";
import { useDeployment } from "@/hooks/use-deployment";
import { useDeployments } from "@/hooks/use-deployments";
import { InjectedStoreProvider } from "@/state/injected";
import { ThemeProvider } from "@/state/theme";

export const SUPERCHAIN_MAINNETS = [
  "optimism",
  "base",
  "zora",
  "pgn",
  "mode",
  "orderly",
  "lyra",
  "lumio-mainnet",
  "metal-mainnet",
];

export const SUPERCHAIN_TESTNETS = [
  "op-sepolia",
  "base-sepolia",
  "zora-sepolia-0thyhxtf5e",
  "pgn-sepolia-i4td3ji6i0",
  "mode-sepolia-vtnhnpim72",
  "orderly-l2-4460-sepolia-8tc3sd7dvy",
  "metal-l2-testnet-3bbzi9kufn",
];

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const ignored = ["favicon", "locales", "_vercel", "_next"];
  if (
    !req.url ||
    !req.headers.host ||
    ignored.find((x) => req.url?.includes(x))
  )
    return { props: { deployments: [] } };

  if (isSuperbridge) {
    const [name] = req.url.split(/[?\/]/).filter(Boolean);
    if (SUPERCHAIN_TESTNETS.includes(name)) {
      const { data } = await bridgeControllerGetDeployments({
        names: SUPERCHAIN_TESTNETS,
      });
      return { props: { deployments: data, testnets: true } };
    }
    const names =
      req.headers.host === "testnets.superbridge.app"
        ? SUPERCHAIN_TESTNETS
        : SUPERCHAIN_MAINNETS;
    const { data } = await bridgeControllerGetDeployments({
      names,
    });
    return { props: { deployments: data } };
  }

  if (req.headers.host?.includes("localhost")) {
    const { data } = await bridgeControllerGetDeployments({
      names: ["arbitrum-one"],
    });
    return { props: { deployments: data } };
  }

  // these need to go last so they don't clash with devnets. or testnets. subdomains
  const [id] = req.headers.host?.split(".");

  // [id].devnets.superbridge|rollbridge.app
  // [id].test.devnets.superbridge|rollbridge.app
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
  // [id].test.testnets.superbridge|rollbridge.app
  if (
    req.headers.host.includes("testnets.superbridge.app") ||
    req.headers.host.includes("testnets.rollbridge.app")
  ) {
    const { data } = await bridgeControllerGetDeployments({
      names: [id],
    });
    return { props: { deployments: data } };
  }

  // [id].mainnets.superbridge|rollbridge.app
  // [id].test.mainnets.superbridge|rollbridge.app
  if (
    req.headers.host.includes("mainnets.superbridge.app") ||
    req.headers.host.includes("mainnets.rollbridge.app")
  ) {
    const { data } = await bridgeControllerGetDeployments({
      names: [id],
    });
    return { props: { deployments: data } };
  }

  const { data } = await bridgeControllerGetDeploymentsByDomain(
    req.headers.host
  );

  return { props: { deployments: data } };
};

export default function IndexRoot({
  deployments,
  testnets,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [name]: (string | undefined)[] = router.asPath
    .split(/[?\/]/)
    .filter(Boolean);

  const found = deployments.find((x) => x.name === name);
  let deployment = null;
  if (deployments.length === 1) {
    deployment = deployments[0];
  } else if (isSuperbridge && found) {
    deployment = found;
  }

  return (
    <InjectedStoreProvider
      initialValues={{
        deployments,
        deployment,
        withdrawing: router.query.direction === "withdraw",
        testnets: testnets ?? false,
      }}
    >
      <ThemeProvider>
        <Providers>
          <Head />
          <Layout>
            <Index />
          </Layout>
        </Providers>
      </ThemeProvider>
    </InjectedStoreProvider>
  );
}

function Index() {
  const deployment = useDeployment();
  const { deployments } = useDeployments();

  return (
    <PageTransition key={"index"}>
      <AnimatePresence mode="sync">
        {deployment ? (
          <PageTransition key={"bridge"}>
            <Bridge key={"bridge"} />
          </PageTransition>
        ) : !deployments.length ? (
          <PageTransition key={"error"}>
            <ErrorComponent key={"error"} />
          </PageTransition>
        ) : (
          <PageTransition key={"grid"}>
            <DeploymentsGrid key={"grid"} />
          </PageTransition>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
