import { DeploymentDto } from "@/codegen/model";
import { Theme } from "@/types/theme";
import {
  arbitrum,
  arbitrumGoerli,
  arbitrumNova,
  arbitrumSepolia,
  baseSepolia,
  kroma,
  optimismSepolia,
  pgn,
  zoraSepolia,
} from "viem/chains";

import bgArbitrum from "../public/img/bg/grains_bottom.png";
import bgPgn from "../public/img/bg/pgn.png";
import bgZora from "../public/img/bg/zora.jpg";
import { dedicatedDeployment } from "./dedicated-deployment";

export const chainIcons: { [chainId: number]: string | undefined } = {
  [1]: "/img/network-ethereum.svg",
  [5]: "/img/network-goerli.svg",
  [11_155_111]: "/img/network-sepolia.svg",
  [arbitrumGoerli.id]: "/img/network-arbitrum-one.svg",
  [arbitrumSepolia.id]: "/img/network-arbitrum-one.svg",
  [17_000]: "/img/network-holesky.png",
  [arbitrum.id]: "/img/network-arbitrum-one.svg",
  [arbitrumNova.id]: "/img/network-arbitrum-nova.svg",
  [57]: "/img/network-syscoin.png",
  570: "/img/network-rollux.svg",
  [788988]: "/img/network-orb3.svg",
  [pgn.id]: "/img/network-pgn.svg",
  [kroma.id]: "/img/network-kroma.svg",
  1024: "/img/network-parallel.svg",
  [zoraSepolia.id]: "/img/network-zora.svg",
  [baseSepolia.id]: "/img/network-base.svg",
  [optimismSepolia.id]: "/img/network-op mainnet.svg",
};

const defaultTheme: Theme = {
  bg: "bg-zinc-50 dark:bg-black/70",
  bgMuted: "bg-zinc-100 dark:bg-white/10",
  border: "border-zinc-100 dark:border-white/10",
  accentBg:
    "bg-zinc-900 hover:bg-zinc-950 dark:bg-zinc-50 dark:hover:bg-zinc-100",
  accentText: "text-zinc-50 dark:text-zinc-900",
  screenBg: "bg-zinc-100 dark:bg-zinc-900 ",
  card: {
    className: "bg-violet-500",
    overlay: {
      className:
        "bg-gradient-to-t from-zinc-950 via-zinc-950/0 to-zinc-950/0 mix-blend-multiply opacity-10",
    },
  },
  screenBgImg:
    "bg-gradient-to-t from-violet-500 via-violet-500/0 to-violet-500/0 mix-blend-lighter opacity-50",
  fill: "fill-zinc-300 dark:fill-white/20",
  textColor: "text-zinc-900 dark:text-zinc-50",
  textColorMuted: "text-zinc-400",
  logoSrc: "/img/icon-placeholder.svg",
  logoSrcDark: "/img/icon-placeholder.svg",
  logoWidth: 42,
  logoHeight: 42,
  iconSrc: "/img/icon-placeholder.svg",
  navIconSrc: "/img/icon.svg",
};

const baseTheme: Theme = {
  ...defaultTheme,
  screenBg: "bg-blue-600 dark:bg-blue-950 ",
  screenBgImg:
    "bg-gradient-to-t from-violet-500 via-violet-500/0 to-violet-500/0 mix-blend-lighter opacity-50 dark:opacity-20",
  logoSrc: "/img/base-logo.svg",
  logoSrcDark: "/img/base-logo.svg",
  logoWidth: 127,
  logoHeight: 32,
  iconSrc: "/img/icon-base.svg",
  navIconSrc: "/img/nav-base.svg",
  l2ChainIcon: "/img/network-base.svg",
  card: {
    className: "bg-blue-600",
  },
};

