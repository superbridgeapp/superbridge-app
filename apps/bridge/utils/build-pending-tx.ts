import { Address, Hex } from "viem";

import {
  ArbitrumDepositRetryableDto,
  ArbitrumWithdrawalDto,
  BridgeNftDto,
  BridgeWithdrawalDto,
  CctpBridgeDto,
  DeploymentDto,
  ForcedWithdrawalDto,
  NftDepositDto,
  PortalDepositDto,
} from "@/codegen/model";
import { MessageStatus } from "@/constants";
import { ArbitrumMessageStatus } from "@/constants/arbitrum-message-status";
import { isCctpBridgeOperation } from "@/hooks/use-transaction-args/cctp-args/common";
import { MultiChainToken } from "@/types/token";
import { isEth } from "@/utils/is-eth";
import { isArbitrum, isOptimism } from "@/utils/is-mainnet";

export const buildPendingTx = (
  deployment: DeploymentDto,
  account: Address,
  recipient: Address,
  weiAmount: bigint,
  token: MultiChainToken | null,
  nft: BridgeNftDto | null,
  withdrawing: boolean,
  hash: Hex,
  force: boolean
) => {
  if (nft) {
    const metadata: NftDepositDto = {
      type: "nft-deposit",
      from: account,
      to: recipient,
      data: {
        localTokenAddress: nft.localConfig.address,
        remoteTokenAddress: nft.remoteConfig.address,
        tokenId: nft.tokenId,
      },
    };
    if (withdrawing) {
      const w: BridgeWithdrawalDto = {
        type: "withdrawal",
        id: Math.random().toString(),
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        l1ChainId: deployment.l1.id,
        l2ChainId: deployment.l2.id,
        from: account,
        to: account,
        // @ts-expect-error
        withdrawal: {
          transactionHash: hash,
        },
        metadata,
        status: MessageStatus.STATE_ROOT_NOT_PUBLISHED,
        deployment,
      };
      return w;
    } else {
      const a: PortalDepositDto = {
        type: "deposit",
        id: Math.random().toString(),
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        // @ts-expect-error
        deposit: {
          transactionHash: hash,
        },
        metadata,
        status: MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
        deployment,
      };
      return a;
    }
  }

  if (token) {
    if (isCctpBridgeOperation(token)) {
      const from = withdrawing ? deployment.l2 : deployment.l1;
      const b: CctpBridgeDto = {
        id: Math.random().toString(),
        // @ts-expect-error
        bridge: {
          transactionHash: hash,
        },
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        amount: weiAmount.toString(),
        deployment,
        from,
        to: withdrawing ? deployment.l1 : deployment.l2,
        type: "cctp-bridge",
        relay: undefined,
        token: token[from.id]!.address,
      };
      return b;
    }

    const metadata = isEth(token[deployment.l1.id]!)
      ? {
          type: "eth-deposit",
          from: account,
          to: recipient,
          data: {
            amount: weiAmount.toString(),
          },
        }
      : {
          type: "token-deposit",
          from: account,
          to: recipient,
          data: {
            amount: weiAmount.toString(),
            l1TokenAddress: token![deployment.l1.id]!.address,
            l2TokenAddress: token![deployment.l2.id]!.address,
          },
        };

    if (isOptimism(deployment) && withdrawing) {
      if (force) {
        const w: ForcedWithdrawalDto = {
          type: "forced-withdrawal",
          deposit: {
            type: "deposit",
            id: Math.random().toString(),
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            l1ChainId: deployment.l1.id,
            l2ChainId: deployment.l2.id,
            metadata,
            l2TransactionHash: "", // not used on the frontend
            // @ts-expect-error
            deposit: {
              transactionHash: hash,
            },
            status: MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
            deployment,
          },
        };
        return w;
      } else {
        const w: BridgeWithdrawalDto = {
          type: "withdrawal",
          id: Math.random().toString(),
          createdAt: new Date().toString(),
          updatedAt: new Date().toString(),
          l1ChainId: deployment.l1.id,
          l2ChainId: deployment.l2.id,
          from: account,
          to: account,
          // @ts-expect-error
          withdrawal: {
            transactionHash: hash,
          },
          metadata,
          status: MessageStatus.STATE_ROOT_NOT_PUBLISHED,
          deployment,
        };
        return w;
      }
    }

    if (isOptimism(deployment) && !withdrawing) {
      const a: PortalDepositDto = {
        type: "deposit",
        id: Math.random().toString(),
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        // @ts-expect-error
        deposit: {
          transactionHash: hash,
        },
        metadata,
        status: MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
        deployment: deployment,
      };
      return a;
    }

    if (isArbitrum(deployment) && !withdrawing) {
      const a: ArbitrumDepositRetryableDto = {
        type: "arbitrum-deposit-retryable",
        deployment,
        // @ts-expect-error
        deposit: {
          transactionHash: hash,
        },
        id: Math.random().toString(),
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        l2TransactionHash: "0x",
        metadata,
      };
      return a;
    }

    if (isArbitrum(deployment) && withdrawing) {
      const w: ArbitrumWithdrawalDto = {
        type: "arbitrum-withdrawal",
        id: Math.random().toString(),
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        // @ts-expect-error
        withdrawal: {
          transactionHash: hash,
        },
        metadata,
        status: ArbitrumMessageStatus.UNCONFIRMED,
        deployment,
      };
      return w;
    }
  }
};
