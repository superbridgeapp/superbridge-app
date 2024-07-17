import Image from "next/image";

import { bridgeControllerGetDeployments } from "@/codegen/index";
import { SUPERCHAIN_MAINNETS } from "@/constants/superbridge";
import { useDeployment } from "@/hooks/use-deployment";
import { useDeployments } from "@/hooks/use-deployments";
import { useNavigate } from "@/hooks/use-navigate";
import { trackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";

export function TokenBanner() {
  const setToken = useConfigState.useSetToken();
  const deployment = useDeployment();
  const deployments = useDeployments();
  const navigate = useNavigate();
  const setDeployments = useInjectedStore((store) => store.setDeployments);
  const superbridgeConfig = useInjectedStore(
    (store) => store.superbridgeConfig
  );

  const onClick = async () => {
    const { deploymentName, symbol } = superbridgeConfig!.banner!;

    trackEvent({ event: "token-banner-click", symbol });

    if (deployment?.name !== deploymentName) {
      let exists = deployments.deployments.find(
        (x) => x.name === deploymentName
      );
      if (!exists) {
        const mainnets = await bridgeControllerGetDeployments({
          names: SUPERCHAIN_MAINNETS,
        });
        setDeployments(mainnets.data);
        exists = mainnets.data.find((x) => x.name === deploymentName)!;
      }
      navigate(exists);

      setTimeout(() => {
        const token = useConfigState
          .getState()
          .tokens.find((x) => x[1]?.symbol === symbol);
        if (token) {
          setToken(token);
        }
      }, 500);
    } else {
      const token = useConfigState
        .getState()
        .tokens.find((x) => x[1]?.symbol === symbol);
      if (token) {
        setToken(token);
      }
    }
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
        <Image
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
