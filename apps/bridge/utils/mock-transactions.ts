import { parseEther } from "viem";
import { arbitrumGoerli, goerli, optimismGoerli } from "wagmi/chains";

import {
  ArbitrumDepositEthDto,
  ArbitrumTransactionType,
  BridgeWithdrawalDto,
  ChainDto,
  ConfirmationDto,
  DeploymentFamily,
  DeploymentType,
  EthDepositDto,
  ForcedWithdrawalDto,
  OptimismTransactionType,
  PortalDepositDto,
  TransactionStatus,
} from "@/codegen/model";
import { MessageStatus } from "@/constants";

import { ArbitrumDeploymentDto, OptimismDeploymentDto } from "./is-mainnet";

const confirmation: ConfirmationDto = {
  blockNumber: 100,
  timestamp: Date.now() - 50000,
  transactionHash: "XXX",
  status: TransactionStatus.confirmed,
};

const optimismCommon = (type: "deposit" | "withdrawal", index: number) => ({
  id: `mock-${type}-${index}`,
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  from: "0x",
  to: "0x",
  amount: parseEther("1").toString(),
  mock: true,
  l1ChainId: goerli.id,
  l2ChainId: optimismGoerli.id,
  deployment: {
    id: Math.random().toString(),
    l1: goerli as unknown as ChainDto,
    l2: optimismGoerli as unknown as ChainDto,
    contractAddresses: {},
    name: "optimism-testnet",
    family: DeploymentFamily.optimism,
    type: DeploymentType.mainnet,
    config: {
      finalizationPeriodSeconds: 3600,
    },
  } as OptimismDeploymentDto,
});

const metadata: EthDepositDto = {
  data: {
    amount: parseEther("1").toString(),
  },
  from: "0x",
  to: "0x",
  type: "eth-deposit",
};

const justDeposited = {
  status: MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
  deposit: {
    transactionHash: "0x",
  },
  relay: undefined,
  metadata,
  l2TransactionHash: "0x",
} as PortalDepositDto;
const pendingDeposit = {
  status: MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
  deposit: confirmation,
  relay: undefined,
  metadata,
  l2TransactionHash: "0x",
};
const completedDeposit = {
  status: MessageStatus.RELAYED,
  l2TransactionHash: "0x",
  deposit: confirmation,
  relay: confirmation,
  metadata,
};
export const MOCK_DEPOSITS: PortalDepositDto[] = [
  justDeposited,
  pendingDeposit,
  completedDeposit,
].map((d, i) => ({
  ...optimismCommon("deposit", i),
  ...d,
  mock: true,
  type: OptimismTransactionType.deposit,
}));

// confirmed L2 transaction but no state root published
const initiatedWithdrawal = {
  status: MessageStatus.STATE_ROOT_NOT_PUBLISHED,
  withdrawal: confirmation,
};
// ready to prove
const readyToProve = {
  type: OptimismTransactionType.withdrawal,
  l1ChainId: goerli.id,
  l2ChainId: optimismGoerli.id,
  status: MessageStatus.READY_TO_PROVE,
  withdrawal: confirmation,
};
const inChallengePeriod = {
  status: MessageStatus.IN_CHALLENGE_PERIOD,
  withdrawal: confirmation,
  prove: confirmation,
};
const readyToFinalise = {
  status: MessageStatus.READY_FOR_RELAY,
  withdrawal: confirmation,
  prove: confirmation,
};
const withdrawalCompleted = {
  status: MessageStatus.RELAYED,
  withdrawal: confirmation,
  prove: confirmation,
  finalise: confirmation,
};
export const MOCK_WITHDRAWALS: BridgeWithdrawalDto[] = [
  initiatedWithdrawal,
  readyToProve,
  inChallengePeriod,
  readyToFinalise,
  withdrawalCompleted,
].map((d, i) => ({
  ...optimismCommon("withdrawal", i),
  ...d,
  mock: true,
  metadata,
  type: OptimismTransactionType.withdrawal,
}));

export const MOCK_FORCED_WITHDRAWALS: ForcedWithdrawalDto[] = [
  {
    deposit: MOCK_DEPOSITS[0],
    withdrawal: undefined,
  },
  ...MOCK_WITHDRAWALS.map((withdrawal) => ({
    deposit: MOCK_DEPOSITS[1],
    withdrawal,
  })),
].map((fw, i) => ({
  id: `mock-forced-withdrawal-${i}`,
  ...fw,
  type: OptimismTransactionType["forced-withdrawal"],
  mock: true,
}));

// arbitrum

const arbitrumCommon = (type: "deposit" | "withdrawal", index: number) => ({
  id: `mock-arbitrum-${type}-${index}`,
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  from: "0x",
  to: "0x",
  amount: parseEther("1").toString(),
  mock: true,
  deployment: {
    id: "arbitrum",
    name: "arbitrum",
    family: DeploymentFamily.arbitrum,
    type: DeploymentType.mainnet,
    l1: goerli as unknown as ChainDto,
    l2: arbitrumGoerli as unknown as ChainDto,
  } as ArbitrumDeploymentDto,
});

const justSendArbitrumDeposit: ArbitrumDepositEthDto = {
  status: MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
  // @ts-expect-error
  deposit: {
    transactionHash: "0x",
  },
  relay: undefined,
  metadata,
  l2TransactionHash: "0x",
};
const pendingArbitrumDeposit = {
  status: MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
  deposit: confirmation,
  relay: undefined,
  metadata,
  l2TransactionHash: "0x",
};
const completedArbitrumDeposit = {
  status: MessageStatus.RELAYED,
  l2TransactionHash: "0x",
  deposit: confirmation,
  relay: confirmation,
  metadata,
};
export const MOCK_ARBITRUM_DEPOSITS: ArbitrumDepositEthDto[] = [
  justSendArbitrumDeposit,
  pendingArbitrumDeposit,
  completedArbitrumDeposit,
].map((d, i) => ({
  ...arbitrumCommon("deposit", i),
  ...d,
  mock: true,
  type: ArbitrumTransactionType["arbitrum-deposit-eth"],
}));

export const MOCK_TRANSACTIONS = [
  ...MOCK_ARBITRUM_DEPOSITS,
  ...MOCK_DEPOSITS,
  ...MOCK_WITHDRAWALS,
  ...MOCK_FORCED_WITHDRAWALS,
];
