import { RouteProvider } from "@/codegen/model";
import { depositRoutes, withdrawalRoutes } from "@/constants/routes";

export const useHelpCenterLinkByProvider = (provider: RouteProvider | null) => {
  if (!provider) return null;

  if (depositRoutes.includes(provider))
    return "https://help.superbridge.app/en/articles/9747998-how-to-bridge-onto-a-rollup-from-the-settlement-chain-deposit";

  if (withdrawalRoutes.includes(provider))
    return "https://help.superbridge.app/en/articles/9748050-how-to-bridge-off-a-rollup-to-the-settlement-chain-withdraw";

  if (provider === RouteProvider.Across)
    return "https://help.superbridge.app/en/articles/9751873-how-to-bridge-via-across";
  if (provider === RouteProvider.Cctp)
    return "https://help.superbridge.app/en/articles/9751865-how-to-bridge-via-cctp";
  if (provider === RouteProvider.Hyperlane)
    return "https://help.superbridge.app/en/articles/9751857-how-to-bridge-via-hyperlane";

  return null;
};
