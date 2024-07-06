import Image from "next/image";

import { bridgeControllerGetDeployments } from "@/codegen/index";
import { SUPERCHAIN_MAINNETS } from "@/constants/superbridge";
import { useDeployment } from "@/hooks/use-deployment";
import { useDeployments } from "@/hooks/use-deployments";
import { useNavigate } from "@/hooks/use-navigate";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";
import { trackEvent } from "@/services/ga";

export function TokenBanner() {
  const setToken = useConfigState.useSetToken();
  const deployment = useDeployment();
  const deployments = useDeployments();
  const navigate = useNavigate();
  const setDeployments = useInjectedStore((store) => store.setDeployments);

  const onClick = async () => {
    trackEvent({ event: "token-banner-click", symbol: "wstETH" });

    if (deployment?.name === "optimism" || deployment?.name === "base") {
      const token = useConfigState
        .getState()
        .tokens.find((x) => x[1]?.symbol === "wstETH");
      if (token) {
        setToken(token);
      }
      return;
    }

    let base = deployments.deployments.find((x) => x.name === "base");
    if (!base) {
      const mainnets = await bridgeControllerGetDeployments({
        names: SUPERCHAIN_MAINNETS,
      });
      setDeployments(mainnets.data);
      base = mainnets.data.find((x) => x.name === "base")!;
    }

    navigate(base);
    setTimeout(() => {
      const token = useConfigState
        .getState()
        .tokens.find((x) => x[1]?.symbol === "wstETH");
      if (token) {
        setToken(token);
      }
    }, 500);
  };

  return (
    <div className="absolute left-1/2 top-20 md:top-7 -translate-x-1/2 -translate-y-1.5 md:translate-y-0.5">
      <button
        className="relative overflow-hidden backdrop-blur-xs flex items-center gap-1 rounded-full p-1 pr-3 shadow-xs transition-all hover:scale-105"
        onClick={onClick}
      >
        <div className="bg-card opacity-40 dark:opacity-70 absolute inset-0 -z-10" />
        <Image
          height={0}
          width={0}
          sizes="100vw"
          src={"https://ethereum-optimism.github.io/data/wstETH/logo.svg"}
          alt="Bridge wstETH"
          className="rounded-full w-5 h-5 md:w-6 md:h-6"
        />
        <div className="flex gap-1.5 items-baseline">
          <span className="text-xs font-heading tracking-tight">
            Bridge wstETH
          </span>
          <span className="text-[8px] font-heading tracking-tight opacity-40">
            Ad
          </span>
        </div>
      </button>
    </div>
  );
}
