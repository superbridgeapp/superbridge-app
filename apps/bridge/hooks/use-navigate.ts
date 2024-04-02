import { DeploymentDto } from "@/codegen/model";
import { useConfigState } from "@/state/config";
import { useRouter } from "next/router";
import { useDeployments } from "./use-deployments";

export const useNavigate = () => {
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const setDeployment = useConfigState.useSetDeployment();
  const router = useRouter();
  const { deployments } = useDeployments();

  return (to: "/" | DeploymentDto) => {
    setDisplayTransactions(false);

    if (to === "/" && deployments.length === 1) {
      return;
    }

    if (to === "/") {
      router.push("/");
      // this stops the error rendering when you navigate /id to /
      setTimeout(() => {
        setDeployment(null);
      }, 300);
    } else {
      console.log("hier");
      router.push(`/${to.name}`);
      setDeployment(to);
    }
  };
};
