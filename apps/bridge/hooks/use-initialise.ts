import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccountEffect } from "wagmi";

import { useConfigState } from "@/state/config";
import { usePendingTransactions } from "@/state/pending-txs";
import { isMainnet, isOptimism } from "@/utils/is-mainnet";

import { useDeployment } from "./use-deployment";
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
  const setFast = useConfigState.useSetFast();
  const setWithdrawing = useConfigState.useSetWithdrawing();
  const clearPendingTransactionsStorage = usePendingTransactions.useLogout();

  useInitialiseRecipient();
  useTokenLists();
  useInitialiseToken();

  useAccountEffect({
    onDisconnect: () => {
      clearPendingTransactionsStorage();
    },
  });

  useEffect(() => {
    const direction = router.query.direction as string | undefined;
    if (direction === "withdraw") {
      setWithdrawing(true);
    }
  }, []);

  useEffect(() => {
    if (router.asPath === "/fast") {
      setFast(true);
    }
  }, []);

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
