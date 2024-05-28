import { useAccount } from "wagmi";

import { useBridgeControllerGetStatus } from "../codegen";

export const useStatusCheck = () => {
  const account = useAccount();
  const query = useBridgeControllerGetStatus(account.address ?? "");
  return query.data?.value ?? false;
};
