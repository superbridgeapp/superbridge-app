import { P, match } from "ts-pattern";

import {
  ArbitrumDepositEthDto,
  ArbitrumDepositRetryableDto,
  DeploymentType,
  TransactionStatus,
} from "@/codegen/model";

import { transactionLink } from "../transaction-link";
import { ButtonComponent, ExpandedItem, ProgressRowStatus } from "./common";

export const useArbitrumDepositProgressRows =
  () =>
  (
    tx: Pick<
      ArbitrumDepositRetryableDto | ArbitrumDepositEthDto,
      "deposit" | "relay" | "deployment"
    >
  ): ExpandedItem[] => {
    const time =
      tx.deployment.type === DeploymentType.testnet ? "~ 5 mins" : "~ 10 mins";

    return [
      {
        label: tx.deposit.blockNumber ? "Deposited" : "Depositing",
        status: tx.deposit.blockNumber
          ? ProgressRowStatus.Done
          : ProgressRowStatus.InProgress,
        link: transactionLink(tx.deposit.transactionHash, tx.deployment.l1),
      },
      match(tx)
        .with({ deposit: P.when(({ blockNumber }) => !blockNumber) }, (d) => ({
          label: "L2 confirmation",
          status: ProgressRowStatus.NotDone,
          time,
        }))
        .with({ relay: { status: TransactionStatus.confirmed } }, (tx) => ({
          label: "L2 confirmation",
          status: ProgressRowStatus.Done,
          link: transactionLink(tx.relay.transactionHash, tx.deployment.l2),
        }))
        .with({ relay: { status: TransactionStatus.reverted } }, (tx) => ({
          label: "L2 confirmation",
          status: ProgressRowStatus.Reverted,
          link: transactionLink(tx.relay.transactionHash, tx.deployment.l2),
        }))
        .otherwise((tx) => {
          if (tx.deposit.timestamp < Date.now() - 1000 * 60 * 60) {
            return {
              label: "Manual relay required",
              status: ProgressRowStatus.InProgress,
              buttonComponent: ButtonComponent.Redeem,
            };
          }
          return {
            label: "Waiting for L2...",
            status: ProgressRowStatus.InProgress,
            time,
          };
        }),
    ];
  };
