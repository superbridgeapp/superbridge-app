import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import ReactMarkdown from "react-markdown";

import PageFooter from "@/components/page-footer";
import PageNav from "@/components/page-nav";
import {
  bridgeControllerGetDeployments,
  bridgeControllerGetDeploymentsByDomain,
} from "@/codegen/index";
import { Head } from "@/components/head";

export default function ClientTerms({
  deployment,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head deployment={deployment} />
      <div className="w-screen h-screen overflow-y-auto bg-background">
        <PageNav />
        <main>
          <section className="max-w-3xl mx-auto p-8 prose prose-sm prose-headings:font-heading dark:prose-invert">
            <h1>{deployment?.l2.name} Terms of Service</h1>
            <ReactMarkdown>
              {deployment?.tos?.customTermsOfService}
            </ReactMarkdown>
          </section>
        </main>
        <PageFooter />
      </div>
    </>
  );
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  if (!req.headers.host) {
    return { props: { deployment: null } };
  }

  const { data } = await bridgeControllerGetDeploymentsByDomain(
    req.headers.host
  );
  // const { data } = await bridgeControllerGetDeployments({
  //   names: ["arbitrum-one"],
  // });

  return { props: { deployment: data[0] ?? null } };
};
