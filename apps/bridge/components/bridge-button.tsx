import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";
import { Address, formatUnits, isAddressEqual } from "viem";
import { useAccount, useBalance } from "wagmi";

import { useIsAcrossRoute } from "@/hooks/across/use-is-across-route";
import { useHasInsufficientBalance } from "@/hooks/balances/use-has-insufficient-balance";
import { useBridge } from "@/hooks/bridge/use-bridge";
import { useBridgeDisabled } from "@/hooks/bridge/use-bridge-disabled";
import { useBridgeMax } from "@/hooks/bridge/use-bridge-max";
import { useBridgeMin } from "@/hooks/bridge/use-bridge-min";
import { useBridgePaused } from "@/hooks/bridge/use-bridge-paused";
import { useNetworkFee } from "@/hooks/gas/use-network-fee";
import { useRouteRequest } from "@/hooks/routes/use-route-request";
import { useSelectedBridgeRoute } from "@/hooks/routes/use-selected-bridge-route";
import { useNativeToken } from "@/hooks/tokens/use-native-token";
import { useSelectedToken } from "@/hooks/tokens/use-token";
import { useTokenBalance } from "@/hooks/use-balances";
import { useBaseNativeTokenBalance } from "@/hooks/use-base-native-token-balance";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useInitiatingChain } from "@/hooks/use-initiating-chain-id";
import { useModal } from "@/hooks/use-modal";
import { useRequiredCustomGasTokenBalance } from "@/hooks/use-required-custom-gas-token-balance";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useIsWithdrawal } from "@/hooks/use-withdrawing";
import { useConfigState } from "@/state/config";
import { formatDecimals } from "@/utils/format-decimals";
import { isRouteQuote } from "@/utils/guards";
import { deadAddress } from "@/utils/tokens/is-eth";

import { Button } from "./ui/button";

