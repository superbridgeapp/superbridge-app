import { isSuperbridge } from "@/config/superbridge";
import { useDeployments } from "./use-deployments";
import { useThemeState } from "@/state/theme";

export const useNavIcon = () => {
  const { deployments } = useDeployments();
  const navIcon = useThemeState.useNavIcon();

  if (navIcon) return navIcon;

  if (deployments.length === 1) return deployments[0].theme?.theme.navIconSrc;
  if (isSuperbridge) return "/img/logo.svg";
  return "/img/rollbridge-logo.svg";
};
export const useNavIconDark = () => {
  const { deployments } = useDeployments();

  if (deployments.length === 1) return deployments[0].theme?.theme.navIconSrc;
  if (isSuperbridge) return "/img/logo-dark.svg";
  return "/img/rollbridge-logo-dark.svg";
};
export const useNavIconSmall = () => {
  const { deployments } = useDeployments();

  if (deployments.length === 1) return null;
  if (isSuperbridge) return "/img/logo-small.svg";
  return "/img/rollbridge-logo-small.svg";
};
export const useNavIconSmallDark = () => {
  const { deployments } = useDeployments();

  if (deployments.length === 1) return null;
  if (isSuperbridge) return "/img/logo-small-dark.svg";
  return "/img/rollbridge-logo-small-dark.svg";
};
