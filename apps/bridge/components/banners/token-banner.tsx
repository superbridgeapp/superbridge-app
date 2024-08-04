import { useDeployments } from "@/hooks/deployments/use-deployments";
import { useSetToken } from "@/hooks/tokens/use-set-token";
import { trackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";

export function TokenBanner() {
  const setToken = useSetToken();
  const deployments = useDeployments();
  const superbridgeConfig = useInjectedStore(
    (store) => store.superbridgeConfig
  );
  const setFromChainId = useInjectedStore((store) => store.setFromChainId);
  const setToChainId = useInjectedStore((store) => store.setToChainId);

  const onClick = async () => {
    const { deploymentName, symbol } = superbridgeConfig!.banner!;
    const deployment = deployments.find((x) => x.name === deploymentName);
    if (!deployment) {
      return;
    }

    trackEvent({ event: "token-banner-click", symbol });

    setFromChainId(deployment.l1ChainId);
    setToChainId(deployment.l2ChainId);

    setTimeout(() => {
      const token = useConfigState
        .getState()
        .tokens.find((x) => x[1]?.symbol === symbol);
      if (token) {
        const l1 = token[deployment.l1ChainId];
        const l2 = token[deployment.l2ChainId];
        if (l1 && l2) {
          setToken(l1, l2);
        }
      }
    }, 500);
  };

  if (!superbridgeConfig?.banner) {
    return null;
  }

  return (
    <div className="absolute left-1/2 top-[72px] md:top-7 -translate-x-1/2 -translate-y-1.5 md:translate-y-0.5">
      <button
        className="relative overflow-hidden backdrop-blur-sm flex items-center gap-1 rounded-full p-1 pr-3 drop-shadow transition-all hover:scale-105"
        onClick={onClick}
      >
        <div className="bg-card opacity-50 dark:opacity-70 absolute inset-0 -z-10" />
        <img
          height={0}
          width={0}
          sizes="100vw"
          src={superbridgeConfig.banner.image}
          alt="Bridge wstETH"
          className="rounded-full w-5 h-5 md:w-6 md:h-6"
        />
        <div className="flex gap-1.5 items-baseline">
          <span className="text-xs font-heading tracking-tight">
            Bridge {superbridgeConfig.banner.symbol}
          </span>
          <span className="text-[8px] font-heading tracking-tight opacity-40">
            Ad
          </span>
        </div>
      </button>
    </div>
  );
}
