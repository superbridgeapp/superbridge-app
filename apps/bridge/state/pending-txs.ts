import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";

import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isArbitrumForcedWithdrawal,
  isDeposit,
  isOptimismForcedWithdrawal,
  isWithdrawal,
} from "@/utils/guards";
import { getInitiatingHash } from "@/utils/initiating-tx-hash";

interface PendingTransactionsState {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  removeTransactionByHash: (hash: string) => void;
  updateTransactionByHash: (oldHash: string, newHash: string) => void;

  pendingProves: { [id: string]: string | undefined };
  setProving: (id: string, hash: string) => void;
  removeProving: (id: string) => void;

  pendingFinalises: { [id: string]: string | undefined };
  setFinalising: (id: string, hash: string) => void;
  removeFinalising: (id: string) => void;

  logout: () => void;
}

const pendingTransactionsState = create<PendingTransactionsState>()((set) => ({
  logout: () => {
    set({ transactions: [], pendingFinalises: {}, pendingProves: {} });
  },

  transactions: [],
  addTransaction: (tx) => {
    set((s) => ({ transactions: [tx, ...s.transactions] }));
  },
  removeTransactionByHash: (hash) => {
    set((s) => ({
      transactions: s.transactions.filter(
        (tx) => getInitiatingHash(tx) !== hash
      ),
    }));
  },
  updateTransactionByHash: (oldHash, newHash) => {
    set((s) => ({
      transactions: s.transactions.map((tx) => {
        if (isDeposit(tx) && tx.deposit.transactionHash === oldHash) {
          return {
            ...tx,
            deposit: {
              ...tx.deposit,
              transactionHash: newHash,
            },
          };
        }
        if (isWithdrawal(tx) && tx.withdrawal.transactionHash === oldHash) {
          return {
            ...tx,
            withdrawal: {
              ...tx.withdrawal,
              transactionHash: newHash,
            },
          };
        }
        if (
          isOptimismForcedWithdrawal(tx) &&
          tx.deposit.deposit.transactionHash === oldHash
        ) {
          return {
            ...tx,
            deposit: {
              ...tx.deposit,
              deposit: {
                ...tx.deposit.deposit,
                transactionHash: newHash,
              },
            },
          };
        }
        if (
          isArbitrumForcedWithdrawal(tx) &&
          tx.deposit.deposit.transactionHash === oldHash
        ) {
          return {
            ...tx,
            deposit: {
              ...tx.deposit,
              deposit: {
                ...tx.deposit.deposit,
                transactionHash: newHash,
              },
            },
          };
        }
        if (isAcrossBridge(tx) && tx.deposit.transactionHash === oldHash) {
          return {
            ...tx,
            deposit: {
              ...tx.deposit,
              transactionHash: newHash,
            },
          };
        }
        return tx;
      }),
    }));
  },

  pendingProves: {},
  pendingFinalises: {},
  setProving: (id, transactionHash) =>
    set((s) => ({
      pendingProves: { ...s.pendingProves, [id]: transactionHash },
    })),
  removeProving: (id) => set((s) => ({ ...s.pendingProves, [id]: undefined })),
  setFinalising: (id, transactionHash) =>
    set((s) => ({
      pendingFinalises: { ...s.pendingFinalises, [id]: transactionHash },
    })),
  removeFinalising: (id) =>
    set((s) => ({ ...s.pendingFinalises, [id]: undefined })),
}));

export const usePendingTransactions = createSelectorHooks(
  pendingTransactionsState
);
