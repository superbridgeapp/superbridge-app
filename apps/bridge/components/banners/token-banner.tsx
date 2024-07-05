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
    <button className="flex items-center" onClick={onClick}>
      <Image
        height={24}
        width={24}
        src={"https://ethereum-optimism.github.io/data/wstETH/logo.svg"}
        alt="bridge-wsteth"
      />
      <span>Bridge wstETH</span>
    </button>
  );
}
