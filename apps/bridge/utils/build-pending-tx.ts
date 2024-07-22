import { Address, Hex } from "viem";

import {
  ArbitrumDepositRetryableDto,
  ArbitrumWithdrawalDto,
  BridgeNftDto,
  BridgeWithdrawalDto,
  CctpBridgeDto,
  ChainDto,
  DeploymentDto,
  ForcedWithdrawalDto,
  HyperlaneBridgeDto,
  HyperlaneMailboxDto,
  NftDepositDto,
  PortalDepositDto,
  RouteProvider,
  RouteQuoteDto,
} from "@/codegen/model";
import { MessageStatus } from "@/constants";
import { ArbitrumMessageStatus } from "@/constants/arbitrum-message-status";
import { AcrossBridgeDto } from "@/types/across";
import { MultiChainToken } from "@/types/token";
import { isEth, isNativeToken } from "@/utils/is-eth";
import { isArbitrum, isOptimism } from "@/utils/is-mainnet";

export const buildPendingTx = (
  deployment: DeploymentDto | null,
  account: Address,
  recipient: Address,
  weiAmount: bigint,
  token: MultiChainToken | null,
  nft: BridgeNftDto | null,
  withdrawing: boolean,
  hash: Hex,
  force: boolean,
  provider: RouteProvider,
  hyperlaneMailboxes: HyperlaneMailboxDto[],
  { from, to }: { from: ChainDto; to: ChainDto }
) => {
  if (!token) {
    return null;
  }

  if (provider == RouteProvider.Across) {
    const b: AcrossBridgeDto = {
      id: Math.random().toString(),
      // @ts-expect-error
      deposit: {
        transactionHash: hash,
      },
      fromChainId: from.id,
      toChainId: to.id,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      metadata: {
        type: "across-bridge",
        from: account,
        to: recipient,
        data: {
          isEth: isNativeToken(token),
          inputAmount: weiAmount.toString(),
          outputAmount: weiAmount.toString(),
          inputTokenAddress: token[from.id ?? 0]?.address ?? "",
          outputTokenAddress: token[to.id ?? 0]?.address ?? "",
        },
      },
      type: "across-bridge",
      fill: undefined,
    };
    return b;
  }

  if (provider == RouteProvider.Hyperlane) {
    const fromMailbox = hyperlaneMailboxes.find((x) => x.chainId === from.id);
    const toMailbox = hyperlaneMailboxes.find((x) => x.chainId === to.id);
    if (!fromMailbox || !toMailbox) {
      return null;
    }
    const b: HyperlaneBridgeDto = {
      id: Math.random().toString(),
      // @ts-expect-error
      send: {
        transactionHash: hash,
      },
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),

      amount: weiAmount.toString(),
      type: "hyperlane-bridge",
      receive: undefined,

      fromDomain: fromMailbox.domain,
      toDomain: toMailbox.domain,
      token: token[from.id ?? 0]?.address ?? "",
    };
    return b;
  }

  if (!deployment) {
    return null;
  }

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
        deploymentId: deployment.id,
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
        deploymentId: deployment.id,
      };
      return a;
    }
  }

  if (provider === RouteProvider.Cctp) {
    const b: CctpBridgeDto = {
      id: Math.random().toString(),
      // @ts-expect-error
      bridge: {
        transactionHash: hash,
      },
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      amount: weiAmount.toString(),
      deploymentId: deployment.id,
      from,
      to,
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
          deploymentId: deployment.id,
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
        deploymentId: deployment.id,
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
      deploymentId: deployment.id,
    };
    return a;
  }

  if (isArbitrum(deployment) && !withdrawing) {
    const a: ArbitrumDepositRetryableDto = {
      type: "arbitrum-deposit-retryable",
      // @ts-expect-error
      deposit: {
        transactionHash: hash,
      },
      id: Math.random().toString(),
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      l2TransactionHash: "0x",
      metadata,
      deploymentId: deployment.id,
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
      deploymentId: deployment.id,
    };
    return w;
  }
};
