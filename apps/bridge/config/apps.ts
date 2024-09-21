import { AppConfig } from "@/types/app-config";

import {
  SUPERBRIDGE_HOST,
  SUPERBRIDGE_TESTNET_HOST,
  V3_SUPERBRIDGE_HOST,
} from "../constants/hosts";
import {
  cbethTheme,
  elixirTheme,
  hyperlaneTheme,
  moltenTheme,
  renzoTheme,
  superbridgeTheme,
  usdcTheme,
  wbtcTheme,
  worldchainTheme,
} from "./themes";

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

  links: [],

  metadata: {
    gId: "G-GVCWE7KL11", // v3
  },
};

const renzo: AppConfig = {
  head: {
    name: "ezETH Bridge",
    description: "Bridge ezETH between Base, Blast, Ethereum and more",
    og: "https://v3.superbridge.app/img/renzo/og.png",
    favicon: "/img/superbridge/favicon-32x32.png",
  },
  images: {
    logoLight: "/img/renzo/logo.svg",
    logoDark: "/img/renzo/logo.svg",
    logoLightSmall: "/img/renzo/logo.svg",
    logoDarkSmall: "/img/renzo/logo.svg",
  },
  theme: renzoTheme,

  links: [],

  metadata: {
    gId: "G-T6VPED3THL",
  },
};

const cbeth: AppConfig = {
  head: {
    name: "cbBTC Bridge",
    description: "Bridge cbBTC between Base, Ethereum and more",
    og: "https://v3.superbridge.app/img/cbBTC/og.png",
    favicon: "/img/superbridge/favicon-32x32.png",
  },
  images: {
    logoLight: "/img/cbeth/logo.svg",
    logoDark: "/img/cbeth/logo.svg",
    logoLightSmall: "/img/cbeth/logo.svg",
    logoDarkSmall: "/img/cbeth/logo.svg",
  },
  theme: cbethTheme,

  links: [],

  metadata: {},
};

const hyperlane: AppConfig = {
  head: {
    name: "Hyperlane Bridge",
    description: "Bridge tokens between supported Hyperlane chains",
    og: "https://v3.superbridge.app/img/hyperlane/og.png",
    favicon: "/img/superbridge/favicon-32x32.png",
  },
  images: {
    logoLight: "/img/hyperlane/logo.svg",
    logoDark: "/img/hyperlane/logo.svg",
    logoLightSmall: "/img/hyperlane/logo.svg",
    logoDarkSmall: "/img/hyperlane/logo.svg",
  },
  theme: hyperlaneTheme,

  links: [],

  metadata: {
    gId: "G-0W40FTXFP4",
  },
};

const usdc: AppConfig = {
  head: {
    name: "USDC Bridge",
    description: "Bridge USDC between supported chains",
    og: "https://v3.superbridge.app/img/usdc/og.png",
    favicon: "/img/superbridge/favicon-32x32.png",
  },
  images: {
    logoLight: "/img/usdc/logo.svg",
    logoDark: "/img/usdc/logo.svg",
    logoLightSmall: "/img/usdc/logo.svg",
    logoDarkSmall: "/img/usdc/logo.svg",
  },
  theme: usdcTheme,

  links: [],

  metadata: {
    gId: "G-3GT9P7XJH7",
  },
};

const elixir: AppConfig = {
  head: {
    name: "deUSD Bridge",
    description: "Bridge deUSD between supported chains",
    og: "https://v3.superbridge.app/img/elixir/og.png",
    favicon: "/img/superbridge/favicon-32x32.png",
  },
  images: {
    logoLight: "/img/elixir/logo.svg",
    logoDark: "/img/elixir/logo.svg",
    logoLightSmall: "/img/elixir/logo.svg",
    logoDarkSmall: "/img/elixir/logo.svg",
  },
  theme: elixirTheme,

  links: [],

  metadata: {
    // gId: ""
  },
};

const wbtc: AppConfig = {
  head: {
    name: "WBTC Bridge",
    description: "Bridge WBTC between supported chains",
    og: "https://v3.superbridge.app/img/wbtc/og.png",
    favicon: "/img/superbridge/favicon-32x32.png",
  },
  images: {
    logoLight: "/img/wbtc/logo.svg",
    logoDark: "/img/wbtc/logo.svg",
    logoLightSmall: "/img/wbtc/logo.svg",
    logoDarkSmall: "/img/wbtc/logo.svg",
  },
  theme: wbtcTheme,

  links: [],

  metadata: {},
};

const molten: AppConfig = {
  head: {
    name: "Molten Bridge",
    description: "Bridge assets between supported chains",
    og: "https://v3.superbridge.app/img/molten/og.png",
    favicon: "/img/superbridge/favicon-32x32.png",
  },
  images: {
    logoLight: "/img/molten/logo.svg",
    logoDark: "/img/molten/logo.svg",
    logoLightSmall: "/img/molten/logo.svg",
    logoDarkSmall: "/img/molten/logo.svg",
  },
  theme: moltenTheme,

  links: [],

  metadata: {},
};

const worldchain: AppConfig = {
  head: {
    name: "Worldchain Bridge",
    description: "Bridge assets between supported chains",
    og: "https://v3.superbridge.app/img/worldchain-mainnet/og.png",
    favicon: "/img/superbridge/favicon-32x32.png",
  },
  images: {
    logoLight: "/img/worldchain-mainnet/logo-light.svg",
    logoDark: "/img/worldchain-mainnet/logo-dark.svg",
    logoLightSmall: "/img/worldchain-mainnet/logo-light.svg",
    logoDarkSmall: "/img/worldchain-mainnet/logo-dark.svg",
  },
  theme: worldchainTheme,

  links: [],

  metadata: {},
};

export const frontendApps: { [x: string]: AppConfig | undefined } = {
  [SUPERBRIDGE_HOST]: superbidge,
  [SUPERBRIDGE_TESTNET_HOST]: superbidge,
  [V3_SUPERBRIDGE_HOST]: superbidge,
  ["usdc.superbridge.app"]: usdc,
  ["usdc-bridge.com"]: usdc,
  ["renzo.superbridge.app"]: renzo,
  ["renzo-bridge.com"]: renzo,
  ["hyperlane.superbridge.app"]: hyperlane,
  ["elixir.superbridge.app"]: elixir,
  ["wbtc.superbridge.app"]: wbtc,
  ["molten.superbridge.app"]: molten,
  ["cbbtc-demo.superbridge.app"]: cbeth,
  ["wld.superbridge.app"]: worldchain,
};
