import { P, match } from "ts-pattern";

import { PortalDepositDto, TransactionStatus } from "@/codegen/model";

import { transactionLink } from "../transaction-link";
import { ExpandedItem, ProgressRowStatus } from "./common";

export const depositProgressRows = (
  tx: Pick<PortalDepositDto, "deposit" | "relay" | "deployment">
): ExpandedItem[] => {
  return match(tx)
    .with(
      {
        deposit: P.not(undefined),
        relay: P.not(undefined),
      },
      (d) => [
        {
          label: "Deposited",
          status: ProgressRowStatus.Done,
          link: transactionLink(d.deposit.transactionHash, d.deployment.l1),
        },
        {
          label: "L2 confirmation",
          status:
            d.relay.status === TransactionStatus.confirmed
              ? ProgressRowStatus.Done
              : ProgressRowStatus.Reverted,
          link: transactionLink(d.relay.transactionHash, d.deployment.l2),
        },
      ]
    )
    .with({ deposit: P.when(({ blockNumber }) => !blockNumber) }, (d) => [
      {
        label: "Depositing",
        status: ProgressRowStatus.InProgress,
        link: transactionLink(d.deposit.transactionHash, d.deployment.l1),
      },
      {
        label: "L2 confirmation",
        status: ProgressRowStatus.NotDone,
        time: "~ 3 mins",
      },
    ])
    .otherwise((d) => [
      {
        label: "Deposited",
        status: ProgressRowStatus.Done,
        link: transactionLink(d.deposit.transactionHash, d.deployment.l1),
      },
      {
        label: "Waiting for L2...",
        status: ProgressRowStatus.InProgress,
        time: "~ 3 mins",
      },
    ]);
};
