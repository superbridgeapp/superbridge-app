import { isSuperbridge, isSuperbridgeMainnet } from "@/utils/is-superbridge";

import { useHost } from "../use-metadata";

export const useIsSuperbridge = () => {
  return isSuperbridge(useHost());
};

export const useIsSuperbridgeMainnet = () => {
  return isSuperbridgeMainnet(useHost());
};