const optimismTheme: Theme = {
  ...defaultTheme,
  screenBg: "bg-red-500 dark:bg-[#1B1E23] ",
  card: {
    className: "bg-red-500",
    overlay: {
      className:
        "bg-gradient-to-t from-[#EA3431]  to-[#EA3431]/0  mix-blend-multiply opacity-40",
    },
  },
  logoSrc: "/img/optimism-logo.svg",
  logoSrcDark: "/img/optimism-logo.svg",
  logoWidth: 124,
  logoHeight: 24,
  iconSrc: "/img/icon-optimism.svg",
  navIconSrc: "/img/nav-optimism.svg",
  screenBgImg:
    "bg-gradient-to-t from-[#EA3431]  to-[#EA3431]/0  opacity-100 dark:opacity-20 mix-blend-plus-lighter",
  l2ChainIcon: "/img/network-op mainnet.svg",
};

const zoraTheme: Theme = {
  ...defaultTheme,
  screenBg: "bg-[#006FFE] dark:bg-[#0A1B31] ",
  card: {
    className: "bg-[#006FFE]",
    overlay: {
      image: bgZora,
      className: "bg-cover bg-center mix-blend-screen opacity-100",
    },
  },
  logoSrc: "/img/zora-logo.svg",
  logoSrcDark: "/img/zora-logo.svg",
  logoWidth: 42,
  logoHeight: 42,
  iconSrc: "/img/icon-zora.svg",
  navIconSrc: "/img/nav-zora.svg",
  screenBgImg:
    "bg-[url('/img/bg/zora.jpg')] bg-cover bg-center mix-blend-screen opacity-100 dark:opacity-50 mix-blend-plus-lighter",
  l2ChainIcon: "/img/network-zora.svg",
};

const modeTheme: Theme = {
  ...defaultTheme,
  bg: "bg-zinc-50 dark:bg-zinc-900",
  bgMuted: "bg-zinc-200/50 dark:bg-white/5",
  accentBg:
    "bg-zinc-900 hover:bg-zinc-950 dark:bg-[#DFFE00] dark:hover:bg-[3E4FF52]",
  screenBg: "bg-[#DFFE00] dark:bg-black",
  logoSrc: "/img/logo-mode.svg",
  logoSrcDark: "/img/logo-mode-dark.svg",
  logoWidth: 134,
  logoHeight: 40,
  iconSrc: "/img/icon-mode.svg",
  l2ChainIcon: "/img/network-mode.svg",
  screenBgImg:
    "bg-[url('/img/bg/mode-bg.svg')] bg-repeat opacity-15 dark:opacity-35",
  card: {
    className: "bg-zinc-950",
  },
  standaloneLogo: "/img/logo-mode.svg",
  standaloneLogoDark: "/img/logo-mode-dark.svg",
};

const aevoTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-zinc-950",
  },
  iconSrc: "/img/icon-aevo.svg",
  logoSrc: "/img/icon-aevo.svg",
  logoSrcDark: "/img/icon-aevo.svg",
  logoWidth: 97,
  logoHeight: 32,
};

const lyraTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-[#26FAB0]",
  },
  iconSrc: "/img/icon-lyra.svg",
  screenBg: "bg-[#26FAB0] dark:bg-[#0B1820]",
  logoSrc: "/img/logo-lyra.svg",
  logoSrcDark: "/img/logo-lyra-dark.svg",
  logoWidth: 40,
  logoHeight: 40,
  l2ChainIcon: "/img/network-lyra.svg",
  standaloneLogo: "/img/logo-lyra.svg",
  standaloneLogoDark: "/img/logo-lyra-dark.svg",
  screenBgImg:
    "bg-gradient-to-t from-violet-500 via-violet-500/0 to-violet-500/0 mix-blend-multiply opacity-20",
};

const orderlyTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-gradient-to-t from-[#4D00B1] via-[#7C3FCB] to-[#7C3FCB]",
  },
  iconSrc: "/img/icon-orderly.svg",
  screenBg: "bg-[#7C3FCB] dark:bg-[#310F6A]",
  logoSrc: "/img/logo-orderly.svg",
  logoSrcDark: "/img/logo-orderly-dark.svg",
  logoWidth: 40,
  logoHeight: 40,
  l2ChainIcon: "/img/network-orderly.svg",
  standaloneLogo: "/img/standalone-logo-orderly.svg",
  standaloneLogoDark: "/img/standalone-logo-orderly.svg",
  screenBgImg:
    "bg-gradient-to-t from-violet-500 via-violet-500/0 to-violet-500/0 mix-blend-multiply opacity-60 dark:opacity-100",
};

const ancient8Theme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-[#293019]",
  },
  iconSrc: "/img/icon-ancient8.svg",
};

const pgnTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-[#3CE046]",
    overlay: {
      className: "bg-cover bg-center opacity-70",
      image: bgPgn,
    },
  },
  screenBg: "bg-[#4BF155] dark:bg-zinc-950 ",
  iconSrc: "/img/icon-pgn.svg",
  logoSrc: "/img/icon-pgn.svg",
  logoSrcDark: "/img/icon-pgn.svg",
  logoWidth: 32,
  logoHeight: 32,
  screenBgImg:
    "bg-[url('/img/bg/pgn.png')] bg-cover bg-center  opacity-10  mix-blend-plus-lighter",
  l2ChainIcon: "/img/network-pgn.svg",
};

const uniswapTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-[#EB79F7]",
  },
  screenBg: "bg-[#EB79F7] dark:bg-[#2E1D30] ",
  screenBgImg:
    "bg-gradient-to-t from-violet-500 via-violet-500/0 to-violet-500/0 mix-blend-lighter opacity-60 dark:opacity-20",
  logoSrc: "/img/uniswap-logo.svg",
  logoSrcDark: "/img/uniswap-logo.svg",
  logoWidth: 42,
  logoHeight: 42,
  iconSrc: "/img/uniswap-icon.svg",
  l2ChainIcon: "/img/uniswap-icon.svg",
};

const kromaTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-[#72DE2F]",
    overlay: {
      className:
        "bg-gradient-to-t from-teal-950 via-teal-950/0 to-teal-950/0 mix-blend-hard-light opacity-30",
    },
  },
  screenBg: "bg-[#72DE2F] dark:bg-[#2E3345]",
  logoSrc: "/img/kroma-logo.svg",
  logoSrcDark: "/img/kroma-logo.svg",
  logoWidth: 42,
  logoHeight: 42,
  iconSrc: "/img/kroma-icon.svg",
  screenBgImg:
    "bg-gradient-to-t from-teal-500 via-teal-500/0 to-teal-500/0 mix-blend-hard-light opacity-20 dark:opacity-10 mix-blend-plus-lighter",
  l2ChainIcon: "/img/network-kroma.svg",
};

const arbitrumOneTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-[#1C4ADD]",
    overlay: {
      image: bgArbitrum,
      className: "bg-cover bg-center mix-blend-overlay opacity-50",
    },
  },
  screenBg: "bg-[#1C4ADD] dark:bg-[#213147]",
  logoSrc: "/img/arbitrum-one-logo.svg",
  logoSrcDark: "/img/arbitrum-one-logo.svg",
  logoWidth: 42,
  logoHeight: 42,
  iconSrc: "/img/arbitrum-one-icon.svg",
  screenBgImg:
    "bg-[url('/img/bg/grains_ellipse.png')] bg-cover bg-center mix-blend-overlay opacity-20 mix-blend-plus-lighter",
  l2ChainIcon: "/img/network-arbitrum one.svg",
};

const arbitrumNovaTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-[#E57410]",
    overlay: {
      className: "bg-cover bg-center mix-blend-overlay opacity-30",
      image: bgArbitrum,
    },
  },
  screenBg: "bg-[#E57410] dark:bg-[#213147]",
  logoSrc: "/img/arbitrum-nova-logo.svg",
  logoSrcDark: "/img/arbitrum-nova-logo.svg",
  logoWidth: 42,
  logoHeight: 42,
  iconSrc: "/img/arbitrum-nova-icon.svg",
  screenBgImg:
    "bg-[url('/img/bg/grains_ellipse.png')] bg-cover bg-center mix-blend-overlay opacity-20 mix-blend-plus-lighter",
  l2ChainIcon: "/img/network-arbitrum-nova.svg",
};

