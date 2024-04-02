import { useConfigState } from "@/state/config";
import { useEffect } from "react";

export const useInitialiseTheme = () => {
  const deployment = useConfigState.useDeployment();

  useEffect(() => {
    if (deployment?.theme?.theme.bg)
      document.documentElement.style.setProperty(
        "--background",
        deployment?.theme?.theme.bg
      );
  }, [deployment]);
};
