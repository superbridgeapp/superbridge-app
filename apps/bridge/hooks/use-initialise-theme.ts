import { useConfigState } from "@/state/config";
import { useEffect } from "react";

export const useInitialiseTheme = () => {
  const deployment = useConfigState.useDeployment();

  useEffect(() => {
    console.log(">>>", deployment?.theme?.theme.bg);
    if (deployment?.theme?.theme.bg)
      document.documentElement.style.setProperty(
        "--background",
        deployment?.theme?.theme.bg
      );
  }, [deployment]);
};
