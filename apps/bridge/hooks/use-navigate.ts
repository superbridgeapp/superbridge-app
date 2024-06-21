import { useRouter } from "next/router";

import { DeploymentDto } from "@/codegen/model";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";

import { useDeployments } from "./use-deployments";

export const useNavigate = () => {
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const setDeployment = useInjectedStore((s) => s.setDeployment);
  const router = useRouter();
  const { deployments } = useDeployments();
  const setFast = useConfigState.useSetFast();

  return (to: "/" | DeploymentDto | "fast") => {
    setDisplayTransactions(false);

    if (to === "/" && deployments.length === 1) {
      return;
    }

    if (to === "fast") {
      router.push("/fast", undefined, { shallow: true });
      setDeployment(null);
      setFast(true);
    } else if (to === "/") {
      router.push("/", undefined, { shallow: true });
      setDeployment(null);
      setFast(false);
    } else {
      router.push(`/${to.name}`, undefined, { shallow: true });
      setDeployment(to);
      setFast(false);
    }
  };
};
