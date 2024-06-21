import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { ClosedActivity } from "@/components/activity/closed-activity";
import { OpenActivity } from "@/components/activity/open-activity";
import { Footer } from "@/components/footer";
import { isSuperbridge } from "@/config/superbridge";
import { useIsTrial } from "@/hooks/trials/use-is-trial";
import { useDeployments } from "@/hooks/use-deployments";
import { useInitialise } from "@/hooks/use-initialise";
import { useNavigate } from "@/hooks/use-navigate";
import {
  useBackgroundIcon,
  useBackgroundImageBlendMode,
  useBackgroundImageOpacity,
  useBackgroundImagePosition,
  useBackgroundImageRepeat,
  useBackgroundImageSize,
  useNavIcon,
} from "@/hooks/use-theme";
import { useConfigState } from "@/state/config";

import { BlockProvingModal } from "./fault-proofs/block-proving-modal";
import { LegalModal } from "./legal-modal";
import { CustomTokenListModal } from "./settings/custom-token-list-modal";
import { SettingsModal } from "./settings/settings-modal";
import { TosModal } from "./tos-modal/tos-modal";
import { TrialBanner } from "./trials/trial-banner";

export function Layout({ children }: { children: any }) {
  useInitialise();

  const deployments = useDeployments();
  const navigate = useNavigate();
  const displayTransactions = useConfigState.useDisplayTransactions();
  const setSettingsModal = useConfigState.useSetSettingsModal();
  const settingsModal = useConfigState.useSettingsModal();
  const setFast = useConfigState.useSetFast();
  const fast = useConfigState.useFast();
  const pathname = usePathname();

  const navIcon = useNavIcon();
  const imageBackground = useBackgroundIcon();
  const backgroundImageBlendMode = useBackgroundImageBlendMode();
  const backgroundImagePosition = useBackgroundImagePosition();
  const backgroundImageSize = useBackgroundImageSize();
  const backgroundImageRepeat = useBackgroundImageRepeat();
  const backgroundImageOpacity = useBackgroundImageOpacity();

  const isTrial = useIsTrial();

  return (
    <div className="bg-background w-screen h-screen overflow-hidden z-40 relative transition-colors duration-1000  flex justify-center">
      <TrialBanner />
      {isSuperbridge && (
        <motion.div
          animate={{ opacity: pathname === "/" ? 1 : 0 }}
          initial={{ opacity: 0 }}
          className="bg-gradient-to-t from-violet-500 to-violet-500/0 dark:from-violet-500/0 dark:to-violet-500/50 inset-0 z-0 fixed mix-blend-plus-lighter"
        />
      )}
      <div
        className={clsx(`inset-0 z-0 fixed transition-all bg-cover`)}
        style={{
          backgroundImage: imageBackground
            ? `url(${imageBackground})`
            : undefined,
          opacity:
            !!backgroundImageOpacity &&
            typeof backgroundImageOpacity === "string"
              ? parseInt(backgroundImageOpacity) / 100
              : undefined,
          mixBlendMode: backgroundImageBlendMode as any,
          backgroundSize: backgroundImageSize,
          backgroundRepeat: backgroundImageRepeat,
          backgroundPosition: backgroundImagePosition,
        }}
      />

      <TosModal />
      <LegalModal />
      <CustomTokenListModal />
      <BlockProvingModal />

      <nav
        className={clsx(
          "flex flex-row justify-between items-center p-3 md:p-6 fixed top-0 left-0 w-screen z-10",
          isTrial && "top-10"
        )}
      >
        <div onClick={() => navigate("/")} className="cursor-pointer">
          {deployments.deployments.length === 1 ? (
            <img
              src={navIcon!}
              width="0"
              height="0"
              sizes="100vw"
              alt={deployments.deployments[0]?.name}
              draggable={false}
              className="inline-flex w-auto max-w-40 h-8"
            />
          ) : (
            <div className="bg-card rounded-full shadow-sm">
              <Image
                src={"/img/logo.svg"}
                width={0}
                height={0}
                sizes="100vw"
                alt={"Superbridge"}
                draggable={false}
                className="rounded-full hidden md:inline-flex dark:md:hidden h-10 w-auto"
              />
              <Image
                src={"/img/logo-dark.svg"}
                width={0}
                height={0}
                sizes="100vw"
                alt={"Superbridge"}
                draggable={false}
                className="rounded-full  hidden md:hidden dark:md:inline-flex h-10 w-auto"
              />
              <Image
                src={"/img/logo-small.svg"}
                width={0}
                height={0}
                sizes="100vw"
                alt={"Superbridge"}
                draggable={false}
                className="rounded-full  md:hidden dark:hidden h-10 w-auto"
              />
              <Image
                src={"/img/logo-small-dark.svg"}
                width={0}
                height={0}
                sizes="100vw"
                alt={"Superbridge"}
                draggable={false}
                className="rounded-full  hidden dark:inline-flex dark:md:hidden h-10 w-auto"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {isSuperbridge && (
            <div className="flex gap-1">
              <button
                onClick={() => navigate("/")}
                className={`flex items-center justify-center h-10 w-14 bg-card rounded-full shadow-sm transition-all hover:scale-105`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="16"
                  className={
                    pathname === "/" && !fast && !displayTransactions
                      ? "fill-foreground transition-all"
                      : "fill-muted-foreground transition-all"
                  }
                  viewBox="0 0 27 16"
                >
                  <g clipPath="url(#clip0_364_6103)">
                    <path d="M0 3.389C0 1.402 1.413 0 3.46 0h5.352c2.058 0 3.46 1.402 3.46 3.389 0 1.987-1.402 3.405-3.46 3.405H3.46C1.413 6.794 0 5.396 0 3.389zm1.32.191c.234 0 .382-.164.425-.425.098-.781.578-1.304 1.375-1.414.234-.043.41-.218.398-.425 0-.219-.192-.398-.453-.398-.055 0-.152 0-.219.015-1.003.18-1.741.976-1.909 2.003-.016.082-.016.152-.016.219 0 .289.235.425.399.425zM14.15 3.389C14.15 1.398 15.562 0 17.608 0h5.352c2.058 0 3.46 1.402 3.46 3.389 0 1.987-1.402 3.405-3.46 3.405H17.61c-2.046 0-3.46-1.402-3.46-3.405zm1.32.191c.233 0 .382-.164.425-.425.097-.781.578-1.304 1.374-1.414.234-.043.41-.218.398-.425 0-.219-.191-.398-.453-.398-.054 0-.152 0-.218.015-1.004.18-1.742.976-1.91 2.003-.015.082-.015.152-.015.219 0 .289.234.425.398.425zM0 12.595c0-1.99 1.413-3.388 3.46-3.388h5.352c2.058 0 3.46 1.401 3.46 3.388 0 1.988-1.402 3.405-3.46 3.405H3.46C1.413 16 0 14.598 0 12.595zm1.32.192c.234 0 .382-.164.425-.426.098-.78.578-1.304 1.375-1.413.234-.043.41-.219.398-.426 0-.218-.192-.398-.453-.398-.055 0-.152 0-.219.016-1.003.18-1.741.976-1.909 2.003-.016.082-.016.152-.016.218 0 .29.235.426.399.426zM14.15 12.595c0-1.99 1.413-3.388 3.459-3.388h5.352c2.058 0 3.46 1.401 3.46 3.388 0 1.988-1.402 3.405-3.46 3.405H17.61c-2.046 0-3.46-1.402-3.46-3.405zm1.32.192c.233 0 .382-.164.425-.426.097-.78.578-1.304 1.374-1.413.234-.043.41-.219.398-.426 0-.218-.191-.398-.453-.398-.054 0-.152 0-.218.016-1.004.18-1.742.976-1.91 2.003-.015.082-.015.152-.015.218 0 .29.234.426.398.426z"></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_364_6103">
                      <path fill="#fff" d="M0 0H26.421V16H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              </button>

              <button
                onClick={() => navigate("fast")}
                className={`relative flex items-center justify-center h-10 w-14 bg-card rounded-full shadow-sm transition-all hover:scale-105`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="16"
                  viewBox="0 0 14 16"
                  fill="none"
                  className={
                    fast && !displayTransactions
                      ? "fill-foreground transition-all"
                      : "fill-muted-foreground transition-all"
                  }
                >
                  <path d="M4.2596 16C3.99642 16 3.79021 15.7857 3.79021 15.5225C3.79021 15.4411 3.81463 15.357 3.85533 15.2837L7.22247 9.50992H1.05798C0.794791 9.50992 0.580444 9.29557 0.580444 9.03239C0.580444 8.90215 0.637422 8.77734 0.737812 8.67967L9.81361 0.113956C9.90315 0.0325589 10.0198 0 10.1419 0C10.4377 0 10.6194 0.206207 10.6194 0.485671C10.6194 0.575208 10.6032 0.675598 10.5462 0.756995L6.47904 6.49008H12.9338C13.197 6.49008 13.4195 6.68815 13.4195 6.96761C13.4195 7.08971 13.3707 7.22266 13.273 7.31219L4.61504 15.8698C4.5255 15.9593 4.39255 16 4.26232 16H4.2596Z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="176"
                  height="176"
                  viewBox="0 0 176 176"
                  fill="none"
                  className="absolute -top-1.5 -right-2.5 w-7 h-7 animate-spin-slow"
                >
                  <path
                    d="M88 0L102.05 17.38L121.68 6.7L128 28.13L150.23 25.77L147.87 48L169.3 54.32L158.62 73.95L176 88L158.62 102.05L169.3 121.68L147.87 128L150.23 150.23L128 147.87L121.68 169.3L102.05 158.62L88 176L73.95 158.62L54.32 169.3L48 147.87L25.77 150.23L28.13 128L6.7 121.68L17.38 102.05L0 88L17.38 73.95L6.7 54.32L28.13 48L25.77 25.77L48 28.13L54.32 6.7L73.95 17.38L88 0Z"
                    fill="#C4FF96"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="176"
                  height="176"
                  viewBox="0 0 176 176"
                  fill="none"
                  className="absolute -top-1.5 -right-2.5 w-7 h-7 fill-black"
                >
                  <path d="M104.021 114.643C99.8479 113.525 97.7774 109.072 99.6595 102.837L107.235 77.6084C107.475 76.8265 107.705 76.1931 107.883 75.7571C108.939 73.1691 111.951 71.7399 114.799 72.503C117.167 73.1376 118.458 75.0853 117.662 77.3802L108.703 103.598L120.487 81.1593C122.412 77.4743 126.302 75.5855 129.658 76.4845C133.013 77.3836 134.761 80.7834 133.627 84.6799L126.728 108.398L138.64 83.0012C139.69 80.7742 142.148 79.8314 144.517 80.466C147.139 81.1686 148.516 83.4718 147.874 85.8684C147.738 86.3759 147.259 87.4866 146.879 88.2308L134.566 112.19C131.528 118.115 126.662 120.71 122.461 119.584C118.175 118.436 116.107 113.862 118.32 107.293L123.821 90.9372L116.29 106.749C113.287 113.107 108.307 115.791 104.021 114.643Z" />
                  <path d="M66.6115 104.316C63.2844 103.424 61.9866 100.598 63.3237 97.3001L74.7164 69.1052C76.0535 65.8068 79.1261 64.152 82.4814 65.0511L102.641 70.4529C105.63 71.2538 107.069 73.6642 106.314 76.4837C105.354 80.0646 101.894 82.0386 98.3415 81.0866L83.7079 77.1656L82.1049 81.118L95.6952 84.7595C98.4584 85.4999 99.8358 87.803 99.1332 90.4252C98.2644 93.6678 94.9904 95.5103 91.7197 94.6339L78.1293 90.9924L76.4377 95.1628L91.1277 99.099C94.1164 99.8998 95.584 102.318 94.8284 105.137C93.8765 108.69 90.4087 110.692 86.8278 109.733L66.6115 104.316Z" />
                  <path d="M30.8238 96.3042C27.5249 95.4203 26.2553 92.602 27.5924 89.3037L39.3397 60.2367C40.8465 56.5305 43.8007 54.7534 47.2688 55.6827C49.4963 56.2795 50.7942 57.413 51.5169 61.5957L54.8767 80.7489L61.0172 65.5012C62.3543 62.2029 65.4269 60.5481 68.7258 61.432C71.9965 62.3084 73.2943 65.1342 71.9572 68.4326L60.2174 97.4714C58.7106 101.178 55.7206 102.975 52.4781 102.106C49.9123 101.419 48.9986 99.7538 48.3705 96.6844L44.4936 77.5437L38.5323 92.235C37.1952 95.5334 34.1227 97.1882 30.8238 96.3042Z" />
                </svg>
              </button>
            </div>
          )}
          <ConnectButton
            chainStatus="icon"
            label="Connect"
            showBalance={{ smallScreen: false, largeScreen: true }}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </nav>
      {/* controls */}
      {/* {isSuperbridge && !displayTransactions && (
        <>
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            animate={{ y: pathname === "/" && !fast ? -80 : 0, x: "-50%" }}
            initial={{ y: -60, x: "-50%" }}
            className={`flex items-center py-0 md:py-3 px-3 md:px-4 h-10 md:h-auto absolute bg-card top-3 md:top-6  md:left-1/2 z-10 rounded-full shadow-sm left-[102px]`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="16"
              className="fill-foreground"
              viewBox="0 0 27 16"
            >
              <g clipPath="url(#clip0_364_6103)">
                <path d="M0 3.389C0 1.402 1.413 0 3.46 0h5.352c2.058 0 3.46 1.402 3.46 3.389 0 1.987-1.402 3.405-3.46 3.405H3.46C1.413 6.794 0 5.396 0 3.389zm1.32.191c.234 0 .382-.164.425-.425.098-.781.578-1.304 1.375-1.414.234-.043.41-.218.398-.425 0-.219-.192-.398-.453-.398-.055 0-.152 0-.219.015-1.003.18-1.741.976-1.909 2.003-.016.082-.016.152-.016.219 0 .289.235.425.399.425zM14.15 3.389C14.15 1.398 15.562 0 17.608 0h5.352c2.058 0 3.46 1.402 3.46 3.389 0 1.987-1.402 3.405-3.46 3.405H17.61c-2.046 0-3.46-1.402-3.46-3.405zm1.32.191c.233 0 .382-.164.425-.425.097-.781.578-1.304 1.374-1.414.234-.043.41-.218.398-.425 0-.219-.191-.398-.453-.398-.054 0-.152 0-.218.015-1.004.18-1.742.976-1.91 2.003-.015.082-.015.152-.015.219 0 .289.234.425.398.425zM0 12.595c0-1.99 1.413-3.388 3.46-3.388h5.352c2.058 0 3.46 1.401 3.46 3.388 0 1.988-1.402 3.405-3.46 3.405H3.46C1.413 16 0 14.598 0 12.595zm1.32.192c.234 0 .382-.164.425-.426.098-.78.578-1.304 1.375-1.413.234-.043.41-.219.398-.426 0-.218-.192-.398-.453-.398-.055 0-.152 0-.219.016-1.003.18-1.741.976-1.909 2.003-.016.082-.016.152-.016.218 0 .29.235.426.399.426zM14.15 12.595c0-1.99 1.413-3.388 3.459-3.388h5.352c2.058 0 3.46 1.401 3.46 3.388 0 1.988-1.402 3.405-3.46 3.405H17.61c-2.046 0-3.46-1.402-3.46-3.405zm1.32.192c.233 0 .382-.164.425-.426.097-.78.578-1.304 1.374-1.413.234-.043.41-.219.398-.426 0-.218-.191-.398-.453-.398-.054 0-.152 0-.218.016-1.004.18-1.742.976-1.91 2.003-.015.082-.015.152-.015.218 0 .29.234.426.398.426z"></path>
              </g>
              <defs>
                <clipPath id="clip0_364_6103">
                  <path fill="#fff" d="M0 0H26.421V16H0z"></path>
                </clipPath>
              </defs>
            </svg>
          </motion.button>

          <motion.button
            onClick={() => navigate("fast")}
            whileHover={{ scale: 1.05 }}
            animate={{ y: 0, x: "20%" }}
            initial={{ y: -60, x: "20%" }}
            className={`flex items-center py-0 md:py-3 px-3 md:px-4 h-10 md:h-auto absolute bg-card top-3 md:top-6  md:left-1/2 z-10 rounded-full shadow-sm left-[90px]`}
          >
            Fast
          </motion.button>
        </>
      )} */}

      <AnimatePresence mode="sync" initial={false}>
        {displayTransactions ? null : children}
      </AnimatePresence>
      {/* Transactions container */}
      <AnimatePresence mode="sync" initial={false}>
        {displayTransactions ? (
          <OpenActivity key="transactionItemsContainer" />
        ) : (
          <ClosedActivity key="closeActivityBtn" />
        )}
      </AnimatePresence>
      <SettingsModal open={settingsModal} setOpen={setSettingsModal} />
      <Footer />
    </div>
  );
}
