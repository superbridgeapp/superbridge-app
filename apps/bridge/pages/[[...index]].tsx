import { AnimatePresence } from "framer-motion";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import { base, mainnet, optimism } from "viem/chains";

import {
  bridgeControllerGetCctpDomains,
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
import {
  SUPERCHAIN_MAINNETS,
  SUPERCHAIN_TESTNETS,
} from "@/constants/superbridge";
import { useDeployment } from "@/hooks/use-deployment";
import { useDeployments } from "@/hooks/use-deployments";
import { InjectedStoreProvider } from "@/state/injected";
import { ThemeProvider } from "@/state/theme";

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const ignored = ["favicon", "locales", "_vercel", "_next"];
  if (
    !req.url ||
    !req.headers.host ||
    ignored.find((x) => req.url?.includes(x))
  ) {
    return { props: { deployments: [] } };
  }

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

    const acrossDomains = [
      {
        chain: mainnet,
        spokePool: "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5",
      },
      {
        chain: optimism,
        spokePool: "0x6f26Bf09B1C792e3228e5467807a900A503c0281",
      },
      {
        chain: base,
        spokePool: "0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64",
      },
    ].map((x) => {
      // @ts-expect-error
      x.chain.custom = null;
      // @ts-expect-error
      x.chain.formatters = null;
      // @ts-expect-error
      x.chain.fees = null;
      // @ts-expect-error
      x.chain.serializers = null;
      return x;
    });

    const cctpDomains = await bridgeControllerGetCctpDomains();
    return {
      props: {
        deployments: data,
        acrossDomains,
        cctpDomains: cctpDomains.data,
      },
    };
  }

  if (
    req.headers.host?.includes("localhost") ||
    req.headers.host?.includes("ngrok")
  ) {
    const { data } = await bridgeControllerGetDeployments({
      names: ["op-sepolia"],
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
  acrossDomains,
  cctpDomains,
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
        acrossDomains: acrossDomains ?? [],
        cctpDomains,
      }}
    >
      <ThemeProvider>
        <Providers>
          <Head deployment={deployment} />
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
