import { Address, isAddressEqual } from "viem";

import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useBaseNativeTokenBalance } from "@/hooks/use-base-native-token-balance";
import { useWeiAmount } from "@/hooks/use-wei-amount";

import { useArbitrumGasCostsInWei } from "./arbitrum/use-arbitrum-gas-costs";
import { useCustomGasTokenAddress } from "./custom-gas-token/use-custom-gas-token-address";
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
  const deployment = useDeployment();
  const customGasToken = useCustomGasTokenAddress(deployment?.id);
  const baseNativeTokenBalance = useBaseNativeTokenBalance();
  const isArbitrumDeposit = useIsArbitrumDeposit();

  if (
    !isArbitrumDeposit ||
    !customGasToken ||
    withdrawing ||
    typeof baseNativeTokenBalance.data === "undefined" ||
    !token
  ) {
    return null;
  }

  if (isAddressEqual(token.address as Address, customGasToken as Address)) {
    return weiAmount + arbitrumGasCosts.extraAmount;
  } else {
    return arbitrumGasCosts.extraAmount;
  }
};
