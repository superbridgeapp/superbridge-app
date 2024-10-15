import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useState } from "react";

import { bridgeControllerGetDeployments } from "@/codegen/index";
import { DeploymentDto } from "@/codegen/model";
import { TermsLayout } from "@/components/layouts/terms-layout";
import { StatusDeploymentRow } from "@/components/status/status-deployment-row";
import { StatusModal } from "@/components/status/status-modal";
import { StatusProviders } from "@/components/status/status-providers";
import {
  SUPERCHAIN_MAINNETS,
  SUPERCHAIN_TESTNETS,
} from "@/constants/superbridge";
import { InjectedStoreProvider } from "@/state/injected";

export default function Status({
  deployments,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [deployment, setDeployment] = useState<DeploymentDto | null>(null);

  if (!deployments) {
    return <div>Not Found</div>;
  }

  return (
    <TermsLayout>
      {/* @ts-expect-error */}
      <InjectedStoreProvider>
        <StatusProviders deployments={deployments}>
          <section className="max-w-3xl mx-auto p-8">
            <header className="py-16">
              <h1 className="font-heading text-6xl">Superchain Status</h1>
            </header>
            <div className="rounded-xl bg-card">
              <ul className="divide-y">
                {deployments.map((d) => (
                  <StatusDeploymentRow
                    deployment={d}
                    key={d.id}
                    onClick={() => setDeployment(d)}
                  />
                ))}
              </ul>
            </div>
          </section>

          <StatusModal
            deployment={deployment}
            onClose={() => setDeployment(null)}
          />
        </StatusProviders>
      </InjectedStoreProvider>
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
