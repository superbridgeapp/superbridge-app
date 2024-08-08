import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

import { OpenActivity } from "@/components/activity/open-activity";
import { useIsSuperbridge } from "@/hooks/apps/use-is-superbridge";
import { useInitialise } from "@/hooks/use-initialise";
import {
  useBackgroundIcon,
  useBackgroundImageBlendMode,
  useBackgroundImageOpacity,
  useBackgroundImagePosition,
  useBackgroundImageRepeat,
  useBackgroundImageSize,
} from "@/hooks/use-theme";
import { useConfigState } from "@/state/config";

import { Header } from "./header";
import { Modals } from "./modals";
import { NetworkSelector } from "./modals/network-selector-modal";

export function Layout({ children }: { children: any }) {
  useInitialise();

  const displayTransactions = useConfigState.useDisplayTransactions();
  const displayNetworkSelector = useConfigState.useDisplayNetworkSelector();

  const imageBackground = useBackgroundIcon();
  const backgroundImageBlendMode = useBackgroundImageBlendMode();
  const backgroundImagePosition = useBackgroundImagePosition();
  const backgroundImageSize = useBackgroundImageSize();
  const backgroundImageRepeat = useBackgroundImageRepeat();
  const backgroundImageOpacity = useBackgroundImageOpacity();

  const isSuperbridge = useIsSuperbridge();

  return (
    <div className="bg-background w-screen h-screen overflow-hidden z-40 relative transition-colors duration-1000  flex justify-center">
      {isSuperbridge && (
        <motion.div
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

      <Header />

      {/* bridge */}
      {children}

      {/* Transactions container */}
      <AnimatePresence mode="wait" initial={false}>
        {displayTransactions && (
          <>
            <OpenActivity key="transactionItemsContainer" />
            {/* fade background */}
            <motion.div
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              // transition={{ ease: "easeOut", duration: 1 }}
              className="h-screen w-screen z-10 backdrop-blur-lg  bg-background mix-blend-hue"
            ></motion.div>
          </>
        )}

        {displayNetworkSelector && (
          <>
            <NetworkSelector key="networkSelector" />
            {/* fade background */}
            <motion.div
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              // transition={{ duration: 0.2 }}
              className="h-screen w-screen z-10 backdrop-blur-lg  bg-background  mix-blend-hue"
            ></motion.div>
          </>
        )}
      </AnimatePresence>

      <Modals />
    </div>
  );
}
