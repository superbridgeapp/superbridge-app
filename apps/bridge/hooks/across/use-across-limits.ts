import { useQuery } from "@tanstack/react-query";

import { useConfigState } from "@/state/config";

import { useAcrossParams } from "./use-across-params";

interface AcrossLimitsResult {
  /**
   * The minimum deposit size in the tokens' units.
   * Note: USDC has 6 decimals, so this value would be the
   *  number of USDC multiplied by 1e6. For WETH, that would be 1e18.
   */
  minDeposit: 7799819;
  /**
   * The maximum deposit size in the tokens' units.
   * Note: The formatting of this number is the same as minDeposit.
   */
  maxDeposit: 22287428516241;
  /**
   * The max deposit size that can be relayed "instantly" on the destination
   * chain. Instantly means that there is relayer capital readily available
   * and that a relayer is expected to relay within seconds to 5 minutes of the deposit.
   */
  maxDepositInstant: 201958902363;
  /**
   * The max deposit size that can be relayed with a "short delay" on the destination
   * chain. This means that there is relayer capital available on mainnet and that
   * a relayer will immediately begin moving that capital over the canonical bridge to
   * relay the deposit. Depending on the chain, the time for this can vary. Polygon is
   * the worst case where it can take between 20 and 35 minutes for the relayer to receive
   * the funds and relay. Arbitrum is much faster, with a range between 5 and 15 minutes.
   * Note: if the transfer size is greater than this, the estimate should be between 2-4
   * hours for a slow relay to be processed from the mainnet pool.
   */
  maxDepositShortDelay: 2045367713809;
  /**
   * The recommended deposit size that can be relayed "instantly" on the destination chain.
   * Instantly means that there is relayer capital readily available and that a relayer is
   * expected to relay within seconds to 5 minutes of the deposit. Value is in the smallest
   * unit of the respective token.
   */
  recommendedDepositInstant: 2045367713809;
}

/**
 * maxDepositInstant: check this value first.
 *  if the user's amount is less than or equal to this amount, there
 *  is known to be enough relayer liquidity on the destination chain
 *  to fill them immediately.
 *
 * maxDepositShortDelay: if the user's deposit amount is larger than maxDepositInstant
 *  If the user's amount is less than or equal to this amount, there is
 *  known to be enough relayer liquidity that can be moved to the destination
 * chain within 30 minutes, so you should expect them to be filled within
 * that time frame.
 *
 * maxDeposit: if the user's deposit amount is larger than maxDepositShortDelay
 *  If the user's amount is less than or equal to this amount, there is enough
 * liquidity in Across to fill them via a slow fill, which could take up to 3 hours.
 * If the user's deposit amount is larger than this, Across cannot fulfil the user's
 * intent.
 *
 * reccommendedDepositInstant: this is used for certain integrations to limit the input size,
 *  and is currently hardcoded to 2 ETH/WETH and 5,000 USDC
 */
export const useAcrossLimits = () => {
  const fast = useConfigState.useFast();
  const params = useAcrossParams();

  const paramsString = params ? new URLSearchParams(params).toString() : "";
  return useQuery({
    queryKey: ["across quote", paramsString],
    queryFn: () =>
      fetch(`https://app.across.to/api/limits?${paramsString}`).then(
        async (x) => (await x.json()) as AcrossLimitsResult
      ),
    enabled: fast && !!paramsString,
  });
};
