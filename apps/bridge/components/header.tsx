import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

import { app } from "@/config/app";
import { useDeployments } from "@/hooks/use-deployments";
import { useNavigate } from "@/hooks/use-navigate";
import { useNavIcon } from "@/hooks/use-theme";

import { TokenBanner } from "./banners/token-banner";

export function Header() {
  const deployments = useDeployments();
  const navigate = useNavigate();

  const navIcon = useNavIcon();

  return (
    <nav className="flex flex-row justify-between items-center p-3 md:p-6 fixed top-0 left-0 w-screen z-10">
      <div onClick={() => navigate("/")} className="cursor-pointer">
        {app ? (
          <div className="bg-card rounded-full shadow-sm">
            <Image
              src={app.images.logoLight}
              width={0}
              height={0}
              sizes="100vw"
              alt={`${app.head.name} logo light`}
              draggable={false}
              className="rounded-full hidden md:inline-flex dark:md:hidden h-10 w-auto"
            />
            <Image
              src={app.images.logoDark}
              width={0}
              height={0}
              sizes="100vw"
              alt={`${app.head.name} logo dark`}
              draggable={false}
              className="rounded-full hidden md:hidden dark:md:inline-flex h-10 w-auto"
            />
            <Image
              src={app.images.logoLightSmall}
              width={0}
              height={0}
              sizes="100vw"
              alt={`${app.head.name} logo light small`}
              draggable={false}
              className="rounded-full  md:hidden dark:hidden h-10 w-auto"
            />
            <Image
              src={app.images.logoDarkSmall}
              width={0}
              height={0}
              sizes="100vw"
              alt={`${app.head.name} logo dark small`}
              draggable={false}
              className="rounded-full hidden dark:inline-flex dark:md:hidden h-10 w-auto"
            />
          </div>
        ) : (
          <img
            src={navIcon!}
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

      <ConnectButton
        chainStatus="icon"
        label="Connect"
        showBalance={{ smallScreen: false, largeScreen: false }}
        accountStatus={{
          smallScreen: "avatar",
          largeScreen: "avatar",
        }}
      />
    </nav>
  );
}
