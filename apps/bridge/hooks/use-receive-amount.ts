import { useConfigState } from "@/state/config";

import { useAcrossFee } from "./across/use-across-fee";

export const useReceiveAmount = () => {
  const rawAmount = useConfigState.useRawAmount();
  const fast = useConfigState.useFast();

  const acrossFee = useAcrossFee();
  const parsedRawAmount = parseFloat(rawAmount) || 0;

  if (!fast) {
    return { data: parsedRawAmount, isFetching: false };
  }

  if (acrossFee.data) {
    const data = parsedRawAmount - acrossFee.data;

    return {
      data,
      isFetching: false,
    };
  }

  return {
    data: null,
    isFetching: true,
  };
};
