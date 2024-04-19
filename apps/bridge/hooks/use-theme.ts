import { isSuperbridge } from "@/config/superbridge";

import { useDeployments } from "./use-deployments";
import { useContext } from "react";
import { ThemeContext } from "@/state/theme";
import { useTheme } from "next-themes";

export const useNavIcon = () => {
  const { deployments } = useDeployments();
  const theme = useContext(ThemeContext);
  const { resolvedTheme } = useTheme();

  const defaultIcon = "/img/rollbridge-logo.svg";

  if (isSuperbridge) return "/img/logo.svg";

  if (resolvedTheme === "light") {
    return (
      theme?.imageLogo ?? deployments[0]?.theme?.theme.imageLogo ?? defaultIcon
    );
  }

  return (
    theme?.imageLogoDark ??
    deployments[0]?.theme?.theme.imageLogoDark ??
    defaultIcon
  );
};

export const useNetworkIcon = () => {
  const { deployments } = useDeployments();
  const theme = useContext(ThemeContext);

  const defaultIcon = "/img/L2.svg";

  if (isSuperbridge) return "/img/logo.svg";

  return (
    theme?.imageNetwork ??
    deployments[0].theme?.theme.imageNetwork ??
    defaultIcon
  );
};

export const useBackgroundIcon = () => {
  const { deployments } = useDeployments();
  const theme = useContext(ThemeContext);
  const { resolvedTheme } = useTheme();

  const defaultIcon = null;

  if (resolvedTheme === "light") {
    return (
      theme?.imageBackground ??
      deployments[0]?.theme?.theme.imageBackground ??
      defaultIcon
    );
  }

  return (
    theme?.imageBackgroundDark ??
    deployments[0]?.theme?.theme.imageBackgroundDark ??
    defaultIcon
  );
};

export const useDarkModeEnabled = () => {
  const { deployments } = useDeployments();

  const theme = useContext(ThemeContext);

  if (theme?.darkModeEnabled !== undefined) return theme?.darkModeEnabled;

  if (deployments.length > 1) return true;
  return deployments[0]?.theme?.theme.darkModeEnabled;
};

export const useBackgroundImageBlendMode = () => {
  const { deployments } = useDeployments();
  const { resolvedTheme } = useTheme();

  const theme = useContext(ThemeContext);

  if (resolvedTheme === "light") {
    if (theme?.backgroundImageBlendMode !== undefined) {
      return theme.backgroundImageBlendMode;
    }
    return deployments[0]?.theme?.theme.backgroundImageBlendMode;
  }
  if (resolvedTheme === "dark")
    if (theme?.backgroundImageBlendModeDark !== undefined) {
      return theme.backgroundImageBlendModeDark;
    }
  return deployments[0]?.theme?.theme.backgroundImageBlendModeDark;
};

export const useBackgroundImageOpacity = () => {
  const { deployments } = useDeployments();
  const { resolvedTheme } = useTheme();

  const theme = useContext(ThemeContext);

  if (resolvedTheme === "light") {
    if (theme?.backgroundImageOpacity !== undefined) {
      return theme.backgroundImageOpacity;
    }
    return deployments[0]?.theme?.theme.backgroundImageOpacity;
  }
  if (resolvedTheme === "dark")
    if (theme?.backgroundImageOpacityDark !== undefined) {
      return theme.backgroundImageOpacityDark;
    }
  return deployments[0]?.theme?.theme.backgroundImageOpacityDark;
};

export const useBackgroundImageStyle = () => {
  const { deployments } = useDeployments();

  const theme = useContext(ThemeContext);

  if (theme?.backgroundImageStyle !== undefined) {
    return theme.backgroundImageStyle;
  }
  return deployments[0]?.theme?.theme.backgroundImageStyle;
};
