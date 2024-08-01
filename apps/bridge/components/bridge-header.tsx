import { useTransactions } from "@/hooks/use-transactions";
import { useConfigState } from "@/state/config";

import { IconActivity, IconSettings, IconSpinner } from "./icons";

export const BridgeHeader = () => {
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const setSettingsModal = useConfigState.useSetSettingsModal();

  const { inProgressCount } = useTransactions();

  return (
    <>
      <div className="flex items-center justify-between gap-8 px-4 md:px-5 pt-5 pb-4">
        <h2 className="font-heading leading-none text-sm px-2 py-1.5">
          Bridge
        </h2>
        <div className="flex gap-2 items-center">
          <button
            className="group flex items-center gap-2 text-foreground rounded-full transition-all hover:bg-muted rounded-full py-1.5 pl-2 pr-2.5"
            onClick={() => setDisplayTransactions(true)}
          >
            {/* TODO: Put "action required" text here as needed */}
            {inProgressCount > 0 && (
              <div className="flex items-center gap-1 text-primary-foreground bg-primary rounded-full px-1.5 py-1">
                <IconSpinner className="w-3 h-3 shrink-0" />
                <span className="text-sm font-heading leading-none">
                  {inProgressCount}
                </span>
              </div>
            )}
            <span className="font-heading text-sm leading-none">Activity</span>
            {/* <IconActivity className="fill-muted-foreground group-hover:fill-foreground group-hover:animate-wiggle-waggle transition-all h-2.5 w-auto shrink-0" /> */}
          </button>
          <button
            className="group flex items-center justify-center"
            onClick={() => setSettingsModal(true)}
          >
            <IconSettings className="fill-muted-foreground group-hover:fill-foreground transition-all group-hover:rotate-45 group-hover:scale-105 h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
};
