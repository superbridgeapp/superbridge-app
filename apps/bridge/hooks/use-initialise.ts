import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccountEffect } from "wagmi";

import { useConfigState } from "@/state/config";
import { usePendingTransactions } from "@/state/pending-txs";
import { isMainnet, isOptimism } from "@/utils/is-mainnet";

import { useActivityEffects } from "./use-activity-effects";
import { useDeployment } from "./use-deployment";
import { useInitialiseQueryParams } from "./use-initialise-query-params";
import { useInitialiseToken } from "./use-initialise-token";
import { useIsContractAccount } from "./use-is-contract-account";
import { useInitialiseRecipient } from "./use-recipient";
import { useTokenLists } from "./use-token-lists";

export const useInitialise = () => {
  const router = useRouter();

  const isContractAccount = useIsContractAccount();

  const deployment = useDeployment();
  const setEasyMode = useConfigState.useSetEasyMode();
  const setForceViaL1 = useConfigState.useSetForceViaL1();
  const clearPendingTransactionsStorage = usePendingTransactions.useLogout();

  useInitialiseRecipient();
  useTokenLists();
  useInitialiseToken();
  useActivityEffects();
  // useInitialiseQueryParams();

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