const frameTheme: Theme = {
  ...defaultTheme,
  bg: "bg-zinc-50 dark:bg-black/80",
  card: {
    className: "bg-gradient-to-t from-[#FE7822] to-[#FCB72A]",
  },
  screenBg: "bg-[#F9F9F9] dark:bg-gradient-to-t from-[#FE7822] to-[#FCB72A]",
  logoSrc: "/img/frame-logo.svg",
  logoSrcDark: "/img/frame-logo.svg",
  logoWidth: 120,
  logoHeight: 32,
  iconSrc: "/img/frame-icon.svg",
  screenBgImg:
    "bg-[url('/img/bg/frame.png')] bg-cover bg-center dark:opacity-50 ",
  l2ChainIcon: "/img/network-frame-testnet.svg",
};

const apeTheme: Theme = {
  ...defaultTheme,
  bg: "bg-zinc-50 dark:bg-black/80",
  card: {
    className: "bg-[#0250E8]",
  },
  screenBg: "bg-[#0250E8] dark:bg-[#0B1D40]",
  logoSrc: "/img/logo-apechain.svg",
  logoSrcDark: "/img/logo-apechain.svg",
  logoWidth: 120,
  logoHeight: 20,
  iconSrc: "/img/icon-apechain.svg",
  screenBgImg:
    "bg-[url('/img/bg/ape-bg.png')] bg-cover bg-center mix-blend-overlay opacity-[0.06] mix-blend-plus-lighter",
  l2ChainIcon: "/img/l2-apechain.png",
};

const rollux: Theme = {
  ...defaultTheme,
  screenBg: "bg-[#DBEF88] dark:bg-[#A3A883]",
  screenBgImg:
    "bg-gradient-to-b from-white/0 to-[#EACF5E]  opacity-70 dark:opacity-10 ",
  logoSrc: "/img/network-rollux.svg",
  logoSrcDark: "/img/network-rollux.svg",
  logoWidth: 42,
  logoHeight: 42,
  iconSrc: "/img/network-rollux.svg",
  l1ChainIcon: "/img/network-syscoin.png",
  l2ChainIcon: "/img/network-rollux.svg",
  card: {
    className: "bg-[#DBEF88]",
    overlay: {
      className:
        "bg-gradient-to-b from-[#DBEF88] via-[#DBEF88]  to-[#EACF5E]  opacity-100",
    },
  },
};

const lattice: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-[#F34242]",
  },
  screenBg: "bg-[#F34242]",
};

const orb3: Theme = {
  ...defaultTheme,
  screenBg: "bg-[#FF0000] dark:bg-zinc-900",
  logoSrc: "/img/logo-orb3-light.svg",
  logoSrcDark: "/img/logo-orb3-dark.svg",
  logoWidth: 123,
  logoHeight: 32,
  iconSrc: "/img/icon-orb3-mainnet.svg",
  l2ChainIcon: "/img/network-orb3.svg",
  screenBgImg: "bg-transparent",
  card: {
    className: "bg-zinc-950",
  },
  standaloneLogo: "/img/logo-orb3-whitelabel-light.svg",
  standaloneLogoDark: "/img/logo-orb3-whitelabel-dark.svg",
};

