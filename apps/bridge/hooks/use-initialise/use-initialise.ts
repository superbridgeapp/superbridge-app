import { useEffect } from "react";
import { useAccountEffect } from "wagmi";

import { useConfigState } from "@/state/config";
import { usePendingTransactions } from "@/state/pending-txs";
import { isMainnet, isOptimism } from "@/utils/deployments/is-mainnet";

import { useDeployment } from "../deployments/use-deployment";
import { useActivityEffects } from "../use-activity-effects";
import { useIsContractAccount } from "../use-is-contract-account";
import { useInitialiseQueryParams } from "./use-initialise-query-params";
import { useInitialiseRecipient } from "./use-initialise-recipient";

export const useInitialise = () => {
  const isContractAccount = useIsContractAccount();

  const deployment = useDeployment();
  const setEasyMode = useConfigState.useSetEasyMode();
  const setForceViaL1 = useConfigState.useSetForceViaL1();
  const clearPendingTransactionsStorage = usePendingTransactions.useLogout();

  useInitialiseRecipient();
  useActivityEffects();
  useInitialiseQueryParams();

  useAccountEffect({
    onDisconnect: () => {
      clearPendingTransactionsStorage();
    },
  });

  useEffect(() => {
    if (isContractAccount.data === true) {
      setForceViaL1(false);
    }
  }, [isContractAccount.data]);

  // reset settings when changing deployment
  useEffect(() => {
    if (!deployment) {
      setEasyMode(false);
      setForceViaL1(false);
      return;
    }

    if (!isMainnet(deployment)) {
      setEasyMode(false);
      return;
    }

    if (!isOptimism(deployment)) {
      setForceViaL1(false);
      return;
    }
  }, [deployment]);
};
