import { useAccount } from "wagmi";

import { useBridgeControllerGetTrmFlaggedStatus } from "../codegen";

export const useSanctioned = () => {
  const account = useAccount();
  const query = useBridgeControllerGetTrmFlaggedStatus(account.address ?? "");
  return query.data?.data.value ?? false;
};
