import { useTheme as useNextTheme } from "next-themes";
import { useContext } from "react";
import { bsc, bscTestnet, holesky, mainnet, sepolia } from "viem/chains";

import { ThemeContext } from "@/state/theme";

import { useDeployments } from "./deployments/use-deployments";

const defaultImages = {
  nav: "https://raw.githubusercontent.com/superbridgeapp/assets/f173992662b83e832b24e385da017ffdbd0138b8/rollies/sb-rollies-stamp.svg",
  navDark:
    "https://raw.githubusercontent.com/superbridgeapp/assets/f173992662b83e832b24e385da017ffdbd0138b8/rollies/sb-rollies-stamp.svg",
  l2: "https://raw.githubusercontent.com/superbridgeapp/assets/main/rollies/L2.png",
  l3: "https://raw.githubusercontent.com/superbridgeapp/assets/main/rollies/L3.png",
};

const L1s: number[] = [
  mainnet.id,
  bsc.id,
  sepolia.id,
  bscTestnet.id,
  holesky.id,
];

export const useNavIcon = () => {
  const theme = useContext(ThemeContext);
  const { resolvedTheme } = useNextTheme();

  if (resolvedTheme === "light") {
    return theme?.imageLogo || defaultImages.nav;
  }

  return theme?.imageLogoDark || defaultImages.navDark;
};

export const useNetworkIcon = (deploymentId?: string) => {
  const deployments = useDeployments();

  const deployment = deployments.find((d) => d.id === deploymentId);
  const defaultIcon = L1s.includes(deployment?.l1ChainId ?? 0)
    ? defaultImages.l2
    : defaultImages.l3;

  return deployment?.rollupNetworkIcon ?? defaultIcon;
};

export const useBackgroundIcon = () => {
  const theme = useContext(ThemeContext);
  const { resolvedTheme } = useNextTheme();

  if (resolvedTheme === "light") {
    return theme?.imageBackground;
  } else {
    return theme?.imageBackgroundDark;
  }
};

export const useDarkModeEnabled = () => {
  return !!useContext(ThemeContext)?.darkModeEnabled;
};

export const useBackgroundImageBlendMode = () => {
  const { resolvedTheme } = useNextTheme();
  const theme = useContext(ThemeContext);

  if (resolvedTheme === "light") {
    return theme?.backgroundImageBlendMode;
  } else {
    return theme?.backgroundImageBlendModeDark;
  }
};

export const useBackgroundImageOpacity = () => {
  const { resolvedTheme } = useNextTheme();
  const theme = useContext(ThemeContext);

  if (resolvedTheme === "light") {
    return theme?.backgroundImageOpacity;
  } else {
    return theme?.backgroundImageOpacityDark;
  }
};

export const useBackgroundImageSize = () => {
  return useContext(ThemeContext)?.backgroundImageSize;
};

export const useBackgroundImagePosition = () => {
  return useContext(ThemeContext)?.backgroundImagePosition;
};

export const useBackgroundImageRepeat = () => {
  return useContext(ThemeContext)?.backgroundImageRepeat;
};

export const useRainbowMode = () => {
  return useContext(ThemeContext)?.rainbowMode;
};

export const useTheme = () => useContext(ThemeContext);
