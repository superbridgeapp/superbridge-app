import { useEffect, useState } from "react";

import { useConfigState } from "@/state/config";

export const useInitialiseTheme = () => {
  const deployment = useConfigState.useDeployment();
  const [themeValues, setThemeValues] = useState(null);

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
          if (key && value) {
            document.documentElement.style.setProperty(
              `--${key}`,
              value as string
            );
          }
        });
        setThemeValues(e.data.theme);
      }
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  return themeValues;
};
