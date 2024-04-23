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
  base,
  mode,
  optimism,
  zora,
  modeTestnet,
  sepolia,
  mainnet,
  holesky,
  syscoin,
  rollux,
} from "viem/chains";

import { dedicatedDeployment } from "./dedicated-deployment";

export const chainIcons: { [chainId: number]: string | undefined } = {
  [mainnet.id]: "/img/network-ethereum.svg",
  [sepolia.id]: "/img/network-sepolia.svg",
  [holesky.id]: "/img/network-holesky.png",
  [arbitrumSepolia.id]: "/img/arbitrum-one/network.svg",
  [arbitrum.id]: "/img/arbitrum-one/network.svg",
  [arbitrumNova.id]: "/img/arbitrum-nova/network.svg",
  [syscoin.id]: "/img/network-syscoin.png",
  [rollux.id]: "/img/rollux/network.svg",
  [788988]: "/img/orb3-mainnet/network.svg",
  [pgn.id]: "/img/pgn/network.svg",
  [kroma.id]: "/img/kroma/network.svg",
  1024: "/img/parallel/network.svg",
  [mode.id]: "/img/mode/network.svg",
  [modeTestnet.id]: "/img/mode/network.svg",
  [zora.id]: "/img/zora/network.svg",
  [zoraSepolia.id]: "/img/zora/network.svg",
  [base.id]: "/img/base/network.svg",
  [baseSepolia.id]: "/img/base/network.svg",
  [optimism.id]: "/img/optimism/network.svg",
  [optimismSepolia.id]: "/img/optimism/network.svg",
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
  logoSrc: "/img/base/logo.svg",
  logoSrcDark: "/img/base/logo.svg",
  logoWidth: 127,
  logoHeight: 32,
  iconSrc: "/img/base/icon.svg",
  navIconSrc: "/img/base/nav.svg",
  l2ChainIcon: "/img/base/network.svg",
  card: {
    className: "bg-blue-600",
  },
  standaloneLogo: "/img/base/logo-standalone.svg",
  standaloneLogoDark: "/img/base/logo-standalone-dark.svg",
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
  logoSrc: "/img/optimism/logo.svg",
  logoSrcDark: "/img/optimism/logo.svg",
  logoWidth: 124,
  logoHeight: 24,
  iconSrc: "/img/optimism/icon.svg",
  navIconSrc: "/img/optimism/nav.svg",
  screenBgImg:
    "bg-gradient-to-t from-[#EA3431]  to-[#EA3431]/0 opacity-100 dark:opacity-20 mix-blend-plus-lighter",
  l2ChainIcon: "/img/optimism/network.svg",
  standaloneLogo: "/img/optimism/logo-standalone.svg",
  standaloneLogoDark: "/img/optimism/logo-standalone-dark.svg",
};

const zoraTheme: Theme = {
  ...defaultTheme,
  screenBg: "bg-[#006FFE] dark:bg-[#0A1B31] ",
  card: {
    className: "bg-[#006FFE]",
    overlay: {
      image: "/img/zora/bg.jpg",
      className: "bg-cover bg-center mix-blend-screen opacity-100",
    },
  },
  logoSrc: "/img/zora/logo.svg",
  logoSrcDark: "/img/zora/logo.svg",
  logoWidth: 42,
  logoHeight: 42,
  iconSrc: "/img/zora/icon.svg",
  navIconSrc: "/img/zora/nav.svg",
  screenBgImg:
    "bg-[url('/img/zora/bg.jpg')] bg-cover bg-center mix-blend-screen opacity-100 dark:opacity-50 mix-blend-plus-lighter",
  l2ChainIcon: "/img/zora/network.svg",
};

const modeTheme: Theme = {
  ...defaultTheme,
  bg: "bg-zinc-50 dark:bg-zinc-900",
  bgMuted: "bg-zinc-200/50 dark:bg-white/5",
  accentBg:
    "bg-zinc-900 hover:bg-zinc-950 dark:bg-[#DFFE00] dark:hover:bg-[3E4FF52]",
  screenBg: "bg-[#DFFE00] dark:bg-black",
  logoSrc: "/img/mode/logo.svg",
  logoSrcDark: "/img/mode/logo-dark.svg",
  logoWidth: 134,
  logoHeight: 40,
  iconSrc: "/img/mode/icon.svg",
  l2ChainIcon: "/img/mode/network.svg",
  screenBgImg:
    "bg-[url('/img/mode/bg.svg')] bg-repeat opacity-15 dark:opacity-35",
  card: {
    className: "bg-zinc-950",
  },
  standaloneLogo: "/img/mode/logo.svg",
  standaloneLogoDark: "/img/mode/logo-dark.svg",
};

const aevoTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-zinc-950",
  },
  iconSrc: "/img/aevo/icon.svg",
  logoSrc: "/img/aevo/icon.svg",
  logoSrcDark: "/img/aevo/icon.svg",
  logoWidth: 97,
  logoHeight: 32,
};

const lyraTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-[#26FAB0]",
  },
  iconSrc: "/img/lyra/icon.svg",
  screenBg: "bg-[#26FAB0] dark:bg-[#0B1820]",
  logoSrc: "/img/lyra/logo.svg",
  logoSrcDark: "/img/lyra/logo-dark.svg",
  logoWidth: 40,
  logoHeight: 40,
  l2ChainIcon: "/img/lyra/network.svg",
  standaloneLogo: "/img/lyra/logo.svg",
  standaloneLogoDark: "/img/lyra/logo-dark.svg",
  screenBgImg:
    "bg-gradient-to-t from-violet-500 via-violet-500/0 to-violet-500/0 mix-blend-multiply opacity-20",
};

const orderlyTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-gradient-to-t from-[#4D00B1] via-[#7C3FCB] to-[#7C3FCB]",
  },
  iconSrc: "/img/orderly/icon.svg",
  screenBg: "bg-[#7C3FCB] dark:bg-[#310F6A]",
  logoSrc: "/img/orderly/logo.svg",
  logoSrcDark: "/img/orderly/logo-dark.svg",
  logoWidth: 40,
  logoHeight: 40,
  l2ChainIcon: "/img/orderly/network.svg",
  standaloneLogo: "/img/orderly/standalone-logo.svg",
  standaloneLogoDark: "/img/orderly/standalone-logo.svg",
  screenBgImg:
    "bg-gradient-to-t from-violet-500 via-violet-500/0 to-violet-500/0 mix-blend-multiply opacity-60 dark:opacity-100",
};

const ancient8Theme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-[#293019]",
  },
  iconSrc: "/img/ancient8/icon.svg",
};

const pgnTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-[#3CE046]",
    overlay: {
      image: "/img/pgn/bg.png",
      className: "bg-cover bg-center opacity-70",
    },
  },
  screenBg: "bg-[#4BF155] dark:bg-zinc-950 ",
  iconSrc: "/img/pgn/icon.svg",
  logoSrc: "/img/pgn/icon.svg",
  logoSrcDark: "/img/pgn/icon.svg",
  logoWidth: 32,
  logoHeight: 32,
  screenBgImg:
    "bg-[url('/img/pgn/bg.png')] bg-cover bg-center  opacity-10  mix-blend-plus-lighter",
  l2ChainIcon: "/img/pgn/network.svg",
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
  logoSrc: "/img/kroma/logo.svg",
  logoSrcDark: "/img/kroma/logo.svg",
  logoWidth: 42,
  logoHeight: 42,
  iconSrc: "/img/kroma/icon.svg",
  screenBgImg:
    "bg-gradient-to-t from-teal-500 via-teal-500/0 to-teal-500/0 mix-blend-hard-light opacity-20 dark:opacity-10 mix-blend-plus-lighter",
  l2ChainIcon: "/img/kroma/network.svg",
};

const arbitrumOneTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-[#1C4ADD]",
    overlay: {
      image: "/img/arbitrum-one/bg.png",
      className: "bg-cover bg-center mix-blend-overlay opacity-50",
    },
  },

  screenBg: "bg-[#1C4ADD] dark:bg-[#213147]",
  logoSrc: "/img/arbitrum-one/logo.svg",
  logoSrcDark: "/img/arbitrum-one/logo.svg",
  logoWidth: 42,
  logoHeight: 42,
  iconSrc: "/img/arbitrum-one/icon.svg",
  screenBgImg:
    "bg-[url('/img/arbitrum-one/bg.png')] bg-cover bg-center mix-blend-overlay opacity-20 mix-blend-plus-lighter",
  l2ChainIcon: "/img/arbitrum-one/network.svg",
};

