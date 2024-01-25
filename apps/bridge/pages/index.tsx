import { AnimatePresence } from "framer-motion";

import { DeploymentsGrid } from "@/components/Deployments";
import { ErrorComponent } from "@/components/Error";
import { Loading } from "@/components/Loading";
import { PageTransition } from "@/components/PageTransition";
import { Bridge } from "@/components/bridge";
import { useDeployments } from "@/hooks/use-deployments";
import { useConfigState } from "@/state/config";

export default function Index() {
  const { deployments } = useDeployments();
  const initialised = useConfigState.useInitialised();

  return (
    <PageTransition>
      <AnimatePresence mode="sync">
        {!initialised ? (
          <Loading key={"index-loading"} />
        ) : deployments.length === 1 ? (
          <Bridge key={"bridge"} />
        ) : !deployments.length ? (
          <ErrorComponent key={"index-error"} />
        ) : (
          <DeploymentsGrid key={"grid"} />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
