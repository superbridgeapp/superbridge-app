import { useAccount, useBalance } from "wagmi";

import { useToChain } from "@/hooks/use-chain";
import { useFaultProofUpgradeTime } from "@/hooks/use-fault-proof-upgrade-time";
import { AlertName, useModalsState } from "@/state/modals";
import { isEth } from "@/utils/tokens/is-eth";

import { useIsCctpRoute } from "../cctp/use-is-cctp-route";
import { useDeployment } from "../deployments/use-deployment";
import { useEstimateTotalNetworkFees } from "../gas/use-total-network-fees";
import { useDestinationToken } from "../tokens/use-token";
import { useSendAmount } from "../use-send-amount";
import { useIsWithdrawal } from "../use-withdrawing";
import { useInitiateBridge } from "./use-initiate-bridge";

export const useSubmitBridge = () => {
  const account = useAccount();
  const to = useToChain();
  const deployment = useDeployment();
  const initiateBridge = useInitiateBridge();

  const withdrawing = useIsWithdrawal();
  const destinationToken = useDestinationToken();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);
  const setAlerts = useModalsState.useSetAlerts();
  const isCctp = useIsCctpRoute();

  const toEthBalance = useBalance({
    address: account.address,
    chainId: to?.id,
  });

  const sendAmount = useSendAmount();
  const fiatValueBeingBridged = sendAmount.data?.fiat?.amount ?? null;
  const totalNetworkFees = useEstimateTotalNetworkFees();

  return () => {
    const modals: AlertName[] = [];

    const needDestinationGasConditions = [
      withdrawing, // need to prove/finalize
      isCctp, // need to mint
      !isEth(destinationToken), // bridging an ERC20 with no gas on the destination (won't be able to do anything with it)
    ];
    if (
      needDestinationGasConditions.some((x) => x) &&
      toEthBalance.data?.value === BigInt(0)
    ) {
      modals.push("no-gas");
    }

    if (
      fiatValueBeingBridged &&
      totalNetworkFees.data &&
      totalNetworkFees.data > fiatValueBeingBridged
    ) {
      modals.push("gas-expensive");
    }

    if (faultProofUpgradeTime && withdrawing) {
      modals.push("fault-proofs");
    }

    if (modals.length === 0) {
      initiateBridge();
    } else {
      setAlerts(modals);
    }
  };
};
