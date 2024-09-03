import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useIsSuperbridge } from "@/hooks/apps/use-is-superbridge";
import { useDeployments } from "@/hooks/deployments/use-deployments";
import { useIsWidget } from "@/hooks/use-is-widget";
import { useNavigate } from "@/hooks/use-navigate";
import { useNavIcon } from "@/hooks/use-theme";

import { TokenBanner } from "./banners/token-banner";
import { HeaderLinks } from "./header/header-links";
import { SBLockup, SBLockupSmall } from "./icons";

export function Header() {
  const deployments = useDeployments();
  const navigate = useNavigate();
  const isSuperbridge = useIsSuperbridge();
  const navIcon = useNavIcon();

  const widget = useIsWidget();

  if (widget) {
    return null;
  }

  return (
    <nav className="flex flex-row justify-between items-center p-3 md:p-6 fixed top-0 left-0 w-screen z-10">
      <div onClick={() => navigate("/")} className="cursor-pointer">
        {isSuperbridge ? (
          <>
            <SBLockup className="hidden md:inline-flex h-8 w-auto" />
            <SBLockupSmall className="md:hidden h-8 w-auto" />
          </>
        ) : (
          <img
            src={navIcon}
            width="0"
            height="0"
            sizes="100vw"
            alt={deployments[0]?.name}
            draggable={false}
            className="inline-flex w-auto max-w-40 h-8"
          />
        )}
      </div>

      <TokenBanner />

      <div className="flex gap-3">
        <ConnectButton
          chainStatus="icon"
          label="Connect"
          showBalance={{ smallScreen: false, largeScreen: false }}
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "avatar",
          }}
        />
        <HeaderLinks />
      </div>
    </nav>
  );
}
