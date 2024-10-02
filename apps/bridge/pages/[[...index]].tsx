import { AnimatePresence } from "framer-motion";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import { bridgeControllerGetBridgeConfigByDomainV2 } from "@/codegen";
import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { Providers } from "@/components/Providers";
import { Analytics } from "@/components/analytics";
import { Bridge } from "@/components/bridge";
import { Head } from "@/components/head";
import { InjectedStoreProvider } from "@/state/injected";
import { createInjectedState } from "@/utils/injected-state/create-injected-state";

const ignored = ["favicon", "locales", "_vercel", "_next", "fonts"];

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  if (
    !req.url ||
    req.method !== "GET" ||
    !req.headers.host ||
    ignored.find((x) => req.url?.includes(x))
  ) {
    throw new Error("Invalid request");
  }

  let requestHost = req.headers.host;

  if (
    req.headers.host?.includes("localhost") ||
    req.headers.host?.includes("ngrok")
  ) {
    // change this to load different apps
    requestHost = "8935b200-12e9-4fc8-8bbe-6b1b6b66fb2e.bridges.rollbridge.app";
  }

  const config = await bridgeControllerGetBridgeConfigByDomainV2(
    requestHost
  ).catch(() => null);

  if (!config?.data) {
    throw new Error("Invalid request");
  }

  return {
    props: createInjectedState({
      dto: config.data,
      host: requestHost,
      url: req.url,
    }),
  };
};

export default function IndexRoot(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <InjectedStoreProvider initialValues={props}>
      <Providers>
        <Head />
        <Layout>
          <Index />
        </Layout>
        <Analytics />
      </Providers>
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
