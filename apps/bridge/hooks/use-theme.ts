import { isSuperbridge } from "@/config/superbridge";

import { useDeployments } from "./use-deployments";
import { useContext } from "react";
import { ThemeContext } from "@/state/theme";

export const useNavIcon = () => {
  const { deployments } = useDeployments();

  const theme = useContext(ThemeContext);

  if (theme?.imageLogo) return theme.imageLogo;
  if (deployments.length === 1) return deployments[0].theme?.theme.imageLogo;
  if (isSuperbridge) return "/img/logo.svg";
  return "/img/rollbridge-logo.svg";
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
