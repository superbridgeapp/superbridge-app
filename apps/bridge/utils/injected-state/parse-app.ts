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
    return frontendApps[host]!;
  }

  if (dto?.theme) {
    return {
      head: {
        name: `Bridge`,
        description: ``,
        favicon:
          dto.theme.imageNetwork ??
          "https://superbridge.app/img/superbridge-icon.png",
        og:
          dto.theme.imageOg ??
          "https://raw.githubusercontent.com/superbridgeapp/assets/main/rollies/og-rollies.png",
      },
      theme: dto.theme ?? {},
      images: {
        logoDark: dto.theme.imageLogoDark ?? "",
        logoDarkSmall: dto.theme.imageLogoDark ?? "",
        logoLight: dto.theme.imageLogo ?? "",
        logoLightSmall: dto.theme.imageLogo ?? "",
      },
      links: [],
      metadata: {},
    };
  }

  if (dto?.deployments[0]) {
    const deployment = dto?.deployments[0];
    // rollie
    app = {
      head: {
        name: `${deployment?.l2.name} Bridge`,
        description: `Bridge ${deployment?.l2.nativeCurrency.symbol} and ERC20 tokens into and out of ${deployment?.l2.name}`,
        favicon:
          deployment?.theme?.theme.imageNetwork ??
          "https://superbridge.app/img/superbridge-icon.png",
        og:
          deployment?.theme?.theme.imageOg ??
          "https://raw.githubusercontent.com/superbridgeapp/assets/main/rollies/og-rollies.png",
      },
      theme: deployment?.theme?.theme ?? {},
      images: {
        logoDark: deployment?.theme?.theme.imageLogoDark ?? "",
        logoDarkSmall: deployment?.theme?.theme.imageLogoDark ?? "",
        logoLight: deployment?.theme?.theme.imageLogo ?? "",
        logoLightSmall: deployment?.theme?.theme.imageLogo ?? "",
      },
      links: deployment?.theme?.links ?? [],
      metadata: {},
    };
  } else {
    app = {
      head: {
        name: `Demo Bridge`,
        description: `Bridge tokens into and out of supported chains`,
        favicon: "https://superbridge.app/img/superbridge-icon.png",
        og: "https://raw.githubusercontent.com/superbridgeapp/assets/main/rollies/og-rollies.png",
      },
      theme: {},
      images: {
        logoDark: "",
        logoDarkSmall: "",
        logoLight: "",
        logoLightSmall: "",
      },
      links: [],
      metadata: {},
    };
  }

  return app;
};
