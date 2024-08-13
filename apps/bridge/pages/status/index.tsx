import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import { bridgeControllerGetDeployments } from "@/codegen/index";
import { TermsLayout } from "@/components/layouts/terms-layout";
import { StatusDeploymentRow } from "@/components/status/status-deployment-row";
import { StatusProviders } from "@/components/status/status-providers";
import {
  SUPERCHAIN_MAINNETS,
  SUPERCHAIN_TESTNETS,
} from "@/constants/superbridge";

export default function Status({
  deployments,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!deployments) {
    return <div>Not Found</div>;
  }

  return (
    <TermsLayout>
      <StatusProviders deployments={deployments}>
        <section className="max-w-3xl mx-auto p-8">
          <header className="py-16">
            <h1 className="font-heading text-6xl">Superchain Status</h1>
          </header>
          <div className="rounded-xl bg-card">
            <ul className="divide-y">
              {deployments.map((d) => (
                <StatusDeploymentRow deployment={d} key={d.id} />
              ))}
            </ul>
          </div>
        </section>
      </StatusProviders>
    </TermsLayout>
  );
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  if (
    !req.headers.host ||
    !["localhost:3004", "superbridge.app"].includes(req.headers.host)
  ) {
    return { props: {} };
  }

  const { data } = await bridgeControllerGetDeployments({
    names: [...SUPERCHAIN_MAINNETS, ...SUPERCHAIN_TESTNETS],
  });

  data.sort((a, b) => a.displayName.localeCompare(b.displayName));

  return { props: { deployments: data } };
};
