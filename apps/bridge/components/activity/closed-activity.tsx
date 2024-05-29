import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Lottie from "react-lottie-player";

import { useHasPendingAction } from "@/hooks/use-has-pending-action";
import { useConfigState } from "@/state/config";
import { useInProgressTxCount } from "@/hooks/use-in-progress-tx-count";

import inProgressDark from "../../animation/loading-dark.json";
import inProgress from "../../animation/loading.json";

const activityAnimations = {
  hidden: { y: 80 },
  show: { y: 0 },
  hover: { scale: 1.05 },
  actionNeeded: {
    y: [0, 4, -20, 10, 0],
    transition: {
      repeat: Infinity,
      repeatDelay: 4,
    },
  },
};

export const ClosedActivity = () => {
  const open = useConfigState.useDisplayTransactions();
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const { t } = useTranslation();
  const hasPendingAction = useHasPendingAction();
  const inProgressCount = useInProgressTxCount();

  return (
    <div className="h-16 fixed bottom-0 w-[50%] z-[55] flex justify-center items-center">
      <motion.div
        variants={activityAnimations}
        animate={hasPendingAction ? "actionNeeded" : "show"}
        initial={"hidden"}
        exit={"hidden"}
        whileHover={"hover"}
        key={"activityBtn"}
        className="bg-card backdrop-blur rounded-full shadow-sm flex h-10 z-[50] flex-col absolute self-end mb-3 md:mb-4"
      >
        <motion.div
          className="flex items-center justify-between gap-3 pl-5 pr-2 h-10 cursor-pointer z-10"
          onClick={() => setDisplayTransactions(!open)}
          animate={{ width: "auto" }}
        >
          <AnimatePresence mode="sync">
            {/* Action required Star animation */}
            {hasPendingAction ? (
              <motion.div
                className="absolute top-1 -left-3.5"
                animate={{
                  rotate: [0, 360, 360, 360],
                  scale: [0.75, 1, 1.125, 1],
                }}
                initial={{ scale: 0.1 }}
                // This messes everything up and makes the bar really fat after logging out
                // No idea why
                // exit={{ scale: 0.1 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                key={"spinnyStar"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="63"
                  height="60"
                  fill="none"
                  viewBox="0 0 63 60"
                  className="w-7 h-7"
                >
                  <g clipPath="url(#clip0_613_322)">
                    <path
                      fill="#FF5"
                      d="M7.14 24.98l13.9 9.93c.51.36.79.91.79 1.48 0 .18-.03.36-.24 1L16.47 53.1l13.44-9.9c.58-.42.94-.51 1.3-.51.36 0 .73.09 1.27.51l13.47 9.9-5.15-15.8c-.18-.54-.21-.73-.21-.91 0-.58.27-1.12.79-1.48l13.9-9.93H38.11c-.79 0-1.45-.51-1.7-1.27L31.2 7.73l-5.21 15.98c-.24.76-.94 1.27-1.73 1.27H7.14zM49.4 59.64c-.36 0-.73-.12-1.63-.79L31.21 46.74 14.08 59.3c-.3.24-.7.33-1.09.33-1.03 0-1.79-.82-1.79-1.82 0-.18.03-.39.09-.61l6.54-20.16-16.8-12.22C.27 24.28 0 23.7 0 23.12c0-.94.85-1.76 1.85-1.76h21.1l6.51-20.09C29.7.48 30.43 0 31.22 0s1.48.51 1.73 1.27l6.54 20.1h21.07c1 0 1.88.82 1.88 1.76 0 .58-.3 1.12-.79 1.48L44.61 37.05l6.54 20.16c.06.21.09.42.09.61 0 .94-.7 1.82-1.82 1.82h-.02z"
                    ></path>
                    <path
                      fill="#FFD200"
                      d="M24.28 24.98H7.14l13.9 9.93c.51.36.79.91.79 1.48 0 .18-.03.36-.24 1L16.47 53.1l13.44-9.9c.58-.42.94-.51 1.3-.51.36 0 .73.09 1.27.51l13.47 9.9-5.15-15.8c-.18-.54-.21-.73-.21-.91 0-.58.27-1.12.79-1.48l13.9-9.93H38.11c-.79 0-1.45-.51-1.7-1.27L31.2 7.73l-5.21 15.98c-.24.76-.94 1.27-1.73 1.27h.02z"
                    ></path>
                    <path
                      fill="#000"
                      d="M33.3 30.21c0-1.24 1.03-2.27 2.27-2.27s2.24 1.03 2.24 2.27-1 2.27-2.24 2.27c-1.24 0-2.27-1.03-2.27-2.27zm-5.72 5.39c0-.64.54-1.18 1.18-1.18.64 0 1.18.54 1.18 1.18 0 .33.58.82 1.42.82s1.42-.48 1.42-.82c0-.64.54-1.18 1.18-1.18.64 0 1.21.54 1.21 1.18 0 1.79-1.73 3.18-3.81 3.18-1.97 0-3.78-1.3-3.78-3.18zm-3.27-5.39c0-1.24 1.03-2.27 2.27-2.27s2.24 1.03 2.24 2.27-1 2.27-2.24 2.27c-1.24 0-2.27-1.03-2.27-2.27zM7.14 24.97l13.9 9.93c.51.36.79.91.79 1.48 0 .18-.03.36-.24 1l-5.12 15.71 13.44-9.9c.58-.42.94-.51 1.3-.51.36 0 .73.09 1.27.51l13.47 9.9-5.15-15.8c-.18-.54-.21-.73-.21-.91 0-.58.27-1.12.79-1.48l13.9-9.93H38.11c-.79 0-1.45-.51-1.7-1.27L31.2 7.72 25.99 23.7c-.24.76-.94 1.27-1.73 1.27H7.14zM49.4 59.63c-.36 0-.73-.12-1.63-.79L31.21 46.73 14.08 59.29c-.3.24-.7.33-1.09.33-1.03 0-1.79-.82-1.79-1.82 0-.18.03-.39.09-.61l6.54-20.16-16.8-12.21C.27 24.28 0 23.7 0 23.12c0-.94.85-1.76 1.85-1.76h21.1l6.51-20.09C29.7.48 30.43 0 31.22 0s1.48.51 1.73 1.27l6.54 20.1h21.07c1 0 1.88.82 1.88 1.76 0 .58-.3 1.12-.79 1.48L44.61 37.05l6.54 20.16c.06.21.09.42.09.61 0 .94-.7 1.82-1.82 1.82l-.02-.01z"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_613_322">
                      <path fill="#fff" d="M0 0H62.42V59.64H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              </motion.div>
            ) : null}

            {hasPendingAction ? (
              <motion.h2
                key="titleActionNeeded"
                className="font-bold text-sm md:text-base whitespace-nowrap"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                Action needed
              </motion.h2>
            ) : (
              <motion.h2
                key="titleActivity"
                className="font-bold text-sm md:text-base"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                {t("activity.activity")}
              </motion.h2>
            )}

            {/* Current items counter  */}
            {inProgressCount > 0 ? (
              <motion.div
                className="flex gap-1 items-center"
                animate={{
                  scale: 1,
                }}
                initial={{ scale: 0.1 }}
                exit={{ scale: 0.1 }}
                key={"currentItemsCounter"}
              >
                <div
                  className={`flex items-center gap-1 justify-center px-2 py-1 text-center rounded-full bg-primary 
            `}
                >
                  <span className="text-primary-foreground text-xs font-medium">
                    {inProgressCount}
                  </span>
                  <Lottie
                    animationData={inProgress}
                    loop={true}
                    className="w-3.5 h-3.5 scale-150 block dark:hidden"
                    play
                  />
                  <Lottie
                    animationData={inProgressDark}
                    loop={true}
                    className="w-3.5 h-3.5 scale-150 hidden dark:block"
                    play
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                animate={{
                  scale: 1,
                }}
                initial={{ scale: 0.1 }}
                exit={{ scale: 0.1 }}
                key={"activityCaret"}
                className={`flex items-center  cursor-pointer w-4 h-4  flex items-center justify-center rounded-full`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 256 256"
                  className="fill-zinc-400 -translate-x-1"
                >
                  <path d="M216.49 168.49a12 12 0 01-17 0L128 97l-71.51 71.49a12 12 0 01-17-17l80-80a12 12 0 0117 0l80 80a12 12 0 010 17z"></path>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};
