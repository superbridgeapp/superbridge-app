import { isSuperbridge } from "@/config/superbridge";

import { useDeployments } from "./use-deployments";
import { useContext } from "react";
import { ThemeContext } from "@/state/theme";
import { useTheme } from "next-themes";

export const useNavIcon = () => {
  const { deployments } = useDeployments();

  const theme = useContext(ThemeContext);

  if (theme?.imageLogo) return theme.imageLogo;
  if (deployments.length === 1) return deployments[0].theme?.theme.imageLogo;
  if (isSuperbridge) return "/img/logo.svg";
  return "/img/rollbridge-logo.svg";
};

export const useNetworkIcon = () => {
  const { deployments } = useDeployments();

  const theme = useContext(ThemeContext);
  if (theme?.imageNetwork) return theme.imageNetwork;
  if (deployments.length === 1) return deployments[0].theme?.theme.imageNetwork;
  if (isSuperbridge) return "/img/logo.svg";
  return "/img/rollbridge-logo.svg";
};

export const useBackgroundIcon = () => {
  const { deployments } = useDeployments();

  const theme = useContext(ThemeContext);
  if (theme?.imageBackground) return theme.imageBackground;
  if (deployments.length === 1)
    return deployments[0].theme?.theme.imageBackground;
  return null;
};

// export const useNavIconDark = () => {
//   const { deployments } = useDeployments();

//   if (deployments.length === 1) return deployments[0].theme?.theme.navIconSrc;
//   if (isSuperbridge) return "/img/logo-dark.svg";
//   return "/img/rollbridge-logo-dark.svg";
// };
// export const useNavIconSmall = () => {
//   const { deployments } = useDeployments();

//   if (deployments.length === 1) return null;
//   if (isSuperbridge) return "/img/logo-small.svg";
//   return "/img/rollbridge-logo-small.svg";
// };
// export const useNavIconSmallDark = () => {
//   const { deployments } = useDeployments();

//   if (deployments.length === 1) return null;
//   if (isSuperbridge) return "/img/logo-small-dark.svg";
//   return "/img/rollbridge-logo-small-dark.svg";
// };

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
