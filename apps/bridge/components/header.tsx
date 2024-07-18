import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { isSuperbridge } from "@/config/superbridge";
import { useDeployments } from "@/hooks/use-deployments";
import { useNavigate } from "@/hooks/use-navigate";
import { useNavIcon } from "@/hooks/use-theme";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";

import { BadgeNew } from "./badges/new-badge";
import { TokenBanner } from "./banners/token-banner";
import { IconSuperFastSimple } from "./icons";

export function Header() {
  const deployments = useDeployments();
  const navigate = useNavigate();
  const displayTransactions = useConfigState.useDisplayTransactions();
  const fast = useConfigState.useFast();
  const superbridgeTestnetsEnabled = useInjectedStore((s) => s.testnets);
  const pathname = usePathname();

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

            {!superbridgeTestnetsEnabled && (
              <button
                onClick={() => navigate("fast")}
                className={`relative flex items-center justify-center h-10 w-14 bg-card rounded-full shadow-sm transition-all hover:scale-105`}
              >
                <IconSuperFastSimple
                  className={
                    fast && !displayTransactions
                      ? "fill-foreground transition-all"
                      : "fill-muted-foreground transition-all"
                  }
                />
                <BadgeNew className="absolute -top-1.5 -right-2.5 w-7 h-7" />
              </button>
            )}
          </div>
        )}
        <ConnectButton
          chainStatus="icon"
          label="Connect"
          showBalance={{ smallScreen: false, largeScreen: false }}
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "avatar",
          }}
        />
      </div>
    </nav>
  );
}
