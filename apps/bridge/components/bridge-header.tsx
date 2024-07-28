import { useTransactions } from "@/hooks/use-transactions";
import { useConfigState } from "@/state/config";

export const BridgeHeader = () => {
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const setSettingsModal = useConfigState.useSetSettingsModal();

  const { inProgressCount } = useTransactions();

  return (
    <>
      <div className="flex items-center gap-4 px-4 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
        <span>Bridge</span>

        <button
          className="flex items-center gap-1"
          onClick={() => setDisplayTransactions(true)}
        >
          <span>Activity</span>
          <span className="rounded-full bg-gray-100 p-1">
            {inProgressCount}
          </span>
        </button>
        <button className="ml-auto" onClick={() => setSettingsModal(true)}>
          Settings
        </button>
      </div>
    </>
  );
};
