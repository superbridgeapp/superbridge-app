import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";
import { useAccount } from "wagmi";

import { useInProgressTxCount } from "@/hooks/use-in-progress-tx-count";
import { useStatusCheck } from "@/hooks/use-status-check";
import { useTransactions } from "@/hooks/use-transactions";
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
      className="flex items-start justify-center w-screen h-screen fixed inset-0 px-2 md:px-0 py-16 md:py-24 xl:py-32"
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
          onClick={() => setDisplayTransactions(!open)}
        >
          <h2 className="font-bold text-sm md:text-base">
            {t("activity.activity")}
          </h2>
          <div className="flex gap-2 items-center">
            <div
              className={`bg-muted flex items-center justify-center w-6 h-6 text-center rounded-full ${
                inProgressCount <= 0 ? "hidden" : "visible"
              }`}
            >
              <span className="text-xs font-medium text-foreground">
                {inProgressCount}
              </span>
            </div>
            <div
              className={`flex items-center transition-all cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 hover:dark:bg-zinc-800 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 256 256"
                className="fill-zinc-900 dark:fill-zinc-50"
              >
                <path d="M216.49 168.49a12 12 0 01-17 0L128 97l-71.51 71.49a12 12 0 01-17-17l80-80a12 12 0 0117 0l80 80a12 12 0 010 17z"></path>
              </svg>
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
              <span className="text-muted-foreground text-xs font-bold">
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
              <span className="text-muted-foreground text-xs font-bold">
                {t("activity.error")}
              </span>
            </div>
          ))
          .with({ statusCheck: true }, () => (
            <div className="flex grow justify-center h-full px-8 py-8 text-center">
              <span className="text-zinc-400 text-xs font-bold">
                {t("activity.error")}
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
                    <span className="text-muted-foreground text-xs font-bold">
                      {t("activity.noTransactions")}
                    </span>
                  </div>
                );
              }

              return (
                <div className="overflow-y-auto overflow-x-hidden">
                  {[...pendingTransactions, ...transactions].map((t) => (
                    <TransactionRow key={t.id} tx={t} />
                  ))}
                </div>
              );
            }
          )
          .otherwise(() => null)}
      </motion.div>
    </main>
  );
};
