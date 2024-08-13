import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useState } from "react";

import {
  bridgeControllerGetCctpDomains,
  bridgeControllerGetDeployments,
} from "@/codegen/index";
import { DeploymentDto } from "@/codegen/model";
import { IconAlert } from "@/components/icons";
import { TermsLayout } from "@/components/layouts/terms-layout";
import { StatusChecks } from "@/components/status/status-checks";
import { StatusContactModal } from "@/components/status/status-contact-modal";
import { StatusProviders } from "@/components/status/status-providers";
import { SupportCheckStatus } from "@/components/status/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { optimismFaultProofsUpgrade } from "@/constants/links";
import {
  SUPERCHAIN_MAINNETS,
  SUPERCHAIN_TESTNETS,
} from "@/constants/superbridge";
import { useSupportStatusChecks } from "@/hooks/support/use-support-status-checks";
import { useFaultProofUpgradeTime } from "@/hooks/use-fault-proof-upgrade-time";
import { isOptimism } from "@/utils/deployments/is-mainnet";
import { getPeriod } from "@/utils/get-period";

const FaultProofAlert = ({ deployment }: { deployment: DeploymentDto }) => {
  return (
    <Alert size={"lg"}>
      <IconAlert className="w-6 h-6" />
      <AlertTitle>{deployment?.l2.name} Fault Proof upgrade</AlertTitle>
      <AlertDescription>
        <p>
          The {deployment?.l2.name} Fault Proof upgrade has been targeted for
          June. What does that mean for you?
        </p>
        <h3 className="text-foreground font-heading">
          I want to make a withdrawal
        </h3>
        <p>You should wait until the upgrade is complete.</p>
        <h3 className="text-foreground font-heading">
          Why should I wait until the upgrade is complete?
        </h3>
        <p>
          The upgrade will essentially wipe the status of existing prove
          operations. Any proves done now would need to be resubmitted after the
          upgrade.
        </p>
        <h3 className="text-foreground font-heading">
          I have a withdrawal in progress
        </h3>
        <p>
          If you can finalize your withdrawal before the upgrade is complete we
          highly recommend you do that.
        </p>
        <h3 className="text-foreground font-heading">
          What if I don't finalize withdrawals in progress?
        </h3>
        <p>
          You will need to prove again, wait, and then finalize after the
          upgrade is complete.
        </p>
        <p>
          <a
            href={optimismFaultProofsUpgrade}
            target="_blank"
            className="underline text-foreground font-heading"
          >
            For more info please visit optimism.io
          </a>
        </p>
      </AlertDescription>
    </Alert>
  );
};

function Status({
  deployment,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [contactModal, setContactModal] = useState(false);
  const statusChecks = useSupportStatusChecks(deployment!);

  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);

  if (!deployment) {
    return <div>Not Found</div>;
  }

  const settlementChain = deployment.l1.name;
  const rollupChain = deployment.l2.name;

  const finalizationPeriod = getPeriod(
    isOptimism(deployment)
      ? deployment.proveDuration! + deployment.finalizeDuration
      : deployment.finalizeDuration
  );

  const statusLoading = statusChecks.find(
    (x) => x.status === SupportCheckStatus.Loading
  );
  const statusWarning = statusChecks.find(
    (x) => x.status === SupportCheckStatus.Warning
  );
  const statusError = statusChecks.find(
    (x) => x.status === SupportCheckStatus.Error
  );

  return (
    <TermsLayout>
      <section className="max-w-3xl mx-auto p-8">
        <header className="flex flex-col items-center py-16 gap-4">
          <img
            src={deployment?.theme?.theme.imageNetwork}
            alt={rollupChain}
            className="w-24 h-24 rounded-full"
          />
          <h1 className="font-heading text-6xl  text-center">
            {rollupChain} Status
          </h1>
          <div className="flex gap-2">
            {[...SUPERCHAIN_MAINNETS, ...SUPERCHAIN_TESTNETS].includes(
              deployment.name
            ) && (
              <Button
                className="gap-2 bg-card tracking-tight"
                variant={"secondary"}
                asChild
              >
                <Link className="gap-2 bg-card tracking-tight" href="/support">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="fill-foreground"
                  >
                    <path d="M7 0.677246C6.70724 0.677246 6.41553 0.769919 6.1849 0.984753L0.523395 5.9849C0.246428 6.23133 0 6.55463 0 7.0001C0 7.44556 0.246428 7.76887 0.523395 8.01529L6.1849 13.0154C6.41553 13.2313 6.70829 13.323 7 13.323C7.67715 13.323 8.23108 12.769 8.23108 12.0919C8.23108 11.738 8.09312 11.4147 7.81616 11.1693L4.49361 8.23118H12.7689C13.4461 8.23118 14 7.67725 14 7.0001C14 6.32295 13.4461 5.76902 12.7689 5.76902H4.49255L7.8151 2.83085C8.09207 2.58442 8.23003 2.26217 8.23003 1.90833C8.23003 1.23118 7.67609 0.677246 6.99895 0.677246L7 0.677246Z" />
                  </svg>
                  <span>All chains</span>
                </Link>
              </Button>
            )}

            {isOptimism(deployment) && (
              <div className="gap-2 bg-card">
                Status{" "}
                {statusLoading ? (
                  <span className="flex items-center justify-center px-2 py-1 font-heading rounded-lg text-white bg-gray-400">
                    Loading
                  </span>
                ) : statusWarning ? (
                  <span className="flex items-center justify-center px-2 py-1 font-heading rounded-lg text-white bg-orange-400">
                    Warning
                  </span>
                ) : statusError ? (
                  <span className="flex items-center justify-center px-2 py-1 font-heading rounded-lg text-white bg-red-400">
                    Error
                  </span>
                ) : (
                  <span className="flex items-center justify-center px-2 py-1 font-heading rounded-lg text-white bg-green-400">
                    OK
                  </span>
                )}
              </div>
            )}
          </div>

          {faultProofUpgradeTime && <FaultProofAlert deployment={deployment} />}
        </header>

        <StatusContactModal
          open={contactModal}
          setOpen={setContactModal}
          finalizationPeriod={finalizationPeriod}
          settlementChain={settlementChain}
          rollupChain={rollupChain}
        />

        <StatusChecks deployment={deployment} />
      </section>
    </TermsLayout>
  );
}

export default function StatusWithProviders({
  deployment,
  cctpDomains,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <StatusProviders deployments={[deployment]}>
      <Status deployment={deployment} cctpDomains={cctpDomains} />
    </StatusProviders>
  );
}

export const getServerSideProps = async ({
  req,
  params,
}: GetServerSidePropsContext) => {
  if (!req.url || !params?.name) {
    throw new Error("Invalid");
  }

  const [{ data: deployments }, { data: cctpDomains }] = await Promise.all([
    bridgeControllerGetDeployments({
      names: [params.name as string],
    }),
    bridgeControllerGetCctpDomains(),
  ]);

  return { props: { deployment: deployments[0], cctpDomains } };
};
