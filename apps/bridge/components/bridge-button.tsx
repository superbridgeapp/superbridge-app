import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useBalance } from "wagmi";

import { useIsAcrossRoute } from "@/hooks/across/use-is-across-route";
import { useBridge } from "@/hooks/bridge/use-bridge";
import { useBridgeDisabled } from "@/hooks/bridge/use-bridge-disabled";
import { useBridgeMax } from "@/hooks/bridge/use-bridge-max";
import { useBridgeMin } from "@/hooks/bridge/use-bridge-min";
import { useBridgePaused } from "@/hooks/bridge/use-bridge-paused";
import { useCancelBridge } from "@/hooks/bridge/use-cancel-bridge";
import { useDismissAlert } from "@/hooks/bridge/use-dismiss-alert";
import { useInitiateBridge } from "@/hooks/bridge/use-initiate-bridge";
import { useTokenBalance } from "@/hooks/use-balances";
import { useBaseNativeTokenBalance } from "@/hooks/use-base-native-token-balance";
import { useChain, useFromChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { useInitiatingChainId } from "@/hooks/use-initiating-chain-id";
import { useNativeToken } from "@/hooks/use-native-token";
import { useNetworkFee } from "@/hooks/use-network-fee";
import { useRequiredCustomGasTokenBalance } from "@/hooks/use-required-custom-gas-token-balance";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useIsWithdrawal } from "@/hooks/use-withdrawing";
import { useConfigState } from "@/state/config";
import { formatDecimals } from "@/utils/format-decimals";
import { isEth } from "@/utils/is-eth";

import { Button } from "./ui/button";

export const BridgeButton = () => {
  const { openConnectModal } = useConnectModal();
  const account = useAccount();
  const from = useFromChain();
  const bridge = useBridge();
  const weiAmount = useWeiAmount();
  const token = useSelectedToken();
  const { t } = useTranslation();

  const deployment = useDeployment();
  const setConfirmationModal = useConfigState.useSetDisplayConfirmationModal();
  const withdrawing = useIsWithdrawal();
  const isAcross = useIsAcrossRoute();
  const nft = useConfigState.useNft();
  const recipient = useConfigState.useRecipientAddress();
  const nativeToken = useNativeToken();
  const bridgeMax = useBridgeMax();
  const bridgeMin = useBridgeMin();
  const paused = useBridgePaused();
  const disabled = useBridgeDisabled();

  const initiateBridge = useInitiateBridge(bridge);

  const initiatingChainId = useInitiatingChainId();
  const initiatingChain = useChain(initiatingChainId);
  const fromEthBalance = useBalance({
    address: account.address,
    chainId: initiatingChain?.id,
  });
  const baseNativeTokenBalance = useBaseNativeTokenBalance();
  const tokenBalance = useTokenBalance(token);

  const networkFee = useNetworkFee();

  const hasInsufficientBalance = weiAmount > tokenBalance;
  const hasInsufficientGas = (() => {
    if (!networkFee.data) return false;

    let availableGasBalance = fromEthBalance.data?.value ?? BigInt(0);
    if (isEth(token)) {
      availableGasBalance = availableGasBalance - weiAmount;
    }

    return (
      availableGasBalance <
      BigInt(parseUnits(networkFee.data.token.raw.toFixed(18), 18))
    );
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

  const onDismissAlert = useDismissAlert(initiateBridge);
  const onCancel = useCancelBridge();

  const handleSubmitClick = () => {
    if (!nft && weiAmount === BigInt(0)) {
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
    nft,
    recipient,
    weiAmount,
    bridgeMax,
    bridgeMin,
    disabled,
  })
    .with({ disabled: true }, () => ({
      onSubmit: () => {},
      buttonText: "Bridging disabled",
      disabled: true,
    }))
    .with({ paused: true }, () => ({
      onSubmit: () => {},
      buttonText: "Bridging paused",
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
    .with({ recipient: "" }, ({ withdrawing }) => ({
      onSubmit: () => {},
      buttonText: withdrawing ? t("withdraw") : t("deposit"),
      disabled: true,
    }))
    .with({ weiAmount: BigInt("0") }, () => ({
      onSubmit: () => {},
      buttonText: t("enterAnAmount"),
      disabled: true,
    }))
    .with({ hasInsufficientBalance: true }, () => ({
      onSubmit: () => {},
      buttonText: t("insufficientFunds"),
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
    .with({ hasInsufficientGas: true }, (d) => ({
      onSubmit: handleSubmitClick,
      buttonText: t("insufficientGas", {
        symbol: nativeToken?.[from?.id ?? 0]?.symbol,
      }),
      // Let's not disable here because people could actually submit with
      // a lower gas price via their wallet. A little power-usery but important imo
      disabled: false,
    }))
    .with({ hasInsufficientBaseNativeTokenBalance: true }, (d) => ({
      onSubmit: handleSubmitClick,
      buttonText: t("insufficientGas", {
        symbol: deployment?.arbitrumNativeToken?.symbol,
      }),
      disabled: true,
    }))
    .with({ isSubmitting: true }, (d) => ({
      onSubmit: () => {},
      buttonText: d.withdrawing ? t("withdrawing") : t("depositing"),
      disabled: true,
    }))
    .otherwise(() => ({
      onSubmit: handleSubmitClick,
      buttonText: t("reviewBridge"),
      disabled: false,
    }));

  return (
    <Button disabled={submitButton.disabled} onClick={submitButton.onSubmit}>
      {submitButton.buttonText}
    </Button>
  );
};
