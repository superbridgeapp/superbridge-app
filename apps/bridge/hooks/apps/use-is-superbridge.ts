import { useInjectedStore } from "@/state/injected";
import { isSuperbridge } from "@/utils/is-superbridge";

export const useIsSuperbridge = () => {
  return isSuperbridge(useInjectedStore((s) => s.host));
};
