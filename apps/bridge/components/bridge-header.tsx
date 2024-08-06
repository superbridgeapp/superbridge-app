import clsx from "clsx";

import { ModalNames } from "@/constants/modal-names";
import { useTransactions } from "@/hooks/use-transactions";
import { useConfigState } from "@/state/config";

import { IconActivity, IconSettings, IconSpinner } from "./icons";

export const BridgeHeader = () => {
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const addModal = useConfigState.useAddModal();

  const { inProgressCount } = useTransactions();

  return (
    <>
      <div className="flex items-center justify-between gap-8 px-4 md:px-5 pt-5 pb-4">
        <h2 className="font-heading leading-none text-sm px-2 py-1.5">
          Bridge
        </h2>
        <div className="flex gap-1 items-center">
          <button
            className={clsx(
              inProgressCount > 0 ? "bg-muted pl-2.5" : "bg-transparent",
              "group flex items-center gap-2 text-foreground rounded-full transition-all rounded-full py-1  px-1"
            )}
            onClick={() => setDisplayTransactions(true)}
          >
            {/* TODO: Put "action required" text here as needed */}
            {inProgressCount > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs font-body leading-none">
                  {inProgressCount} Active
                </span>
              </div>
            )}
            {/* <span className="font-heading text-sm leading-none">Activity</span> */}
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
            className="group flex items-center justify-center p-1 rounded-full"
            onClick={() => addModal(ModalNames.Settings)}
          >
            <IconSettings className="fill-muted-foreground group-hover:fill-foreground transition-all group-hover:rotate-45 group-hover:scale-105 h-5 w-5 shrink-0" />
          </button>
        </div>
      </div>
    </>
  );
};
