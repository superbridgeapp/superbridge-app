import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { ClosedActivity } from "@/components/activity/closed-activity";
import { OpenActivity } from "@/components/activity/open-activity";
import { Footer } from "@/components/footer";
import { isSuperbridge } from "@/config/superbridge";
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

import { CustomTokenListModal } from "./settings/custom-token-list-modal";
import { SettingsModal } from "./settings/settings-modal";
import { TosModal } from "./tos-modal/tos-modal";
import { LegalModal } from "./legal-modal";

export function Layout({ children }: { children: any }) {
  useInitialise();

  const deployments = useDeployments();
  const navigate = useNavigate();
  const displayTransactions = useConfigState.useDisplayTransactions();
  const setSettingsModal = useConfigState.useSetSettingsModal();
  const settingsModal = useConfigState.useSettingsModal();
  const pathname = usePathname();

  const navIcon = useNavIcon();
  const imageBackground = useBackgroundIcon();
  const backgroundImageBlendMode = useBackgroundImageBlendMode();
  const backgroundImagePosition = useBackgroundImagePosition();
  const backgroundImageSize = useBackgroundImageSize();
  const backgroundImageRepeat = useBackgroundImageRepeat();
  const backgroundImageOpacity = useBackgroundImageOpacity();

  return (
    <div className="bg-background w-screen h-screen overflow-hidden z-40 relative transition-colors duration-1000 tracking-tight flex justify-center">
      {isSuperbridge && (
        <motion.div
          animate={{ opacity: pathname === "/" ? 1 : 0 }}
          initial={{ opacity: 0 }}
          className="bg-gradient-to-t from-violet-500 to-violet-500/0 dark:from-violet-500/50 dark:to-violet-500/0 inset-0 z-0 fixed mix-blend-plus-lighter"
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

      <nav className="flex flex-row justify-between items-center p-3 md:p-6 fixed top-0 left-0 w-screen z-10">
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

        <ConnectButton
          chainStatus="icon"
          label="Connect"
          showBalance={{ smallScreen: false, largeScreen: true }}
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
        />
      </nav>
      {/* controls */}
      {deployments.deployments.length > 1 && !displayTransactions && (
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          animate={{ y: pathname === "/" ? -80 : 0, x: "-50%" }}
          initial={{ y: -60, x: "-50%" }}
          className={`flex items-center py-0 md:py-3 px-3 md:px-4 h-10 md:h-auto absolute bg-card top-3 md:top-6  md:left-1/2 z-10 rounded-full shadow-sm  
          ${isSuperbridge ? "left-[102px]" : "left-[84px]"}
          `}
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
      )}
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
