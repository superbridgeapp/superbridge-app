import { useTheme } from "next-themes";
import { useContext } from "react";
import { bsc, bscTestnet, holesky, mainnet, sepolia } from "viem/chains";

import { isSuperbridge } from "@/config/superbridge";
import { ThemeContext } from "@/state/theme";

import { useDeployments } from "./use-deployments";
import { useDeployment } from "./use-deployment";

export const defaultImages = {
  nav: "https://raw.githubusercontent.com/superbridgeapp/assets/f173992662b83e832b24e385da017ffdbd0138b8/rollies/sb-rollies-stamp.svg",
  navDark:
    "https://raw.githubusercontent.com/superbridgeapp/assets/f173992662b83e832b24e385da017ffdbd0138b8/rollies/sb-rollies-stamp.svg",
};

const L1s: number[] = [
  mainnet.id,
  bsc.id,
  sepolia.id,
  bscTestnet.id,
  holesky.id,
];

export const useNavIcon = () => {
  const { deployments } = useDeployments();
  const theme = useContext(ThemeContext);
  const { resolvedTheme } = useTheme();

  if (isSuperbridge) return "/img/logo.svg";

  if (resolvedTheme === "light") {
    return (
      theme?.imageLogo ??
      deployments[0]?.theme?.theme.imageLogo ??
      defaultImages.nav
    );
  }

  return (
    theme?.imageLogoDark ??
    deployments[0]?.theme?.theme.imageLogoDark ??
    defaultImages.navDark
  );
};

export const useNetworkIcon = (deploymentId?: string) => {
  const { deployments } = useDeployments();
  const theme = useContext(ThemeContext);

  const deployment = deployments.find((d) => d.id === deploymentId);
  const defaultIcon = L1s.includes(deployment?.l1.id ?? 0)
    ? "https://raw.githubusercontent.com/superbridgeapp/assets/main/rollies/L2.png"
    : "https://raw.githubusercontent.com/superbridgeapp/assets/main/rollies/L3.png";

  return (
    theme?.imageNetwork ?? deployment?.theme?.theme.imageNetwork ?? defaultIcon
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
  const deployment = useDeployment();

  const { resolvedTheme } = useTheme();

  const theme = useContext(ThemeContext);

  if (resolvedTheme === "light") {
    if (theme?.backgroundImageBlendMode !== undefined) {
      return theme.backgroundImageBlendMode;
    }
    return deployment?.theme?.theme.backgroundImageBlendMode;
  }
  if (resolvedTheme === "dark")
    if (theme?.backgroundImageBlendModeDark !== undefined) {
      return theme.backgroundImageBlendModeDark;
    }
  return deployment?.theme?.theme.backgroundImageBlendModeDark;
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
