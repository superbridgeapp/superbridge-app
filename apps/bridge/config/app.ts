import { ThemeDto } from "@/codegen/model";

import { renzoTheme, superbridgeTheme } from "./themes";

export const isSuperbridge =
  process.env["NEXT_PUBLIC_APP_NAME"] === "superbridge";
export const isRenzo = process.env["NEXT_PUBLIC_APP_NAME"] === "renzo";

type AppConfig = {
  head: {
    name: string;
    description: string;
    og: string;
    favicon: string;
  };

  theme: Partial<ThemeDto>;

  images: {
    logoLight: string;
    logoLightSmall: string;

    logoDark: string;
    logoDarkSmall: string;
  };
};

const superbidge: AppConfig = {
  head: {
    name: "Superbridge",
    description: "Bridge ETH and ERC20 tokens into and out of the Superchain",
    og: "https://superbridge.app/og/superbridge-og-image.png",
    favicon: "/img/superbridge/favicon-32x32.png",
  },

  images: {
    logoLight: "/img/logo.svg",
    logoDark: "/img/logo-dark.svg",
    logoLightSmall: "/img/logo-small.svg",
    logoDarkSmall: "/img/logo-small-dark.svg",
  },
  theme: superbridgeTheme,
};

const renzo: AppConfig = {
  head: {
    name: "Renzo",
    description: "Bridge ezETH between Base, Blast, Ethereum and more",
    og: "https://superbridge.app/og/superbridge-og-image.png",
    favicon: "/img/superbridge/favicon-32x32.png",
  },

  images: {
    logoLight: "/img/renzo/logo.svg",
    logoDark: "/img/renzo/logo.svg",
    logoLightSmall: "/img/renzo/logo.svg",
    logoDarkSmall: "/img/renzo/logo.svg",
  },
  theme: renzoTheme,
};

export const app = isSuperbridge ? superbidge : isRenzo ? renzo : null;
