import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

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
        {deployments.length === 1 ? (
          <img
            src={navIcon!}
            width="0"
            height="0"
            sizes="100vw"
            alt={deployments[0]?.name}
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
