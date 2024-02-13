import { isArbitrum, isOptimism } from "../../is-mainnet";
import { cctpBridgeArgs } from "../cctp-args/cctp-bridge-args";
import { isCctpBridgeOperation } from "../cctp-args/common";
import { arbitrumWithdrawArgs } from "./arbitrum-withdraw-args";
import { optimismWithdrawArgs } from "./optimism-withdraw-args";
import { WithdrawTxResolver } from "./types";

export const withdrawArgs: WithdrawTxResolver = (args) => {
  if (isCctpBridgeOperation(args.stateToken)) {
    return cctpBridgeArgs(args, true);
  }

  if (isOptimism(args.deployment)) {
    return optimismWithdrawArgs(args);
  }

  if (isArbitrum(args.deployment)) {
    return arbitrumWithdrawArgs(args);
  }
};
