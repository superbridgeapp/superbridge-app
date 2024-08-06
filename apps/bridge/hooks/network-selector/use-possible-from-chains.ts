import { useAllTokens } from "../tokens";
import { useChains } from "../use-chains";

/**
 * Tokens that have a route
 */
export const usePossibleFromChains = () => {
  const chains = useChains();
  const tokens = useAllTokens();

  return chains.filter((chain) => !!tokens.find((t) => t[chain.id]));
};
