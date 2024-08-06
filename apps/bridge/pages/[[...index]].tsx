import { AnimatePresence } from "framer-motion";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import { bridgeControllerGetBridgeConfigByDomain } from "@/codegen";
import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { Providers } from "@/components/Providers";
import { Bridge } from "@/components/bridge";
import { StatefulHead } from "@/components/head";
import { InjectedStoreProvider } from "@/state/injected";
import { ThemeProvider } from "@/state/theme";
import { createInjectedState } from "@/utils/injected-state/create-injected-state";

const ignored = ["favicon", "locales", "_vercel", "_next"];

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  if (
    !req.url ||
    !req.headers.host ||
    ignored.find((x) => req.url?.includes(x))
  ) {
    return {
      props: createInjectedState({
        dto: null,
        host: "",
        url: "",
      }),
    };
  }

  let requestHost = req.headers.host;

  if (
    req.headers.host?.includes("localhost") ||
    req.headers.host?.includes("ngrok")
  ) {
    // change this to load different apps
    requestHost = "renzo.superbridge.app";
  }

  const config = await bridgeControllerGetBridgeConfigByDomain(
    requestHost
  ).catch(() => null);

  return {
    props: createInjectedState({
      dto: config?.data ?? null,
      host: requestHost,
      url: req.url,
    }),
  };

  // const name = (() => {
  //   if (
  //     req.headers.host?.includes("localhost") ||
  //     req.headers.host?.includes("ngrok")
  //   ) {
  //     return "op-sepolia";
  //   }

  //   // these need to go last so they don't clash with devnets. or testnets. subdomains
  //   const [id] = req.headers.host?.split(".");

  //   // [id].devnets.superbridge|rollbridge.app
  //   // [id].test.devnets.superbridge|rollbridge.app
  //   if (
  //     req.headers.host.includes("devnets.superbridge.app") ||
  //     req.headers.host.includes("devnets.rollbridge.app")
  //   ) {
  //     return id;
  //   }

  //   // [id].testnets.superbridge|rollbridge.app
  //   // [id].test.testnets.superbridge|rollbridge.app
  //   if (
  //     req.headers.host.includes("testnets.superbridge.app") ||
  //     req.headers.host.includes("testnets.rollbridge.app")
  //   ) {
  //     return id;
  //   }

  //   // [id].mainnets.superbridge|rollbridge.app
  //   // [id].test.mainnets.superbridge|rollbridge.app
  //   if (
  //     req.headers.host.includes("mainnets.superbridge.app") ||
  //     req.headers.host.includes("mainnets.rollbridge.app")
  //   ) {
  //     return id;
  //   }

  //   return null;
  // })();

  // if (name) {
  //   const [{ data }, cctpDomains, config] = await Promise.all([
  //     bridgeControllerGetDeployments({
  //       names: [name],
  //     }),
  //     SUPERCHAIN.includes(name) ? bridgeControllerGetCctpDomains() : null,

  //     bridgeControllerGetBridgeConfigByDomain(""),
  //   ]);
  //   return {
  //     props: { deployments: data, cctpDomains: cctpDomains?.data ?? [] },
  //   };
  // }

  // const { data } = await bridgeControllerGetDeploymentsByDomain(
  //   req.headers.host
  // );

  // return { props: { deployments: data } };
};

export default function IndexRoot(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <InjectedStoreProvider initialValues={props}>
      <ThemeProvider>
        <Providers>
          <StatefulHead />
          <Layout>
            <Index />
          </Layout>
        </Providers>
      </ThemeProvider>
    </InjectedStoreProvider>
  );
}

function Index() {
  return (
    <PageTransition key={"index"}>
      <AnimatePresence mode="sync">
        <PageTransition key={"bridge"}>
          <Bridge key={"bridge"} />
        </PageTransition>
      </AnimatePresence>
    </PageTransition>
  );
}
