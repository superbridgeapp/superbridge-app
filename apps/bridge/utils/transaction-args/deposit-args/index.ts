import { isArbitrum, isOptimism } from "../../is-mainnet";
import { cctpBridgeArgs } from "../cctp-args/cctp-bridge-args";
import { isCctpBridgeOperation } from "../cctp-args/common";
import { arbitrumDepositArgs } from "./arbitrum-deposit-args";
import { optimismDepositArgs } from "./optimism-deposit-args";
import { DepositTxResolver } from "./types";

export const depositArgs: DepositTxResolver = (args) => {
  if (isCctpBridgeOperation(args.stateToken)) {
    return cctpBridgeArgs({ ...args, options: { forceViaL1: false } }, false);
  }

  if (isOptimism(args.deployment)) {
    return optimismDepositArgs(args);
  }

  if (isArbitrum(args.deployment)) {
    return arbitrumDepositArgs(args);
  }
};
