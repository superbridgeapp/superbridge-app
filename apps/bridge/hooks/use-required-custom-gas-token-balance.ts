import { Address, isAddressEqual } from "viem";

import { useGasToken } from "@/hooks/use-approve-gas-token";
import { useBaseNativeTokenBalance } from "@/hooks/use-base-native-token-balance";
import { useDeployment } from "@/hooks/use-deployment";
import { useWeiAmount } from "@/hooks/use-wei-amount";

import { useArbitrumGasCostsInWei } from "./arbitrum/use-arbitrum-gas-costs";
import { useSelectedToken } from "./tokens/use-token";
import {
  useIsArbitrumDeposit,
  useIsArbitrumWithdrawal,
} from "./use-withdrawing";

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
  const withdrawing = useIsArbitrumWithdrawal();
  const token = useSelectedToken();

  const weiAmount = useWeiAmount();
  const arbitrumGasCosts = useArbitrumGasCostsInWei();
  const gasToken = useGasToken();
  const deployment = useDeployment();
  const baseNativeTokenBalance = useBaseNativeTokenBalance();
  const isArbitrumDeposit = useIsArbitrumDeposit();

  if (
    !isArbitrumDeposit ||
    !deployment?.arbitrumNativeToken ||
    !gasToken ||
    withdrawing ||
    typeof baseNativeTokenBalance.data === "undefined" ||
    !token
  ) {
    return null;
  }

  if (
    isAddressEqual(
      token.address as Address,
      deployment.arbitrumNativeToken.address as Address
    )
  ) {
    return weiAmount + arbitrumGasCosts.extraAmount;
  } else {
    return arbitrumGasCosts.extraAmount;
  }
};
