import { useEffect } from "react";

import { useConfigState } from "@/state/config";
import { useThemeState } from "@/state/theme";

export const useInitialiseTheme = () => {
  const deployment = useConfigState.useDeployment();
  const setNavIcon = useThemeState.useSetNavIcon();
  const setDarkModeEnabled = useThemeState.useSetDarkModeEnabled();

  useEffect(() => {
    const theme = deployment?.theme?.theme;
    if (theme) {
      Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
      });
    }
  }, [deployment]);

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (e.data === "refresh") {
        window.location.reload();
      }

      if (e.data.theme) {
        Object.entries(e.data.theme).forEach(([key, value]) => {
          console.log("Set", key, value);
          if (key && value) {
            if (key === "darkModeEnabled") {
              setDarkModeEnabled(value as boolean);
            } else if (key === "navIconSrc") {
              setNavIcon(value as string);
            } else {
              document.documentElement.style.setProperty(
                `--${key}`,
                value as string
              );
            }
          }
        });
      }
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);
};
