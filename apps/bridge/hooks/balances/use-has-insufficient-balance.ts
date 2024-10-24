import { useSelectedToken } from "../tokens";
import { useTokenBalance } from "../use-balances";
import { useWeiAmount } from "../use-wei-amount";

export const useHasInsufficientBalance = () => {
  const token = useSelectedToken();
  const tokenBalance = useTokenBalance(token);
  const weiAmount = useWeiAmount();

  return weiAmount > tokenBalance.data;
};
