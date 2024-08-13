import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import ReactMarkdown from "react-markdown";

import { bridgeControllerGetDeploymentsByDomain } from "@/codegen/index";
import { TermsLayout } from "@/components/layouts/terms-layout";

export default function ClientTerms({
  deployment,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <TermsLayout>
      <section className="max-w-3xl mx-auto p-8 prose prose-sm prose-headings:font-heading dark:prose-invert">
        <h1>{deployment?.l2.name} Terms of Service</h1>
        <ReactMarkdown>{deployment?.tos?.customTermsOfService}</ReactMarkdown>
      </section>
    </TermsLayout>
  );
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  if (!req.headers.host) {
    return { props: { deployment: null, host: "" } };
  }

  const { data } = await bridgeControllerGetDeploymentsByDomain(
    req.headers.host
  );
  // const { data } = await bridgeControllerGetDeployments({
  //   names: ["arbitrum-one"],
  // });

  return { props: { deployment: data[0] ?? null, host: req.headers.host } };
};
