import { waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useConfig, useWalletClient } from "wagmi";

import { RouteProvider } from "@/codegen/model";
import { useActiveTokens } from "@/hooks/tokens/use-active-tokens";
import {
  useDestinationToken,
  useSelectedToken,
} from "@/hooks/tokens/use-token";
import { useAllowance } from "@/hooks/use-allowance";
import { useChain, useFromChain, useToChain } from "@/hooks/use-chain";
import { useStatusCheck } from "@/hooks/use-status-check";
import { useSwitchChain } from "@/hooks/use-switch-chain";
import { trackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { useModalsState } from "@/state/modals";
import { usePendingTransactions } from "@/state/pending-txs";
import { buildPendingTx } from "@/utils/build-pending-tx";
import { isRouteQuote } from "@/utils/guards";

import { useDeployment } from "../deployments/use-deployment";
import { useHyperlaneMailboxes } from "../hyperlane/use-hyperlane-mailboxes";
import { useAllowanceGasToken } from "../use-allowance-gas-token";
import { useInitiatingChainId } from "../use-initiating-chain-id";
import { useSelectedBridgeRoute } from "../use-selected-bridge-route";
import { useWeiAmount } from "../use-wei-amount";
import { useIsWithdrawal } from "../use-withdrawing";
import { useBridge } from "./use-bridge";

export const useInitiateBridge = () => {
  const bridge = useBridge();
  const wallet = useWalletClient();
  const account = useAccount();
  const from = useFromChain();
  const to = useToChain();
  const switchChain = useSwitchChain();
  const tokens = useActiveTokens();
  const token = useSelectedToken();

  const weiAmount = useWeiAmount();
  const deployment = useDeployment();
  const withdrawing = useIsWithdrawal();
  const fromToken = useSelectedToken();
  const toToken = useDestinationToken();
  const forceViaL1 = useConfigState.useForceViaL1();
  const rawAmount = useConfigState.useRawAmount();
  const recipient = useConfigState.useRecipientAddress();
  const setPendingBridgeTransactionHash =
    useModalsState.useSetPendingBridgeTransactionHash();
  const addPendingTransaction = usePendingTransactions.useAddTransaction();
  const updatePendingTransactionHash =
    usePendingTransactions.useUpdateTransactionByHash();
  const statusCheck = useStatusCheck();
  const hyperlaneMailboxes = useHyperlaneMailboxes();

  const initiatingChainId = useInitiatingChainId();
  const initiatingChain = useChain(initiatingChainId);
  const wagmiConfig = useConfig();
  const route = useSelectedBridgeRoute();

  const allowance = useAllowance();
  const gasTokenAllowance = useAllowanceGasToken();

  return async () => {
    if (
      !account.address ||
      !wallet.data ||
      !bridge.valid ||
      !recipient ||
      statusCheck ||
      !initiatingChain ||
      !isRouteQuote(route.data?.result)
    ) {
      return;
    }

    if (
      initiatingChain.id !== account.chainId ||
      initiatingChain.id !== wallet.data.chain.id
    ) {
      await switchChain(initiatingChain);
    }

    try {
      const hash = await bridge.write!();
      console.log(hash);
      setPendingBridgeTransactionHash(hash);

      const type =
        route.data.id === RouteProvider.Across
          ? "across"
          : route.data.id === RouteProvider.Cctp
          ? "cctp"
          : withdrawing
          ? "withdraw"
          : "deposit";

      trackEvent({
        event: "bridge",
        from: from?.name ?? "",
        to: to?.name ?? "",
        amount: parseFloat(rawAmount),
        token: token?.symbol ?? "",
        type,
        transactionHash: hash,
      });

      const pending = buildPendingTx(
        deployment,
        account.address,
        recipient,
        weiAmount,
        fromToken,
        toToken,
        withdrawing,
        hash,
        forceViaL1,
        route.data.id,
        hyperlaneMailboxes,
        { from: from!, to: to! }
      );
      if (pending) addPendingTransaction(pending);

      waitForTransactionReceipt(wagmiConfig, {
        hash,
        chainId: initiatingChain.id,
        onReplaced: ({ replacedTransaction, transaction }) => {
          updatePendingTransactionHash(
            replacedTransaction.hash,
            transaction.hash
          );
        },
      });

      return hash;
    } catch (e) {
      console.log(e);
    } finally {
      allowance.refetch();
      gasTokenAllowance.refetch();
    }
  };
};
