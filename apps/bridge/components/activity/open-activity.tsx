import { deploymentTheme } from "@/config/theme";
import { useTransactions } from "@/hooks/use-transactions";
import { useConfigState } from "@/state/config";
import { usePendingTransactions } from "@/state/pending-txs";
import {
  isArbitrumDeposit,
  isArbitrumForcedWithdrawal,
  isArbitrumWithdrawal,
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
  isWithdrawal,
} from "@/utils/guards";
import { MOCK_TRANSACTIONS } from "@/utils/mock-transactions";
import { motion } from "framer-motion";
import { P, match } from "ts-pattern";
import { useAccount } from "wagmi";
import { useTranslation } from "react-i18next";

import { TransactionRow } from "../transaction-row";
import { Loading } from "../Loading";

export const OpenActivity = ({}) => {
  const account = useAccount();
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const open = useConfigState.useDisplayTransactions();
  const deployment = useConfigState.useDeployment();
  const pendingTransactions = usePendingTransactions.useTransactions();
  const { transactions, isLoading, isError } = useTransactions();
  const { t } = useTranslation();

  const inProgressCount =
    transactions.filter((x) => {
      if (isDeposit(x)) return !x.relay;
      if (isWithdrawal(x)) return !x.finalise;
      if (isForcedWithdrawal(x)) !x.withdrawal?.finalise;
      if (isArbitrumDeposit(x)) return !x.relay;
      if (isArbitrumWithdrawal(x)) return !x.finalise;
      if (isArbitrumForcedWithdrawal(x)) return !x.withdrawal?.finalise;
      if (isCctpBridge(x)) return !x.relay;
    }).length + pendingTransactions.length;

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
        className={`${
          deploymentTheme(deployment).bg
        } flex flex-col self-start  z-50 relative overflow-hidden rounded-[32px] h-[calc(76dvh)] max-h-[680px]  w-screen md:w-[50vw] md:max-w-[420px] aspect-[3/4] backdrop-blur shadow-sm border border-black/[0.0125] dark:border-white/[0.0125]`}
      >
        <div
          className="flex items-center justify-between pl-6 pr-4 py-4 md:py-6 border-b border-zinc-100 dark:border-zinc-800 cursor-pointer z-10"
          onClick={() => setDisplayTransactions(!open)}
        >
          <h2 className="text-zinc-900 dark:text-zinc-50 font-bold text-sm md:text-base">
            {t("activity.activity")}
          </h2>
          <div className="flex gap-2 items-center">
            <div
              className={`bg-zinc-100 flex items-center justify-center w-6 h-6 text-center rounded-full ${
                inProgressCount <= 0 ? "hidden" : "visible"
              }`}
            >
              <span className="text-zinc-800 text-xs font-medium">
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
          isError,
          isLoading,
          transactions,
          account,
          pendingTransactions,
        })
          .with({ account: { address: undefined } }, () => (
            <div className="flex grow justify-center items-center h-full">
              <span className="text-zinc-400 text-xs font-bold">
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
                    <span className="text-zinc-400 text-xs font-bold">
                      {t("activity.noTransactions")}
                    </span>
                  </div>
                );
              }

              return (
                <div className="overflow-y-auto overflow-x-hidden">
                  {[
                    ...pendingTransactions,
                    ...transactions,
                    // ...(process.env["NODE_ENV"] === "development"
                    //   ? MOCK_TRANSACTIONS
                    //   : []),
                  ].map((t) => (
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
