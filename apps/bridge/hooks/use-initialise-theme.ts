import { useEffect, useState } from "react";

import { useConfigState } from "@/state/config";

export const useInitialiseTheme = () => {
  const deployment = useConfigState.useDeployment();
  const [themeValues, setThemeValues] = useState(null);

  useEffect(() => {
    const theme = deployment?.theme?.theme;

    if (theme) {
      Object.entries(theme).forEach(([key, value]) => {
        if (!value) {
          return;
        }

        const formattedKey = key.includes("dark")
          ? `--${key}`
          : `--${key}-light`;
        document.documentElement.style.setProperty(formattedKey, value);
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
          if (!value) return;

          const formattedKey = key.includes("dark")
            ? `--${key}`
            : `--${key}-light`;
          document.documentElement.style.setProperty(
            formattedKey,
            value as string
          );
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
