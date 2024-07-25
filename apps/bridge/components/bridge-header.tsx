import { useConfigState } from "@/state/config";

export const BridgeHeader = () => {
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();

  return (
    <>
      <div className="flex items-center gap-2 px-4 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
        <span>Bridge</span>
        <button onClick={() => setDisplayTransactions(true)}>Activity</button>

        <span className="ml-auto">Settings</span>
      </div>
    </>
  );
};
