import clsx from "clsx";

import { DeploymentType } from "@/codegen/model";
import { ModalNames } from "@/constants/modal-names";
import { useIsSuperbridge } from "@/hooks/apps/use-is-superbridge";
import { useDeployments } from "@/hooks/deployments/use-deployments";
import { useTransactions } from "@/hooks/use-transactions";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";

import { TestnetBadge } from "./badges/testnet-badge";
import { IconActivity, IconSettings } from "./icons";

export const BridgeHeader = () => {
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const addModal = useConfigState.useAddModal();

  const { inProgressCount, actionRequiredCount } = useTransactions();

  const deployments = useDeployments();
  const superbridgeTestnets = useInjectedStore((s) => s.superbridgeTestnets);
  const isSuperbridge = useIsSuperbridge();

  return (
    <>
      <div className="flex items-center justify-end gap-8 py-2 px-0.5">
        {(isSuperbridge && superbridgeTestnets) ||
        (!isSuperbridge && deployments[0]?.type === DeploymentType.testnet) ? (
          <div className="pl-0.5 mr-auto">
            <TestnetBadge />
          </div>
        ) : null}

        <div className="flex gap-1.5 items-center">
          <button
            className={clsx(
              inProgressCount > 0 ? "bg-muted pl-3" : "bg-card",
              "group hover:scale-105 transition-all flex items-center gap-1.5 text-foreground rounded-full transition-all rounded-full py-1.5 px-1.5 bg-card font-button"
            )}
            onClick={() => setDisplayTransactions(true)}
          >
            {inProgressCount > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs font-body leading-none">
                  {actionRequiredCount > 0
                    ? "Action required"
                    : `${inProgressCount} active`}
                </span>
              </div>
            )}
            <IconActivity
              className={clsx(
                inProgressCount > 0
                  ? "fill-foreground animate-wiggle-waggle"
                  : "fill-muted-foreground",
                "group-hover:fill-foreground group-hover:animate-wiggle-waggle transition-all h-5 w-5 shrink-0"
              )}
            />
          </button>
          <button
            className="group hover:scale-105 transition-all flex items-center justify-center p-1.5 rounded-full bg-card"
            onClick={() => addModal(ModalNames.Settings)}
          >
            <IconSettings className="fill-muted-foreground group-hover:fill-foreground transition-all group-hover:rotate-[15deg] group-hover:scale-105 h-5 w-5 shrink-0" />
          </button>
        </div>
      </div>
    </>
  );
};
