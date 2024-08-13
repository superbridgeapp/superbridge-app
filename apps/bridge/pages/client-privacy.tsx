import { InferGetServerSidePropsType } from "next";
import ReactMarkdown from "react-markdown";

import { TermsLayout } from "@/components/layouts/terms-layout";

import { getServerSideProps } from "./client-terms";

export default function ClientPrivacy({
  deployment,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <TermsLayout>
      <section className="max-w-3xl mx-auto p-8 prose prose-sm prose-headings:font-heading dark:prose-invert">
        <h1>{deployment?.l2.name} Privacy Policy</h1>
        <ReactMarkdown>{deployment?.tos?.customPrivacyPolicy}</ReactMarkdown>
      </section>
    </TermsLayout>
  );
}

export { getServerSideProps };
