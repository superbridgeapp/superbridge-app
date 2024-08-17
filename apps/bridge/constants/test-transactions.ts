import {
  BridgeWithdrawalDto,
  OptimismTransactionType,
  PortalDepositDto,
  TransactionStatus,
} from "@/codegen/model";
import { Transaction } from "@/types/transaction";

import { MessageStatus } from "./optimism-message-status";

const unconfirmedTx = {
  transactionHash: "0x",
};
const confirmedTx = {
  blockNumber: 1,
  status: TransactionStatus.confirmed,
  transactionHash: "0x",
  timestamp: Date.now() - 1000 * 60,
};
const ethDepositMetadata = {
  data: {
    amount: "1000000000000000000",
  },
  from: "0x",
  to: "0x",
  type: "eth-deposit",
};

const justSubmittedDeposit: PortalDepositDto = {
  id: "1231",
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  deploymentId: "c0a97bd5-35b4-451f-b6c1-f9317421ab01", // OP Mainnet
  type: OptimismTransactionType.deposit,
  l2TransactionHash: "0x",
  metadata: ethDepositMetadata,
  duration: 1,
  // @ts-expect-error
  deposit: unconfirmedTx,
  status: MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
  mock: true,
};
const submittedDeposit: PortalDepositDto = {
  ...justSubmittedDeposit,
  deposit: confirmedTx,
  status: MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
};
const successfulDeposit: PortalDepositDto = {
  ...submittedDeposit,
  relay: confirmedTx,
  status: MessageStatus.RELAYED,
};

const justSubmittedWithdrawal: BridgeWithdrawalDto = {
  mock: true,
  id: "1231",
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  deploymentId: "c0a97bd5-35b4-451f-b6c1-f9317421ab01", // OP Mainnet
  type: OptimismTransactionType.withdrawal,
  metadata: ethDepositMetadata,
  // @ts-expect-error
  withdrawal: unconfirmedTx,
  status: MessageStatus.STATE_ROOT_NOT_PUBLISHED,
};
const waitingForStateRootWithdrawal: BridgeWithdrawalDto = {
  ...justSubmittedWithdrawal,
  withdrawal: confirmedTx,
  status: MessageStatus.STATE_ROOT_NOT_PUBLISHED,
};
const readyToProveWithdrawal: BridgeWithdrawalDto = {
  ...waitingForStateRootWithdrawal,
  withdrawal: confirmedTx,
  status: MessageStatus.READY_TO_PROVE,
};
const challengePeriodWithdrawal: BridgeWithdrawalDto = {
  ...readyToProveWithdrawal,
  withdrawal: confirmedTx,
  prove: confirmedTx,
  status: MessageStatus.IN_CHALLENGE_PERIOD,
};
const readyToFinalizeWithdrawal: BridgeWithdrawalDto = {
  ...challengePeriodWithdrawal,
  withdrawal: confirmedTx,
  status: MessageStatus.READY_FOR_RELAY,
};
const completedWithdrawal: BridgeWithdrawalDto = {
  ...readyToFinalizeWithdrawal,
  withdrawal: confirmedTx,
  prove: confirmedTx,
  finalise: confirmedTx,
  status: MessageStatus.RELAYED,
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  justSubmittedDeposit,
  submittedDeposit,
  successfulDeposit,

  justSubmittedWithdrawal,
  waitingForStateRootWithdrawal,
  readyToProveWithdrawal,
  challengePeriodWithdrawal,
  readyToFinalizeWithdrawal,
  completedWithdrawal,
];
