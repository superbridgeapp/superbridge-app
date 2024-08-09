import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { P, match } from "ts-pattern";
import { useAccount } from "wagmi";

import { useInProgressTxCount } from "@/hooks/use-in-progress-tx-count";
import { useStatusCheck } from "@/hooks/use-status-check";
import { useTransactions } from "@/hooks/use-transactions";
import { useTrackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { usePendingTransactions } from "@/state/pending-txs";

import { Loading } from "../Loading";
import { IconClose, IconSpinner } from "../icons";
import { TransactionRowV2 } from "../transaction-row-v2";

// Animations
const container = {
  hidden: {
    y: "5vh",
    opacity: 0,
    transition: {
      type: "easeIn",
      duration: 0.15,
    },
  },
  show: {
    opacity: 1,
    y: "0vh",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 16,
      staggerChildren: 0.05,
      delayChildren: 0.1,
      // staggerDirection: -1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 12,
    },
  },
};

export const OpenActivity = ({}) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const account = useAccount();
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const open = useConfigState.useDisplayTransactions();
  const pendingTransactions = usePendingTransactions.useTransactions();
  const {
    transactions,
    isLoading,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    total: totalTransactions,
  } = useTransactions();
  const { t } = useTranslation();
  const statusCheck = useStatusCheck();
  const inProgressCount = useInProgressTxCount();
  const trackEvent = useTrackEvent();

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage]);

  return (
    <main
      className="flex items-start justify-center scroll-smooth overflow-y-scroll w-screen h-screen fixed inset-0 px-2 md:px-0 py-16 md:py-20 z-[25]"
      key="bridgeMain"
      onClick={() => {
        setDisplayTransactions(false);
        trackEvent({ event: "close-activity" });
      }}
    >
      <motion.button
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.1 }}
        whileHover={{ scale: 1.1 }}
        key="close-activity-button"
        className={`flex items-center cursor-pointer w-10 h-10 shrink-0 flex items-center justify-center rounded-full shadow-sm bg-card fixed top-6 right-6 z-10`}
      >
        <IconClose className="fill-foreground w-3.5 h-3.5" />
      </motion.button>
      <motion.div
        variants={container}
        initial={"hidden"}
        animate={"show"}
        exit={"hidden"}
        className="flex flex-col items-center gap-10 w-full"
      >
        <div className="flex items-center gap-3 bg-card pl-6 pr-5 py-3 rounded-full shadow-sm">
          <h1 className="text-2xl font-heading leading-none">
            {t("activity.activity")}
          </h1>
          <span className="bg-muted rounded-full text-xs text-muted-foreground px-3 py-1 h-6">
            {account.address
              ? `${account.address.slice(0, 4)}...${account.address.slice(
                  account.address.length - 4
                )}`
              : " "}
          </span>
        </div>

        {/* <div
              className={`bg-muted flex items-center justify-center w-6 h-6 text-center rounded-full ${
                inProgressCount <= 0 ? "hidden" : "visible"
              }`}
            >
              <span className="text-xs  text-foreground">
                {inProgressCount}
              </span>
            </div> */}

        {match({
          statusCheck,
          isError,
          isLoading,
          transactions,
          account,
          pendingTransactions,
        })
          .with({ account: { address: undefined } }, () => (
            <div className="flex px-6 py-3 shadow-sm rounded-full justify-center items-center h-full bg-card">
              <span className="text-muted-foreground text-sm">
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
            <div className="flex px-6 py-3 shadow-sm rounded-full justify-center items-center h-full bg-card">
              <span className="text-muted-foreground text-sm">
                {t("activity.error")}…
              </span>
            </div>
          ))
          .with({ statusCheck: true }, () => (
            <div className="flex px-6 py-3 shadow-sm rounded-full justify-center items-center h-full bg-card">
              <span className="text-muted-foreground text-sm">
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
                  <div className="flex px-6 py-3 shadow-sm rounded-full justify-center items-center h-full bg-card">
                    <span className="text-muted-foreground text-sm">
                      {t("activity.noTransactions")}
                    </span>
                  </div>
                );
              }

              return (
                <div className="flex flex-col gap-3 lg:gap-4 w-full px-2 max-w-2xl">
                  {[...pendingTransactions, ...transactions].map((t) => {
                    return (
                      <motion.div
                        key={`activity-${t.id}`}
                        variants={item}
                        // hovers must not be a variant or stagger animation fails
                        // whileHover={{ scale: 1.03 }}
                        // whileTap={{ scale: 1 }}
                        className={
                          "relative w-full h-full flex flex-col shrink-0 overflow-hidden rounded-2xl shadow-sm"
                        }
                      >
                        <TransactionRowV2 key={t.id} tx={t} />
                      </motion.div>
                    );
                  })}

                  {transactions.length !== totalTransactions && (
                    <div
                      ref={ref}
                      className="flex justify-center items-center p-3"
                    >
                      <div className="bg-card px-5 py-3 flex gap-1 items-center rounded-full hover:scale-105 transition-all">
                        {isFetchingNextPage ? (
                          <>
                            <IconSpinner className="w-3 h-3 block text-foreground" />
                            <span className="text-sm text-foreground leading-none font-heading">
                              Loading
                            </span>
                          </>
                        ) : (
                          // just handling the case where the IntersectionObserver doesn't work
                          <button
                            onClick={() => fetchNextPage()}
                            className="text-sm text-foreground leading-none font-heading"
                          >
                            Load more
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
          )
          .otherwise(() => null)}
      </motion.div>
    </main>
  );
};
