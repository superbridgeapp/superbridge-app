import { waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useConfig, useWalletClient } from "wagmi";

import { useBridgeControllerTrack } from "@/codegen";
import { RouteProvider } from "@/codegen/model";
import { useAllowance } from "@/hooks/use-allowance";
import { useChain, useFromChain, useToChain } from "@/hooks/use-chain";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useStatusCheck } from "@/hooks/use-status-check";
import { useSwitchChain } from "@/hooks/use-switch-chain";
import { useActiveTokens } from "@/hooks/use-tokens";
import { trackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { useModalsState } from "@/state/modals";
import { usePendingTransactions } from "@/state/pending-txs";
import { buildPendingTx } from "@/utils/build-pending-tx";
import { isRouteQuote } from "@/utils/guards";
import { isNativeToken } from "@/utils/is-eth";

import { useDeployment } from "../use-deployment";
import { useInitiatingChainId } from "../use-initiating-chain-id";
import { useSelectedBridgeRoute } from "../use-selected-bridge-route";
import { useWeiAmount } from "../use-wei-amount";
import { useIsWithdrawal } from "../use-withdrawing";
import { useBridge } from "./use-bridge";

export const useInitiateBridge = (bridge: ReturnType<typeof useBridge>) => {
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
  const stateToken = useConfigState.useToken();
  const forceViaL1 = useConfigState.useForceViaL1();
  const rawAmount = useConfigState.useRawAmount();
  const nft = useConfigState.useNft();
  const recipient = useConfigState.useRecipientAddress();
  const setToken = useConfigState.useSetToken();
  const setPendingBridgeTransactionHash =
    useModalsState.useSetPendingBridgeTransactionHash();
  const addPendingTransaction = usePendingTransactions.useAddTransaction();
  const updatePendingTransactionHash =
    usePendingTransactions.useUpdateTransactionByHash();
  const statusCheck = useStatusCheck();
  const track = useBridgeControllerTrack();

  const initiatingChainId = useInitiatingChainId();
  const initiatingChain = useChain(initiatingChainId);
  const wagmiConfig = useConfig();
  const route = useSelectedBridgeRoute();

  const allowance = useAllowance(token, bridge.address);

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
      console.log("fff.hier", route, bridge.valid);
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
        stateToken,
        nft,
        withdrawing,
        hash,
        forceViaL1,
        route.data.id,
        route.data.result,
        { from: from!, to: to! }
      );
      if (pending) addPendingTransaction(pending);

      if (nft) {
        setToken(tokens.find((x) => isNativeToken(x))!);
      }

      await waitForTransactionReceipt(wagmiConfig, {
        hash,
        chainId: initiatingChain.id,
        onReplaced: ({ replacedTransaction, transaction }) => {
          updatePendingTransactionHash(
            replacedTransaction.hash,
            transaction.hash
          );
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
      allowance.refetch();
    }
  };
};
