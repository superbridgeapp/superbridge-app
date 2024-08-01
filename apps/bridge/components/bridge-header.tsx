import { useTransactions } from "@/hooks/use-transactions";
import { useConfigState } from "@/state/config";

import { IconActivity, IconSettings, IconSpinner } from "./icons";

export const BridgeHeader = () => {
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const setSettingsModal = useConfigState.useSetSettingsModal();

  const { inProgressCount } = useTransactions();

  return (
    <>
      <div className="flex items-center justify-between gap-8 px-4 md:px-5 py-5">
        <h2 className="font-heading leading-none">Bridge</h2>
        <div className="flex gap-2 items-center">
          <button
            className="group flex items-center gap-2 text-primary rounded-full transition-all hover:scale-105 bg-primary py-1.5 px-2"
            onClick={() => setDisplayTransactions(true)}
          >
            <div className="flex items-center gap-1 text-primary-foreground">
              {/* TODO: Maybe put action required text here as needed */}
              {/* TODO: Hide if no actives */}
              <IconSpinner className="w-3 h-3 shrink-0" />
              <span className="text-xs leading-none">{inProgressCount}</span>
            </div>
            <IconActivity className="fill-muted-foreground group-hover:fill-foreground group-hover:animate-wiggle-waggle transition-all h-2.5 w-auto shrink-0" />
          </button>
          <button
            className="group flex items-center justify-center"
            onClick={() => setSettingsModal(true)}
          >
            <IconSettings className="fill-muted-foreground group-hover:fill-foreground transition-all group-hover:rotate-45 group-hover:scale-105 h-6 w-6" />
          </button>
        </div>
      </div>
    </>
  );
};
