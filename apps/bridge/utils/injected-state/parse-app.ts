import { BridgeConfigDto } from "@/codegen/model";
import { frontendApps } from "@/config/apps";
import { AppConfig } from "@/types/app-config";

export const parseApp = ({
  dto,
  host,
}: {
  dto: BridgeConfigDto | null;
  host: string;
  url: string;
}): AppConfig => {
  let app: AppConfig;

  if (frontendApps[host]) {
    app = frontendApps[host];
  } else {
    const deployment = dto?.deployments[0];
    // rollie
    app = {
      head: {
        name: `${deployment?.l2.name} Bridge`,
        description: `Bridge ${deployment?.l2.nativeCurrency.symbol} and ERC20 tokens into and out of ${deployment?.l2.name}`,
        favicon:
          deployment?.theme?.theme.imageLogo ??
          "https://superbridge.app/img/superbridge-icon.png",
        og:
          deployment?.theme?.theme.imageOg ??
          "https://raw.githubusercontent.com/superbridgeapp/assets/main/rollies/og-rollies.png",
      },
      theme: deployment?.theme?.theme ?? {},
      images: {
        // todo: figure this out
        logoDark: "",
        logoDarkSmall: "",
        logoLight: "",
        logoLightSmall: "",
      },
      links: deployment?.theme?.links ?? [],
      metadata: {},
    };
  }

  return app;
};
