import { useRouter } from "next/router";

import { useConfigState } from "@/state/config";

import { useDeployments } from "./deployments/use-deployments";

export const useNavigate = () => {
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const router = useRouter();
  const deployments = useDeployments();

  return (to: "/") => {
    setDisplayTransactions(false);

    if (to === "/" && deployments.length === 1) {
      return;
    }

    if (to === "/") {
      router.push("/", undefined, { shallow: true });
    }
  };
};
