import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";

import { DeploymentType } from "@/codegen/model";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsSpecialApp } from "@/hooks/apps/use-is-special-app";
import { useIsSuperbridge } from "@/hooks/apps/use-is-superbridge";
import { useDeployments } from "@/hooks/deployments/use-deployments";
import { useIsWidget } from "@/hooks/use-is-widget";
import { useModal } from "@/hooks/use-modal";
import { useTransactions } from "@/hooks/use-transactions";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";

import { TestnetBadge } from "./badges/testnet-badge";
import {
  IconActivity,
  IconArrowUpRight,
  IconEllip,
  IconSB,
  IconSettings,
  IconSpinner,
} from "./icons";

export const BridgeHeader = () => {
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const settingsModal = useModal("Settings");

  const { inProgressCount, actionRequiredCount } = useTransactions();

  const deployments = useDeployments();
  const superbridgeTestnets = useInjectedStore((s) => s.superbridgeTestnets);
  const isSuperbridge = useIsSuperbridge();
  const isSpecialApp = useIsSpecialApp();

  const isWidget = useIsWidget();
  const account = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <div
        className={clsx(
          "flex items-center justify-end gap-8 w-full",
          isWidget ? "pt-4 -mb-2 px-4" : "px-0.5"
        )}
      >
        {(isSuperbridge && superbridgeTestnets) ||
        (!isSpecialApp &&
          deployments.length === 1 &&
          deployments[0]?.type === DeploymentType.testnet) ? (
          <div className="pl-0.5 mr-auto">
            <TestnetBadge />
          </div>
        ) : null}

        {/* {account.address && isWidget && (
          <div className="pl-0.5 mr-auto">
            <span className="bg-muted rounded-full text-xs text-muted-foreground px-3 py-1 h-6">
              {account.address.slice(0, 4)}&hellip;
              {account.address.slice(account.address.length - 4)}
            </span>
          </div>
        )} */}

        <div className="flex gap-1.5 items-center">
          <button
            className={clsx(
              inProgressCount > 0 ? "bg-card pr-3 pl-2" : "bg-card",
              isWidget ? "bg-muted" : "bg-card",
              "group hover:scale-105 transition-all flex items-center gap-1.5 text-foreground rounded-full transition-all rounded-full py-1.5 px-2 bg-card font-button"
            )}
            onClick={() => setDisplayTransactions(true)}
          >
            <IconActivity
              className={clsx(
                inProgressCount > 0
                  ? "fill-foreground"
                  : "fill-muted-foreground",
                "group-hover:fill-foreground group-hover:animate-wiggle-waggle transition-all h-5 w-5 shrink-0"
              )}
            />
            {inProgressCount > 0 && (
              <div className="flex items-center gap-1.5 pr-1.5 pl-2.5 h-5 rounded-full bg-primary">
                <span className="text-[10px] leading-none text-primary-foreground">
                  {actionRequiredCount > 0 ? "Action needed" : inProgressCount}
                </span>
                <IconSpinner className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
            )}
          </button>
          <button
            className={clsx(
              "group hover:scale-105 transition-all flex items-center justify-center py-1.5 px-2  rounded-full",
              isWidget ? "bg-muted" : "bg-card"
            )}
            onClick={() => settingsModal.open()}
          >
            <IconSettings className="fill-muted-foreground group-hover:fill-foreground transition-all group-hover:rotate-[15deg] group-hover:scale-105 h-5 w-5 shrink-0" />
          </button>

          {isWidget && (
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-muted group hover:scale-105 transition-all flex items-center justify-center py-1.5 px-2 rounded-full outline-none focus:outline-none focus-visible:ring-transparent focus:ring-transparent ring-transparent">
                <IconEllip className="fill-muted-foreground group-hover:fill-foreground transition-all group-hover:scale-105 h-5 w-5 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {account.address ? (
                  <DropdownMenuItem
                    className="flex justify-between items-center w-full"
                    onClick={() => disconnect()}
                  >
                    <span className="text-sm">Disconnect</span>
                    <span className="bg-muted rounded-full text-xs text-muted-foreground px-2 py-1 h-6">
                      {account.address.slice(0, 4)}&hellip;
                      {account.address.slice(account.address.length - 4)}
                    </span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem>
                    <ConnectButton />
                  </DropdownMenuItem>
                )}

                <div className="bg-muted p-3 rounded-lg flex flex-col gap-3 mt-3 z-50">
                  <a
                    href="https://superbridge.app"
                    className=" text-xs  leading-none w-full flex gap-2 items-center"
                  >
                    <IconSB className="h-4 w-auto fill-foreground" />
                    <span>Powered by Superbridge</span>
                  </a>
                  <Link
                    href="https://help.superbridge.app"
                    className=" text-xs  leading-none w-full flex gap-2 items-center"
                  >
                    <IconArrowUpRight className="mx-0.5 h-3 w-3 fill-muted-foreground" />
                    <span>Support & FAQs</span>
                  </Link>
                  <button
                    className=" text-xs  leading-none w-full flex gap-2 items-center"
                    // onClick={() => legalModal.open()}
                  >
                    <IconArrowUpRight className="mx-0.5 h-3 w-3 w-auto fill-muted-foreground" />
                    <span>Legal</span>
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </>
  );
};
