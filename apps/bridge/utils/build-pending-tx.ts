import { Address, Hex } from "viem";

import {
  ArbitrumDepositRetryableDto,
  ArbitrumWithdrawalDto,
  BridgeWithdrawalDto,
  CctpBridgeDto,
  ChainDto,
  DeploymentDto,
  ForcedWithdrawalDto,
  HyperlaneBridgeDto,
  HyperlaneMailboxDto,
  LzBridgeV2Dto,
  LzDomainDto,
  PortalDepositDto,
  RouteProvider,
} from "@/codegen/model";
import { MessageStatus } from "@/constants";
import { ArbitrumMessageStatus } from "@/constants/arbitrum-message-status";
import { AcrossBridgeDto } from "@/types/across";
import { Token } from "@/types/token";
import { isArbitrum, isOptimism } from "@/utils/deployments/is-mainnet";
import { isEth } from "@/utils/tokens/is-eth";

export const buildPendingTx = (
  deployment: DeploymentDto | null,
  account: Address,
  recipient: Address,
  weiAmount: bigint,
  fromToken: Token | null,
  toToken: Token | null,
  withdrawing: boolean,
  hash: Hex,
  force: boolean,
  provider: RouteProvider,
  hyperlaneMailboxes: HyperlaneMailboxDto[],
  lzDomains: LzDomainDto[],
  { from, to }: { from: ChainDto; to: ChainDto }
) => {
  if (!fromToken || !toToken) {
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
          isEth: isEth(fromToken),
          inputAmount: weiAmount.toString(),
          outputAmount: weiAmount.toString(),
          inputTokenAddress: fromToken?.address ?? "",
          outputTokenAddress: toToken?.address ?? "",
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
      duration: 1000 * 60 * 2,

      fromDomain: fromMailbox.domain,
      toDomain: toMailbox.domain,
      token: fromToken.hyperlane?.router ?? "",
    };
    return b;
  }

  if (provider == RouteProvider.Lz) {
    const fromDomain = lzDomains.find((x) => x.chainId === from.id);
    const toDomain = lzDomains.find((x) => x.chainId === to.id);
    if (!fromDomain || !toDomain) {
      return null;
    }
    const b: LzBridgeV2Dto = {
      id: Math.random().toString(),
      // @ts-expect-error
      send: {
        transactionHash: hash,
      },
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),

      amount: weiAmount.toString(),
      type: "lz-bridge",
      receive: undefined,
      duration: 1000 * 60 * 2,

      from: account,
      fromEid: fromDomain.eId,
      toEid: toDomain.eId,

      to: recipient,
      token: fromToken.address,
    };
    return b;
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
      from,
      to,
      fromChainId: from.id,
      toChainId: to.id,
      type: "cctp-bridge",
      relay: undefined,
      token: fromToken.address,
    };
    return b;
  }

  if (!deployment) {
    return null;
  }

  const metadata = isEth(fromToken)
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
          l1TokenAddress: withdrawing ? toToken.address : fromToken.address,
          l2TokenAddress: withdrawing ? fromToken.address : toToken.address,
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
          l1ChainId: deployment.l1ChainId,
          l2ChainId: deployment.l2ChainId,
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
        l1ChainId: deployment.l1ChainId,
        l2ChainId: deployment.l2ChainId,
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
