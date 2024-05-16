import { AnimatePresence } from "framer-motion";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import { match } from "ts-pattern";

import {
  bridgeControllerFiatPrices,
  bridgeControllerGetDeployments,
  bridgeControllerGetDeploymentsByDomain,
  bridgeControllerGetTokenPrices,
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
  const [
    { deployments, testnets },
    prices,
    fiatPrices,
    superchainTokenList,
    superbridgeTokenList,
  ] = await Promise.all([
    match({
      isSuperbridge,
      localhost: req.headers.host?.includes("localhost"),
      default:
        req.headers.host?.includes("testnets.superbridge.app") ||
        req.headers.host?.includes("testnets.rollbridge.app") ||
        req.headers.host?.includes("mainnets.superbridge.app") ||
        req.headers.host?.includes("mainnets.rollbridge.app") ||
        req.headers.host?.includes("devnets.superbridge.app") ||
        req.headers.host?.includes("devnets.rollbridge.app"),
    })
      .with({ isSuperbridge: true }, async () => {
        const [name] = req.url!.split(/[?\/]/).filter(Boolean);
        if (SUPERCHAIN_TESTNETS.includes(name)) {
          const data = await bridgeControllerGetDeployments({
            names: SUPERCHAIN_TESTNETS,
          });
          return { deployments: data, testnets: true };
        }
        const names =
          req.headers.host === "testnets.superbridge.app"
            ? SUPERCHAIN_TESTNETS
            : SUPERCHAIN_MAINNETS;
        const data = await bridgeControllerGetDeployments({
          names,
        });

        return { deployments: data };
      })
      .with({ localhost: true }, async () => {
        const data = await bridgeControllerGetDeployments({
          names: ["arbitrum-one"],
        });
        return { deployments: data };
      })
      .with({ default: true }, async () => {
        const [id] = req.headers.host!.split(".");

        const data = await bridgeControllerGetDeployments({
          names: [id],
        });
        return { deployments: data };
      })
      .otherwise(async () => {
        const data = await bridgeControllerGetDeploymentsByDomain(
          req.headers.host!
        );
        return { deployments: data };
      }),
    bridgeControllerGetTokenPrices().catch(() => ({})),
    bridgeControllerFiatPrices().catch(() => ({})),
    fetch(
      "https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json"
    )
      .then((x) => x.json())
      .catch(() => null),
    fetch(
      "https://raw.githubusercontent.com/superbridgeapp/token-lists/main/superchain.tokenlist.json"
    )
      .then((x) => x.json())
      .catch(() => null),
  ]);

  return {
    props: {
      deployments,
      prices,
      fiatPrices,
      testnets: testnets ?? false,
      superbridgeTokenList,
      superchainTokenList,
    },
  };
};

export default function IndexRoot(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();

  const [name]: (string | undefined)[] = router.asPath
    .split(/[?\/]/)
    .filter(Boolean);

  const found = props.deployments.find((x) => x.name === name);
  let deployment = null;
  if (props.deployments.length === 1) {
    deployment = props.deployments[0];
  } else if (isSuperbridge && found) {
    deployment = found;
  }

  return (
    <InjectedStoreProvider
      initialValues={{
        ...props,
        deployment,
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