const parallel: Theme = {
  ...defaultTheme,
  screenBg: "bg-zinc-50 dark:bg-zinc-950",
  logoSrc: "/img/logo-parallel.svg",
  logoSrcDark: "/img/logo-parallel-dark.svg",
  logoWidth: 137,
  logoHeight: 28,
  iconSrc: "/img/icon-parallel.svg",
  l2ChainIcon: "/img/network-parallel.svg",
  screenBgImg:
    "bg-[url('/img/bg/parallel-light.jpg')] dark:bg-[url('/img/bg/parallel-dark.jpg')] bg-cover bg-center ",
  card: {
    className: "bg-black",
  },
  standaloneLogo: "/img/logo-parallel.svg",
  standaloneLogoDark: "/img/logo-parallel-dark.svg",
};

const hypr: Theme = {
  ...defaultTheme,
  bg: "bg-zinc-50 dark:bg-zinc-900",
  screenBg: "bg-[#BE3145] dark:bg-black",
  screenBgImg: "bg-transparent",
  logoSrc: "/img/logo-hypr.svg",
  logoSrcDark: "/img/logo-hypr-dark.svg",
  logoWidth: 108,
  logoHeight: 32,
  iconSrc: "/img/icon-hypr.svg",
  l2ChainIcon: "/img/network-hypr.svg",
  card: {
    className: "bg-[#BE3145]",
  },
  standaloneLogo: "/img/logo-standalone-hypr.svg",
  standaloneLogoDark: "/img/logo-standalone-hypr.svg",
};

const liskTheme: Theme = {
  ...defaultTheme,
  bg: "bg-zinc-50 dark:bg-zinc-900",
  bgMuted: "bg-zinc-200/50 dark:bg-white/5",
  screenBg: "bg-[#4070F4] dark:bg-[#17213C]",
  screenBgImg:
    "bg-gradient-to-t from-violet-500 via-violet-500/0 to-violet-500/0 mix-blend-lighter opacity-20",
  logoSrc: "/img/logo-lisk.svg",
  logoSrcDark: "/img/logo-lisk.svg",
  logoWidth: 102,
  logoHeight: 40,
  iconSrc: "/img/icon-lisk.svg",
  l2ChainIcon: "/img/network-lisk.png",
  card: {
    className: "bg-gradient-to-b from-[#4070F4] to-[#295CE9] ",
  },
  standaloneLogo: "/img/logo-standalone-lisk.svg",
  standaloneLogoDark: "/img/logo-standalone-lisk.svg",
};

export const themes: { [name: string]: Theme | undefined } = {
  ["base"]: baseTheme,
  ["base-sepolia"]: baseTheme,
  ["optimism"]: optimismTheme,
  ["optimism-testnet"]: optimismTheme,
  ["op-sepolia"]: optimismTheme,
  ["arbitrum-goerli"]: arbitrumOneTheme,
  ["arbitrum-one"]: arbitrumOneTheme,
  ["arbitrum-nova"]: arbitrumNovaTheme,
  ["frame-testnet"]: frameTheme,
  ["frame"]: frameTheme,
  ["zora"]: zoraTheme,
  ["zora-sepolia-0thyhxtf5e"]: zoraTheme,
  ["aevo"]: aevoTheme,
  ["kroma"]: kromaTheme,
  pgn: pgnTheme,
  "pgn-sepolia-i4td3ji6i0": pgnTheme,
  mode: modeTheme,
  "mode-sepolia-vtnhnpim72": modeTheme,
  lyra: lyraTheme,
  orderly: orderlyTheme,
  "orderly-l2-4460-sepolia-8tc3sd7dvy": orderlyTheme,
  ancient8: ancient8Theme,
  ["uniswap-v4-hook-sandbox-6tl5qq8i4d"]: uniswapTheme,
  ["apechain-test-qbuapbatak"]: apeTheme,
  rollux,
  ["lattice-testnet"]: lattice,
  ["orb3-mainnet"]: orb3,
  parallel,
  ["parallel-chain-oqwzakghzt"]: parallel,
  ["lisk-sepolia"]: liskTheme,
};

export const deploymentTheme = (
  deployment: Pick<DeploymentDto, "name"> | null
) =>
  themes[dedicatedDeployment?.name ?? deployment?.name ?? ""] ?? defaultTheme;
