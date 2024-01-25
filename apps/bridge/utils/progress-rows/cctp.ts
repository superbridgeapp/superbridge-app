import { P, match } from "ts-pattern";

import { CctpBridgeDto, TransactionStatus } from "@/codegen/model";

import { transactionLink } from "../transaction-link";
import { ButtonComponent, ExpandedItem, ProgressRowStatus } from "./common";

export const cctpProgressRows = (
  tx: CctpBridgeDto,
  pendingFinalises: { [id: string]: string | undefined }
): ExpandedItem[] => {
  const pendingFinalise = pendingFinalises[tx?.id ?? ""];

  return [
    {
      label: tx.bridge.blockNumber ? "Bridged" : "Bridging",
      status: tx.bridge.blockNumber
        ? ProgressRowStatus.Done
        : ProgressRowStatus.InProgress,
      link: transactionLink(tx.bridge.transactionHash, tx.from),
    },
    match({ tx, pendingFinalise })
      .with(
        { tx: { bridge: P.when(({ blockNumber }) => !blockNumber) } },
        () => ({
          label: "L2 confirmation",
          status: ProgressRowStatus.NotDone,
        })
      )
      .with({ tx: { relay: P.when((relay) => !!relay?.blockNumber) } }, () => ({
        label: "Minted",
        status: ProgressRowStatus.Done,
        link: transactionLink(tx.relay!.transactionHash, tx.to),
      }))
      .with({ pendingFinalise: P.not(undefined) }, () => ({
        label: "Minting",
        status: ProgressRowStatus.InProgress,
      }))

      .otherwise(({ tx }) => {
        const TIME = tx.from.testnet ? 1000 * 60 * 3 : 1000 * 60 * 15;
        // because we use Hyperlane let's give Hyperlane some time
        // to relay.
        // const BUFFER = 1000 * 60 * 10;
        if (tx.bridge.timestamp < Date.now() - TIME) {
          return {
            label: "Ready to mint",
            status: ProgressRowStatus.InProgress,
            buttonComponent: ButtonComponent.Mint,
          };
        }
        return {
          label: "Waiting for attestation...",
          status: ProgressRowStatus.InProgress,
          time: tx.from.testnet ? "~ 3 mins" : "~ 15 mins",
        };
      }),
  ];
};
