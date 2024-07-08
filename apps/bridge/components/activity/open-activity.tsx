import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";
import { useAccount } from "wagmi";

import { useInProgressTxCount } from "@/hooks/use-in-progress-tx-count";
import { useStatusCheck } from "@/hooks/use-status-check";
import { useTransactions } from "@/hooks/use-transactions";
import { trackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { usePendingTransactions } from "@/state/pending-txs";

import { Loading } from "../Loading";
import { TransactionRow } from "../transaction-row";

export const OpenActivity = ({}) => {
  const account = useAccount();
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const open = useConfigState.useDisplayTransactions();
  const pendingTransactions = usePendingTransactions.useTransactions();
  const { transactions, isLoading, isError } = useTransactions();
  const { t } = useTranslation();
  const statusCheck = useStatusCheck();
  const inProgressCount = useInProgressTxCount();

  return (
    <main
      className="flex items-start justify-center w-screen h-screen fixed inset-0 px-2 md:px-0 py-16 pt-[108px] md:py-24"
      key="bridgeMain"
    >
      <motion.div
        initial={{ y: "100vh" }}
        animate={{ y: "0vh" }}
        exit={{ y: "100vh" }}
        transition={{ type: "spring", damping: 12, delay: 0.08 }}
        className="bg-card border flex flex-col self-start  z-50 relative overflow-hidden rounded-[32px] h-[calc(76dvh)] max-h-[680px]  w-screen md:w-[50vw] md:max-w-[420px] aspect-[3/4] backdrop-blur shadow-sm"
      >
        <div
          className="flex items-center justify-between pl-6 pr-4 py-4 md:py-6 border-b cursor-pointer z-10"
          onClick={() => {
            setDisplayTransactions(!open);
            trackEvent({ event: "close-activity" });
          }}
        >
          <h2 className="font-heading text-sm md:text-base">
            {t("activity.activity")}
          </h2>
          <div className="flex gap-2 items-center">
            <div
              className={`bg-muted flex items-center justify-center w-6 h-6 text-center rounded-full ${
                inProgressCount <= 0 ? "hidden" : "visible"
              }`}
            >
              <span className="text-xs  text-foreground">
                {inProgressCount}
              </span>
            </div>
            <div
              className={`flex items-center transition-all cursor-pointer w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-muted hover:scale-105`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="fill-foreground w-3.5 h-3.5"
              >
                <path d="M0.562404 13.4244C-0.205637 12.6425 -0.187241 11.8653 0.617592 11.0697L4.68315 7.00411L0.617592 2.95695C-0.178043 2.14752 -0.205637 1.37028 0.589998 0.574646C1.38563 -0.220989 2.13528 -0.193394 2.95851 0.616038L7.01027 4.6678L11.062 0.629835C11.8577 -0.179597 12.6349 -0.193394 13.4167 0.574646C14.2124 1.37028 14.1848 2.16132 13.3891 2.97075L9.33738 7.00871L13.3891 11.0329C14.1986 11.8561 14.1986 12.6196 13.4167 13.4152C12.6349 14.197 11.8577 14.1832 11.0482 13.3876L7.01027 9.33583L2.95851 13.4014C2.14907 14.197 1.35804 14.2108 0.562404 13.429V13.4244Z" />
              </svg>
              <span className="sr-only">Close</span>
            </div>
          </div>
        </div>
        {match({
          statusCheck,
          isError,
          isLoading,
          transactions,
          account,
          pendingTransactions,
        })
          .with({ account: { address: undefined } }, () => (
            <div className="flex grow justify-center items-center h-full">
              <span className="text-muted-foreground text-xs font-heading">
                {t("activity.connectWallet")}
              </span>
            </div>
          ))
          .with({ isLoading: true }, () => (
            <div>
              <Loading />
            </div>
          ))
          .with({ isError: true }, () => (
            <div className="flex grow justify-center h-full px-8 py-8 text-center">
              <span className="text-muted-foreground text-xs font-heading">
                {t("activity.error")}…
              </span>
            </div>
          ))
          .with({ statusCheck: true }, () => (
            <div className="flex grow justify-center h-full px-8 py-8 text-center">
              <span className="text-zinc-400 text-xs font-heading">
                {t("activity.error")}.
              </span>
            </div>
          ))
          .with(
            { transactions: P.any, pendingTransactions: P.any },
            ({ transactions, pendingTransactions }) => {
              if (
                transactions.length === 0 &&
                pendingTransactions.length === 0
              ) {
                return (
                  <div className="flex grow justify-center items-center h-full">
                    <span className="text-muted-foreground text-xs font-heading">
                      {t("activity.noTransactions")}
                    </span>
                  </div>
                );
              }

              return (
                <div className="overflow-y-auto overflow-x-hidden">
                  {[...pendingTransactions, ...transactions].map((t) => {
                    return <TransactionRow key={t.id} tx={t} />;
                  })}
                </div>
              );
            }
          )
          .otherwise(() => null)}
      </motion.div>
    </main>
  );
};
