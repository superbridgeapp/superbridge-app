import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
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
import { useInjectedStore } from "@/state/injected";

import { BlockProvingModal } from "./fault-proofs/block-proving-modal";
import { Header } from "./header";
import { LegalModal } from "./legal-modal";
import { CustomTokenListModal } from "./settings/custom-token-list-modal";
import { SettingsModal } from "./settings/settings-modal";
import { TosModal } from "./tos-modal/tos-modal";

export function Layout({ children }: { children: any }) {
  useInitialise();

  const deployments = useDeployments();
  const navigate = useNavigate();
  const displayTransactions = useConfigState.useDisplayTransactions();
  const setSettingsModal = useConfigState.useSetSettingsModal();
  const settingsModal = useConfigState.useSettingsModal();
  const fast = useConfigState.useFast();
  const superbridgeTestnetsEnabled = useInjectedStore((s) => s.testnets);
  const pathname = usePathname();

  const navIcon = useNavIcon();
  const imageBackground = useBackgroundIcon();
  const backgroundImageBlendMode = useBackgroundImageBlendMode();
  const backgroundImagePosition = useBackgroundImagePosition();
  const backgroundImageSize = useBackgroundImageSize();
  const backgroundImageRepeat = useBackgroundImageRepeat();
  const backgroundImageOpacity = useBackgroundImageOpacity();

  return (
    <div className="bg-background w-screen h-screen overflow-hidden z-40 relative transition-colors duration-1000  flex justify-center">
      {isSuperbridge && (
        <motion.div
          animate={{
            opacity: pathname === "/" || pathname === "/fast" ? 1 : 0,
          }}
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

      <Header />

      {/* bridge */}
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
