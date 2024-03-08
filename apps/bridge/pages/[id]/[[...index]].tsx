import { AnimatePresence } from "framer-motion";
import type { GetServerSideProps, PageConfig } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { ErrorComponent } from "@/components/Error";
import { Loading } from "@/components/Loading";
import { PageTransition } from "@/components/PageTransition";
import { Bridge } from "@/components/bridge";
import { isRollbridge } from "@/config/superbridge";
import { useConfigState } from "@/state/config";

type PageProps = {
  id: string;
};

export default function Page(props: PageProps) {
  const deployment = useConfigState.useDeployment();
  const initialised = useConfigState.useInitialised();

  // must be something to do with framer-motion but sometimes this
  // is true
  const pageIsRendered = !!useRouter().query.id;

  return (
    <>
      <Head>
        <meta
          property="og:image"
          content={`https://superbridge.app/og/${props.id}-og-image${
            isRollbridge ? "-rb" : ""
          }.png`}
        />
        <meta
          name="twitter:image"
          content={`https://superbridge.app/og/${props.id}-og-image${
            isRollbridge ? "-rb" : ""
          }.png`}
        />
      </Head>
      <PageTransition>
        <AnimatePresence mode="sync" initial={false}>
          {pageIsRendered && (
            <>
              {!initialised ? (
                <Loading key={"bridge-loading"} />
              ) : !deployment ? (
                <ErrorComponent key={"bridge-error"} />
              ) : (
                <Bridge key={"bridge-loaded"} />
              )}
            </>
          )}
        </AnimatePresence>
      </PageTransition>
    </>
  );
}

export const config: PageConfig = {
  runtime: "experimental-edge", // warn: using an experimental edge runtime, the API might change
};

export const getServerSideProps = (async (context) => {
  return { props: { id: context.query.id as string } };
}) satisfies GetServerSideProps<PageProps>;
