import { useDepositArgs } from "@/hooks/use-transaction-args/deposit-args/use-deposit-args";
import { useCctpArgs } from "./cctp-args/use-cctp-bridge-args";
import { useWithdrawArgs } from "./withdraw-args/use-withdraw-args";

export const useTransactionArgs = () => {
  const deposit = useDepositArgs();
  const withdraw = useWithdrawArgs();
  const cctp = useCctpArgs();

  return deposit || withdraw || cctp;
};
