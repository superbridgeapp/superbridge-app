import { useAccount, useBalance } from "wagmi";

import { useEstimateTotalFeesInFiat } from "@/components/modals/alerts/expensive-gas-modal";
import { SUPERCHAIN_MAINNETS } from "@/constants/superbridge";
import { useToChain } from "@/hooks/use-chain";
import { useFaultProofUpgradeTime } from "@/hooks/use-fault-proof-upgrade-time";
import { useReceiveAmount } from "@/hooks/use-receive-amount";
import { AlertName, useModalsState } from "@/state/modals";
import { isEth } from "@/utils/tokens/is-eth";

import { useIsSuperbridge } from "../apps/use-is-superbridge";
import { useIsCctpRoute } from "../cctp/use-is-cctp-route";
import { useDeployment } from "../deployments/use-deployment";
import { useDestinationToken } from "../tokens/use-token";
import { useIsWithdrawal } from "../use-withdrawing";
import { useInitiateBridge } from "./use-initiate-bridge";

export const useSubmitBridge = () => {
  const account = useAccount();
  const to = useToChain();
  const deployment = useDeployment();
  const initiateBridge = useInitiateBridge();
  const isSuperbridge = useIsSuperbridge();

  const withdrawing = useIsWithdrawal();
  const destinationToken = useDestinationToken();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);
  const setAlerts = useModalsState.useSetAlerts();
  const isCctp = useIsCctpRoute();

  const toEthBalance = useBalance({
    address: account.address,
    chainId: to?.id,
  });

  const receive = useReceiveAmount();
  const totalFeesInFiat = useEstimateTotalFeesInFiat();
  const fiatValueBeingBridged = receive.data?.fiat?.amount ?? null;

  return () => {
    const modals: AlertName[] = [];

    const needDestinationGasConditions = [
      withdrawing, // need to prove/finalize
      isCctp, // need to mint
      !withdrawing && !isEth(destinationToken), // depositing an ERC20 with no gas on the destination (won't be able to do anything with it)
    ];
    if (
      needDestinationGasConditions.some((x) => x) &&
      toEthBalance.data?.value === BigInt(0)
    ) {
      modals.push("NoGas");
    }

    if (
      totalFeesInFiat &&
      fiatValueBeingBridged &&
      totalFeesInFiat > fiatValueBeingBridged &&
      isSuperbridge &&
      SUPERCHAIN_MAINNETS.includes(deployment?.name ?? "")
    ) {
      modals.push("GasExpensive");
    }

    if (faultProofUpgradeTime && withdrawing) {
      modals.push("FaultProofs");
    }

    if (modals.length === 0) {
      return initiateBridge();
    } else {
      setAlerts(modals);
    }
  };
};
