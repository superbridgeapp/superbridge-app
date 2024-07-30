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
            className="group flex items-center gap-0.5 text-primary rounded-full transition-all hover:scale-105"
            onClick={() => setDisplayTransactions(true)}
          >
            <div className="flex items-center gap-1 bg-primary text-primary-foreground px-1 py-0.5 rounded-full">
              {/* TODO: Maybe put action required text here as needed */}
              <span className="text-xs leading-none">{inProgressCount}</span>
              <IconSpinner className="w-3 h-3 shrink-0" />
            </div>
            <IconActivity className="fill-muted-foreground group-hover:fill-foreground group-hover:animate-wiggle-waggle transition-all h-6 w-6 shrink-0" />
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
