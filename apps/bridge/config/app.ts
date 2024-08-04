import { ThemeDto } from "@/codegen/model";

import { host } from "./host";
import { renzoTheme, superbridgeTheme } from "./themes";

export const isSuperbridge =
  process.env["NEXT_PUBLIC_APP_NAME"] === "superbridge";

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

const hyperlane: AppConfig = {
  head: {
    name: "Hyperlane",
    description: "Bridge tokens between supported Hyperlane chains",
    og: "https://superbridge.app/og/superbridge-og-image.png",
    favicon: "/img/superbridge/favicon-32x32.png",
  },
  images: {
    logoLight: "/img/hyperlane/logo.jpg",
    logoDark: "/img/hyperlane/logo.jpg",
    logoLightSmall: "/img/hyperlane/logo.jpg",
    logoDarkSmall: "/img/hyperlane/logo.jpg",
  },
  theme: renzoTheme,
};

const apps: { [x: string]: AppConfig | undefined } = {
  ["superbridge.app"]: superbidge,
  ["testnets.superbridge.app"]: superbidge,
  ["renzo.superbridge.app"]: renzo,
  ["hyperlane.superbridge.app"]: hyperlane,
};

export const app = apps[host] ?? null;
