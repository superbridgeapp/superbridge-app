import { useTheme } from "next-themes";
import { useContext } from "react";

import { isSuperbridge } from "@/config/superbridge";
import { ThemeContext } from "@/state/theme";

import { useDeployments } from "./use-deployments";
import { useDeployment } from "./use-deployment";

export const useNavIcon = () => {
  const { deployments } = useDeployments();
  const theme = useContext(ThemeContext);
  const { resolvedTheme } = useTheme();

  if (isSuperbridge) return "/img/logo.svg";

  if (resolvedTheme === "light") {
    return (
      theme?.imageLogo ??
      deployments[0]?.theme?.theme.imageLogo ??
      "/img/rollbridge-logo.svg"
    );
  }

  return (
    theme?.imageLogoDark ??
    deployments[0]?.theme?.theme.imageLogoDark ??
    "/img/rollbridge-logo-dark.svg"
  );
};

export const useNetworkIcon = () => {
  const { deployments } = useDeployments();
  const deployment = useDeployment();
  const theme = useContext(ThemeContext);

  const defaultIcon = "/img/L2.svg";

  return (
    theme?.imageNetwork ??
    deployment?.theme?.theme.imageNetwork ??
    deployments[0].theme?.theme.imageNetwork ??
    defaultIcon
  );
};

export const useBackgroundIcon = () => {
  const deployment = useDeployment();
  const theme = useContext(ThemeContext);
  const { resolvedTheme } = useTheme();

  const defaultIcon = null;

  if (resolvedTheme === "light") {
    return (
      theme?.imageBackground ??
      deployment?.theme?.theme.imageBackground ??
      defaultIcon
    );
  }

  return (
    theme?.imageBackgroundDark ??
    deployment?.theme?.theme.imageBackgroundDark ??
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
  const deployment = useDeployment();
  const { resolvedTheme } = useTheme();

  const theme = useContext(ThemeContext);

  if (resolvedTheme === "light") {
    if (theme?.backgroundImageOpacity !== undefined) {
      return theme.backgroundImageOpacity;
    }
    return deployment?.theme?.theme.backgroundImageOpacity;
  }
  if (resolvedTheme === "dark")
    if (theme?.backgroundImageOpacityDark !== undefined) {
      return theme.backgroundImageOpacityDark;
    }
  return deployment?.theme?.theme.backgroundImageOpacityDark;
};

export const useBackgroundImageSize = () => {
  const deployment = useDeployment();

  const theme = useContext(ThemeContext);

  if (theme?.backgroundImageSize !== undefined) {
    return theme.backgroundImageSize;
  }
  return deployment?.theme?.theme.backgroundImageSize;
};

export const useBackgroundImagePosition = () => {
  const deployment = useDeployment();

  const theme = useContext(ThemeContext);

  if (theme?.backgroundImagePosition !== undefined) {
    return theme.backgroundImagePosition;
  }
  return deployment?.theme?.theme.backgroundImagePosition;
};

export const useBackgroundImageRepeat = () => {
  const deployment = useDeployment();

  const theme = useContext(ThemeContext);

  if (theme?.backgroundImageRepeat !== undefined) {
    return theme.backgroundImageRepeat;
  }
  return deployment?.theme?.theme.backgroundImageRepeat;
};