const arbitrumNovaTheme: Theme = {
  ...defaultTheme,
  card: {
    className: "bg-[#E57410]",
    overlay: {
      image: "/img/arbitrum-nova/bg.png",
      className: "bg-cover bg-center mix-blend-overlay opacity-30",
    },
  },
  screenBg: "bg-[#E57410] dark:bg-[#213147]",
  logoSrc: "/img/arbitrum-nova/logo.svg",
  logoSrcDark: "/img/arbitrum-nova/logo.svg",
  logoWidth: 42,
  logoHeight: 42,
  iconSrc: "/img/arbitrum-nova/icon.svg",
  screenBgImg:
    "bg-[url('/img/arbitrum-nova/bg.png')] bg-cover bg-center mix-blend-overlay opacity-20 mix-blend-plus-lighter",
  l2ChainIcon: "/img/arbitrum-nova/network.svg",
};

const frameTheme: Theme = {
  ...defaultTheme,
  bg: "bg-zinc-50 dark:bg-black/80",
  card: {
    className: "bg-gradient-to-t from-[#FE7822] to-[#FCB72A]",
  },
  screenBg: "bg-[#F9F9F9] dark:bg-gradient-to-t from-[#FE7822] to-[#FCB72A]",
  logoSrc: "/img/frame/logo.svg",
  logoSrcDark: "/img/frame/logo.svg",
  logoWidth: 120,
  logoHeight: 32,
  iconSrc: "/img/frame/icon.svg",
  screenBgImg:
    "bg-[url('/img/frame/bg.png')] bg-cover bg-center dark:opacity-50 ",
  l2ChainIcon: "/img/frame/network.svg",
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

const rolluxTheme: Theme = {
  ...defaultTheme,
  screenBg: "bg-[#DBEF88] dark:bg-[#A3A883]",
  screenBgImg:
    "bg-gradient-to-b from-white/0 to-[#EACF5E]  opacity-70 dark:opacity-10 ",
  logoSrc: "/img/rollux/network.svg",
  logoSrcDark: "/img/rollux/network.svg",
  logoWidth: 42,
  logoHeight: 42,
  iconSrc: "/img/rollux/network.svg",
  l1ChainIcon: "/img/network-syscoin.png",
  l2ChainIcon: "/img/rollux/network.svg",
  card: {
    className: "bg-[#DBEF88]",
    overlay: {
      className:
        "bg-gradient-to-b from-[#DBEF88] via-[#DBEF88]  to-[#EACF5E]  opacity-100",
    },
  },
};

const redstoneTheme: Theme = {
  ...defaultTheme,
  bg: "bg-white dark:bg-[#1A1A1A]",
  bgMuted: "bg-zinc-100 dark:bg-white/5",
  screenBg: "bg-[#F34242] dark:bg-[#000000]",
  screenBgImg: "bg-tranparent",
  accentBg:
    "bg-[#000000] hover:bg-[#000000] dark:bg-[#ffffff] dark:hover:bg-[#ffffff]",
  accentText: "text-white dark:text-black",
  logoSrc: "/img/redstone-mainnet/logo.svg",
  logoSrcDark: "/img/redstone-mainnet/logo-dark.svg",
  logoWidth: 131,
  logoHeight: 32,
  iconSrc: "/img/redstone-mainnet/icon.svg",
  l2ChainIcon: "/img/redstone-mainnet/network.svg",
  standaloneLogo: "/img/redstone-mainnet/logo-standalone.svg",
  standaloneLogoDark: "/img/redstone-mainnet/logo-standalone-dark.svg",
  card: {
    className: "bg-[#F34242]",
  },
};

const orb3: Theme = {
  ...defaultTheme,
  screenBg: "bg-[#FF0000] dark:bg-zinc-900",
  logoSrc: "/img/orb3-mainnet/logo.svg",
  logoSrcDark: "/img/orb3-mainnet/logo-dark.svg",
  logoWidth: 123,
  logoHeight: 32,
  iconSrc: "/img/orb3-mainnet/icon.svg",
  l2ChainIcon: "/img/orb3-mainnet/network.svg",
  screenBgImg: "bg-transparent",
  card: {
    className: "bg-zinc-950",
  },
  standaloneLogo: "/img/orb3-mainnet/logo-standalone.svg",
  standaloneLogoDark: "/img/orb3-mainnet/logo-standalone-dark.svg",
};

const parallel: Theme = {
  ...defaultTheme,
  screenBg: "bg-zinc-50 dark:bg-zinc-950",
  logoSrc: "/img/parallel/logo.svg",
  logoSrcDark: "/img/parallel/logo-dark.svg",
  logoWidth: 137,
  logoHeight: 28,
  iconSrc: "/img/parallel/icon.svg",
  l2ChainIcon: "/img/parallel/network.svg",
  screenBgImg:
    "bg-[url('/img/parallel/bg.jpg')] dark:bg-[url('/img/parallel/bg-dark.jpg')] bg-cover bg-center",
  card: {
    className: "bg-black",
  },
  standaloneLogo: "/img/parallel/logo.svg",
  standaloneLogoDark: "/img/parallel/logo-dark.svg",
};

const liskTheme: Theme = {
  ...defaultTheme,
  bg: "bg-zinc-50 dark:bg-zinc-900",
  bgMuted: "bg-zinc-200/50 dark:bg-white/5",
  screenBg: "bg-[#4070F4] dark:bg-[#17213C]",
  screenBgImg:
    "bg-gradient-to-t from-violet-500 via-violet-500/0 to-violet-500/0 mix-blend-lighter opacity-20",
  logoSrc: "/img/lisk-mainnet/logo.svg",
  logoSrcDark: "/img/lisk-mainnet/logo.svg",
  logoWidth: 102,
  logoHeight: 40,
  iconSrc: "/img/lisk-mainnet/icon.svg",
  l2ChainIcon: "/img/lisk-mainnet/network.png",
  card: {
    className: "bg-gradient-to-b from-[#4070F4] to-[#295CE9] ",
  },
  standaloneLogo: "/img/lisk-mainnet/logo-standalone.svg",
  standaloneLogoDark: "/img/lisk-mainnet/logo-standalone.svg",
};

const lumioTheme: Theme = {
  ...defaultTheme,
  bg: "bg-zinc-50 dark:bg-black/70",
  bgMuted: "bg-zinc-200/50 dark:bg-white/5",
  screenBg: "bg-[#2F2B54] dark:bg-[#0F0B2D]",
  screenBgImg:
    "bg-gradient-to-t from-[#0F0B2D] dark:bg-[#2F2B54] via-violet-500/0 to-violet-500/0 mix-blend-lighter opacity-20",
  logoSrc: "/img/lumio-mainnet/logo.svg",
  logoSrcDark: "/img/lumio-mainnet/logo-dark.svg",
  logoWidth: 113,
  logoHeight: 40,
  iconSrc: "/img/lumio-mainnet/icon.svg",
  l2ChainIcon: "/img/lumio-mainnet/network.png",
  card: {
    className: "bg-gradient-to-b from-[#2F2B54] to-[#0F0B2D] ",
  },
  standaloneLogo: "/img/lumio-mainnet/logo-dark.svg",
  standaloneLogoDark: "/img/lumio-mainnet/logo-dark.svg",
};

const stackTheme: Theme = {
  ...defaultTheme,
  bg: "bg-white dark:bg-[#1B1E24]",
  bgMuted: "bg-zinc-200/50 dark:bg-white/5",
  screenBg: "bg-[#F5F5F6] dark:bg-[#13151A]",
  screenBgImg: "bg-transparent",
  logoSrc: "/img/stack-mainnet/logo.svg",
  logoSrcDark: "/img/stack-mainnet/logo-dark.svg",
  logoWidth: 83,
  logoHeight: 28,
  iconSrc: "/img/stack-mainnet/icon.svg",
  l2ChainIcon: "/img/stack-mainnet/network.png",
  card: {
    className: "bg-gradient-to-b from-[#13151A] to-[#000000] ",
  },
  standaloneLogo: "/img/stack-mainnet/logo-standalone.svg",
  standaloneLogoDark: "/img/stack-mainnet/logo-standalone-dark.svg",
};

const metalTheme: Theme = {
  ...defaultTheme,
  bg: "bg-white dark:bg-white/5",
  bgMuted: "bg-zinc-100 dark:bg-white/5",
  screenBg: "bg-white dark:bg-[#101010]",
  accentBg:
    "bg-[#172EB6] hover:bg-[#172EB6] dark:bg-zinc-50 dark:hover:bg-zinc-100",
  accentText: "text-white dark:text-zinc-900",
  logoSrc: "/img/metal-mainnet/logo.svg",
  logoSrcDark: "/img/metal-mainnet/logo-dark.svg",
  logoWidth: 122,
  logoHeight: 24,
  iconSrc: "/img/metal-mainnet/icon.svg",
  l2ChainIcon: "/img/metal-mainnet/network.svg",
  screenBgImg:
    "bg-[url('/img/metal-mainnet/bg.jpg')] dark:bg-[url('/img/metal-mainnet/bg-dark.jpg')] bg-cover bg-center",
  standaloneLogo: "/img/metal-mainnet/logo.svg",
  standaloneLogoDark: "/img/metal-mainnet/logo-dark.svg",
  card: {
    className: "bg-white",
    overlay: {
      image: "/img/metal-mainnet/bg-card.jpg",
      className: "bg-cover bg-center opacity-100",
    },
  },
};

const campTheme: Theme = {
  ...defaultTheme,
  bg: "bg-white dark:bg-white/5",
  bgMuted: "bg-zinc-100 dark:bg-white/5",
  screenBg: "bg-[#F4F3F8] dark:bg-[#111111]",
  accentBg:
    "bg-[#FF6D01] hover:bg-[#FF6D01] dark:bg-[#FF6D01] dark:hover:bg-[#FF6D01]",
  accentText: "text-white dark:text-zinc-900",
  logoSrc: "/img/camp-mainnet/logo.svg",
  logoSrcDark: "/img/camp-mainnet/logo-dark.svg",
  logoWidth: 94,
  logoHeight: 24,
  iconSrc: "/img/camp-mainnet/icon.svg",
  l2ChainIcon: "/img/camp-mainnet/network.svg",
  screenBgImg: "bg-transparent",
  standaloneLogo: "/img/camp-mainnet/logo.svg",
  standaloneLogoDark: "/img/camp-mainnet/logo-dark.svg",
  card: {
    className: "bg-[#111111]",
  },
};

const cliqueTheme: Theme = {
  ...defaultTheme,
  bg: "bg-[#ffffff] dark:bg-[#19191F]",
  bgMuted: "bg-[#F4F4F5] dark:bg-[#202028]",
  screenBg: "bg-[#FAFAFA] dark:bg-[#09090B]",
  accentBg:
    "bg-[#1B48BF] hover:bg-[#1B48BF] dark:bg-[#1B48BF] dark:hover:bg-[#1B48BF]",
  accentText: "text-white dark:text-white",
  logoSrc: "/img/clique-mainnet/logo.svg",
  logoSrcDark: "/img/clique-mainnet/logo-dark.svg",
  logoWidth: 93,
  logoHeight: 32,
  iconSrc: "/img/clique-mainnet/icon.svg",
  l2ChainIcon: "/img/clique-mainnet/network.svg",
  screenBgImg: "bg-transparent",
  standaloneLogo: "/img/clique-mainnet/logo.svg",
  standaloneLogoDark: "/img/clique-mainnet/logo-dark.svg",
  card: {
    className: "bg-gradient-to-b from-[#23B2EF] to-[#0049C6] ",
  },
};

const fraxTheme: Theme = {
  ...defaultTheme,
  bg: "bg-white dark:bg-[#161618]",
  bgMuted: "bg-zinc-100 dark:bg-zinc-800",
  screenBg: "bg-[#f0f0f0] dark:bg-[#070707]",
  screenBgImg: "bg-transparent",
  logoSrc: "/img/frax-mainnet/logo.svg",
  logoSrcDark: "/img/frax-mainnet/logo-dark.svg",
  logoWidth: 40,
  logoHeight: 40,
  iconSrc: "/img/frax-mainnet/icon.svg",
  l2ChainIcon: "/img/frax-mainnet/network.svg",
  card: {
    className: "bg-[#070707]",
  },
  standaloneLogo: "/img/frax-mainnet/logo.svg",
  standaloneLogoDark: "/img/frax-mainnet/logo-dark.svg",
};

const ebiTheme: Theme = {
  ...defaultTheme,
  bg: "bg-[#ffffff] dark:bg-[#19191F]",
  bgMuted: "bg-[#F4F4F5] dark:bg-[#202028]",
  screenBg: "bg-[#FF8000]  dark:bg-[#000000]",
  screenBgImg:
    "bg-gradient-to-tr from-[#FF0079] via-[#FF0079]/30 to-[#FF0079]/0 dark:from-[#111111] via-[#000000]/0 dark:to-[#000000]/0",
  accentBg:
    "bg-[#5249C9] hover:bg-[#5249C9] dark:bg-[#5249C9] dark:hover:bg-[#5249C9]",
  accentText: "text-white dark:text-white",
  logoSrc: "/img/ebi-mainnet/logo.svg",
  logoSrcDark: "/img/ebi-mainnet/logo-dark.svg",
  logoWidth: 148,
  logoHeight: 32,
  iconSrc: "/img/ebi-mainnet/icon.svg",
  l2ChainIcon: "/img/ebi-mainnet/network.svg",
  standaloneLogo: "/img/ebi-mainnet/logo.svg",
  standaloneLogoDark: "/img/ebi-mainnet/logo-dark.svg",
  card: {
    className: "bg-gradient-to-b from-[#FF8000] to-[#FF0079]",
  },
};

const mintTheme: Theme = {
  ...defaultTheme,
  bg: "bg-white dark:bg-[#161618]",
  bgMuted: "bg-zinc-100 dark:bg-zinc-800",
  screenBg: "bg-[#f0f0f0] dark:bg-[#070707]",
  screenBgImg: "bg-transparent",
  accentBg:
    "bg-[#30BF54] hover:bg-[#30BF54] dark:bg-[#30BF54] dark:hover:bg-[#30BF54]",
  accentText: "text-white dark:text-white",
  logoSrc: "/img/mint-mainnet/logo.svg",
  logoSrcDark: "/img/mint-mainnet/logo-dark.svg",
  logoWidth: 126,
  logoHeight: 32,
  iconSrc: "/img/mint-mainnet/icon.svg",
  l2ChainIcon: "/img/mint-mainnet/network.svg",
  card: {
    className: "bg-[#30BF54]",
  },
  standaloneLogo: "/img/mint-mainnet/logo.svg",
  standaloneLogoDark: "/img/mint-mainnet/logo-dark.svg",
};

const worldchainTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/worldchain-mainnet/icon.svg",
  card: {
    className: "bg-black",
  },
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
  rollux: rolluxTheme,
  ["redstone-mainnet"]: redstoneTheme,
  ["lattice-testnet"]: redstoneTheme,
  ["orb3-mainnet"]: orb3,
  parallel,
  ["parallel-chain-oqwzakghzt"]: parallel,
  ["surprised-harlequin-bonobo-fvcy2k9oqh"]: parallel,
  ["accused-coffee-koala-b9fn1dik76"]: parallel,
  ["lisk-mainnet"]: liskTheme,
  ["lisk-sepolia"]: liskTheme,
  ["lumio-mainnet"]: lumioTheme,
  ["stack-mainnet"]: stackTheme,
  ["stack-testnet-p776aut4wc"]: stackTheme,
  ["metal-mainnet"]: metalTheme,
  ["metal-mainnet-0"]: metalTheme,
  ["metal-l2-testnet-3bbzi9kufn"]: metalTheme,
  ["camp-network-4xje7wy105"]: campTheme,
  ["clique-mainnet"]: cliqueTheme,
  ["frax-mainnet"]: fraxTheme,
  ["test-figaro-cuqjfe7wkd"]: ebiTheme,
  ["grubby-red-rodent-a6u9rz8x70"]: ebiTheme,
  ["ebi-mainnet"]: ebiTheme,
  ["mint-sepolia-testnet-ijtsrc4ffq"]: mintTheme,
  ["worldchain-mainnet"]: worldchainTheme,
};

export const deploymentTheme = (
  deployment: DeploymentDto | Pick<DeploymentDto, "name"> | null
) => {
  if (deployment && themes[deployment.name]) {
    return themes[deployment.name];
  }

  return {
    ...defaultTheme,
    // @ts-expect-error
    ...deployment?.theme?.theme,
  };
};
