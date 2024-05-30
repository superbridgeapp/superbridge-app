import { Address, isAddressEqual } from "viem";

import { useGasToken } from "@/hooks/use-approve-gas-token";
import { useBaseNativeTokenBalance } from "@/hooks/use-base-native-token-balance";
import { useFromChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { useArbitrumGasCostsInWei } from "@/hooks/use-transaction-args/deposit-args/use-arbitrum-deposit-args";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";
import { isArbitrum } from "@/utils/is-mainnet";

/**
 * When depositing to an Arbitrum rollup with a custom gas token, we
 * need to make sure we have a balance of that custom gas token on
 * the base chain.
 *
 * This is a hook to help get that required balance.
 *
 * if depositing native gas token, wei + extraAmount is < balance
 * if depositing token, extraAmount < balance
 */
export const useRequiredCustomGasTokenBalance = () => {
  const withdrawing = useConfigState.useWithdrawing();
  const stateToken = useConfigState.useToken();

  const from = useFromChain();
  const weiAmount = useWeiAmount();
  const deployment = useDeployment();
  const arbitrumGasCosts = useArbitrumGasCostsInWei();
  const gasToken = useGasToken();
  const baseNativeTokenBalance = useBaseNativeTokenBalance();

  const baseToken = stateToken?.[from?.id ?? 0];
  if (
    !deployment ||
    !isArbitrum(deployment) ||
    !deployment.arbitrumNativeToken ||
    !gasToken ||
    withdrawing ||
    typeof baseNativeTokenBalance.data === "undefined" ||
    !stateToken ||
    !baseToken ||
    !from
  ) {
    return null;
  }

  if (
    isAddressEqual(
      baseToken.address as Address,
      deployment.arbitrumNativeToken.address as Address
    )
  ) {
    return weiAmount + arbitrumGasCosts.extraAmount;
  } else {
    return arbitrumGasCosts.extraAmount;
  }
};
