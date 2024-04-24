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

  return (to: "/" | DeploymentDto) => {
    setDisplayTransactions(false);

    if (to === "/" && deployments.length === 1) {
      return;
    }

    if (to === "/") {
      router.push("/", undefined, { shallow: true });
      setDeployment(null);
    } else {
      router.push(`/${to.name}`, undefined, { shallow: true });
      setDeployment(to);
    }
  };
};
