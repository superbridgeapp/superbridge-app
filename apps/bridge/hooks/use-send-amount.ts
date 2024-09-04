import { useSelectedToken } from "./tokens/use-token";
import { useGetFormattedAmount } from "./use-get-formatted-amount";
import { useWeiAmount } from "./use-wei-amount";

export const useSendAmount = () => {
  const token = useSelectedToken();
  const wei = useWeiAmount();
  const getFormattedAmount = useGetFormattedAmount(token);

  return getFormattedAmount(wei.toString());
};