export const BridgeButton = () => {
  const { openConnectModal } = useConnectModal();
  const account = useAccount();
  const from = useFromChain();
  const to = useToChain();
  const bridge = useBridge();
  const weiAmount = useWeiAmount();
  const token = useSelectedToken();
  const { t } = useTranslation();

  const setConfirmationModal = useConfigState.useSetDisplayConfirmationModal();
  const withdrawing = useIsWithdrawal();
  const isAcross = useIsAcrossRoute();
  const recipient = useConfigState.useRecipientAddress();
  const nativeToken = useNativeToken();
  const bridgeMax = useBridgeMax();
  const bridgeMin = useBridgeMin();
  const paused = useBridgePaused();
  const disabled = useBridgeDisabled();
  const route = useSelectedBridgeRoute();
  const routeRequest = useRouteRequest();
  const recipientAddressModal = useModal("RecipientAddress");

  const initiatingChain = useInitiatingChain();
  const fromEthBalance = useBalance({
    address: account.address,
    chainId: initiatingChain?.id || from?.id,
  });
  const baseNativeTokenBalance = useBaseNativeTokenBalance();
  const tokenBalance = useTokenBalance(token);

  const networkFee = useNetworkFee();

  const hasInsufficientBalance = useHasInsufficientBalance();
  const hasInsufficientGas = (() => {
    if (
      !networkFee.data ||
      !fromEthBalance.data ||
      !isRouteQuote(route.data?.result)
    )
      return false;

    let availableGasBalance =
      fromEthBalance.data.value -
      BigInt(route.data.result.initiatingTransaction.value);

    return availableGasBalance < BigInt(networkFee.data.token.raw);
  })();

  const requiredCustomGasTokenBalance = useRequiredCustomGasTokenBalance();
  /**
   * Transferring native gas token to rollup, need to make sure wei + extraAmount is < balance
   * Transferring token to rollup, need to make sure extraAmount < balance
   */
  const hasInsufficientBaseNativeTokenBalance =
    !!requiredCustomGasTokenBalance &&
    typeof baseNativeTokenBalance.data !== "undefined" &&
    requiredCustomGasTokenBalance > baseNativeTokenBalance.data;

  const handleSubmitClick = () => {
    if (weiAmount === BigInt(0)) {
      return;
    }

    setConfirmationModal(true);
  };

  const submitButton = match({
    withdrawing,
    isAcross,
    paused,
    isSubmitting: bridge.isLoading,
    account: account.address,
    hasInsufficientBalance,
    hasInsufficientGas,
    hasInsufficientBaseNativeTokenBalance,
    recipient,
    weiAmount,
    bridgeMax,
    bridgeMin,
    disabled,
    routeLoading: route.isLoading,
    validRoute: route.data && isRouteQuote(route.data.result),
    // we allow pulling quotes with no connected wallet, but
    // don't want to allow sending said quote
    zeroRouteAddress:
      (!!routeRequest?.sender &&
        isAddressEqual(routeRequest.sender as Address, deadAddress)) ||
      (!!routeRequest?.sender &&
        isAddressEqual(routeRequest.recipient as Address, deadAddress)),
  })
    .with({ disabled: true }, () => ({
      onSubmit: () => {},
      buttonText: t("buttons.bridgingDisabled"),
      disabled: true,
    }))
    .with({ paused: true }, () => ({
      onSubmit: () => {},
      buttonText: t("buttons.bridgingPaused"),
      disabled: true,
    }))
    .when(
      ({ bridgeMax, weiAmount }) => bridgeMax !== null && weiAmount > bridgeMax,
      ({ bridgeMax }) => ({
        onSubmit: () => {},
        buttonText: (() => {
          const formatted = formatUnits(bridgeMax!, token?.decimals ?? 18);
          return t("bridgeLimit", {
            amount: formatDecimals(parseFloat(formatted)),
            symbol: token?.symbol,
          });
        })(),
        disabled: true,
      })
    )
    .with({ account: undefined }, () => ({
      onSubmit: () => openConnectModal?.(),
      buttonText: t("connectWallet"),
      disabled: false,
    }))
    .with({ recipient: "" }, () => ({
      onSubmit: () => recipientAddressModal.open(),
      buttonText: t("recipient.addRecipientAddress"),
      disabled: false,
    }))
    .with({ weiAmount: BigInt("0") }, () => ({
      onSubmit: () => {},
      buttonText: t("enterAnAmount"),
      disabled: true,
    }))
    .when(
      ({ bridgeMin, weiAmount }) => bridgeMin !== null && weiAmount < bridgeMin,
      ({}) => ({
        onSubmit: () => {},
        buttonText: (() => {
          const formatted = formatUnits(bridgeMin!, token!.decimals);
          return t("bridgeMin", {
            amount: formatDecimals(parseFloat(formatted)),
            symbol: token?.symbol,
          });
        })(),
        disabled: true,
      })
    )
    .with({ hasInsufficientBalance: true }, () => ({
      onSubmit: () => {},
      buttonText: t("insufficientFunds"),
      disabled: true,
    }))
    .with({ hasInsufficientGas: true }, (d) => ({
      onSubmit: handleSubmitClick,
      buttonText: t("insufficientGas", {
        symbol: nativeToken?.symbol,
      }),
      // Let's not disable here because people could actually submit with
      // a lower gas price via their wallet. A little power-usery but important imo
      // temp disable before we ship a better gas estimation flow
      disabled: true,
    }))
    .with({ hasInsufficientBaseNativeTokenBalance: true }, (d) => ({
      onSubmit: handleSubmitClick,
      buttonText: t("insufficientGas", {
        symbol: to?.nativeCurrency.symbol,
      }),
      disabled: true,
    }))
    .with({ isSubmitting: true }, () => ({
      onSubmit: () => {},
      buttonText: t("bridging"),
      disabled: true,
    }))
    .otherwise((d) => ({
      onSubmit: handleSubmitClick,
      buttonText: t("reviewBridge"),
      disabled: d.routeLoading || d.zeroRouteAddress || !d.validRoute,
    }));

  return (
    <Button
      disabled={submitButton.disabled}
      onClick={submitButton.onSubmit}
      className="hover:scale-[1.02]"
    >
      {submitButton.buttonText}
    </Button>
  );
};
