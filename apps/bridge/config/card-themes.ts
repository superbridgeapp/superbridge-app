import {
  ancient8,
  arbitrum,
  base,
  baseSepolia,
  blast,
  bsc,
  fraxtal,
  inEVM,
  linea,
  mainnet,
  mode,
  optimism,
  optimismSepolia,
} from "viem/chains";

import { DeploymentDto } from "@/codegen/model";
import { Theme } from "@/types/theme";

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
  iconSrc: "/img/base/icon.svg",
  card: {
    className: "bg-blue-600",
  },
};

const optimismTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/optimism/icon.svg",
  card: {
    className: "bg-red-500",
    // title: "text-black",
    overlay: {
      className:
        "bg-gradient-to-t from-[#EA3431]  to-[#EA3431]/0  mix-blend-multiply opacity-50",
    },
  },
};

const zoraTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/zora/icon.svg",
  card: {
    className: "bg-[#006FFE]",
    overlay: {
      image: "/img/zora/bg.jpg",
      className: "bg-cover bg-center mix-blend-screen opacity-100",
    },
  },
};

const modeTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/mode/icon.svg",
  card: {
    className: "bg-[#DFFE00]",
    title: "text-black",
    overlay: {
      className:
        "bg-[url('/img/mode/bg.svg')] bg-repeat bg-center bg-[length:15px_15px] opacity-50",
    },
  },
};

const aevoTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/aevo/icon.svg",
  card: {
    className: "bg-zinc-950",
  },
};

const lyraTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/lyra/icon.svg",
  card: {
    className: "bg-[#26FAB0]",
    title: "text-black",
  },
};

const orderlyTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/orderly/icon.svg",
  card: {
    className: "bg-gradient-to-t from-[#4D00B1] via-[#7C3FCB] to-[#7C3FCB]",
  },
};

const ancient8Theme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/ancient8/icon.svg",
  card: {
    className: "bg-gradient-to-t from-[#C7F18C] to-[#AEE760]",
    title: "text-black",
  },
};

const pgnTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/pgn/icon.svg",
  card: {
    className: "bg-[#3CE046]",
    overlay: {
      image: "/img/pgn/bg.png",
      className: "bg-cover bg-center opacity-70",
    },
  },
};

const uniswapTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/uniswap-icon.svg",
  card: {
    className: "bg-[#EB79F7]",
  },
};

const kromaTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/kroma/icon.svg",
  card: {
    className: "bg-[#72DE2F]",
    overlay: {
      className:
        "bg-gradient-to-t from-teal-950 via-teal-950/0 to-teal-950/0 mix-blend-hard-light opacity-30",
    },
  },
};

const arbitrumOneTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/arbitrum-one/icon.svg",
  card: {
    className: "bg-[#1C4ADD]",
    overlay: {
      image: "/img/arbitrum-one/bg.png",
      className: "h-full w-full mix-blend-overlay opacity-80",
    },
  },
};

const arbitrumNovaTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/arbitrum-nova/icon.svg",
  card: {
    className: "bg-[#E57410]",
    overlay: {
      image: "/img/arbitrum-nova/bg.png",
      className: "bg-cover bg-center mix-blend-overlay opacity-30",
    },
  },
};

const frameTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/frame/icon.svg",
  bg: "bg-zinc-50 dark:bg-black/80",
  card: {
    className: "bg-gradient-to-t from-[#FE7822] to-[#FCB72A]",
  },
};

const apeTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/icon-apechain.svg",
  card: {
    className: "bg-[#0250E8]",
  },
};

const rolluxTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/rollux/network.svg",
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
  iconSrc: "/img/redstone-mainnet/icon.svg",
  card: {
    className: "bg-[#F34242]",
  },
};

const orb3: Theme = {
  ...defaultTheme,
  iconSrc: "/img/orb3-mainnet/icon.svg",
  card: {
    className: "bg-zinc-950",
  },
};

const parallel: Theme = {
  ...defaultTheme,
  iconSrc: "/img/parallel/icon.svg",
  card: {
    className: "bg-black",
  },
};

const liskTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/lisk-mainnet/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#4070F4] to-[#295CE9] ",
  },
};

const lumioTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/lumio-mainnet/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#2F2B54] to-[#0F0B2D] ",
  },
};

const stackTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/stack-mainnet/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#13151A] to-[#000000] ",
  },
};

const metalTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/metal-mainnet/icon.svg",
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
  iconSrc: "/img/camp-mainnet/icon.svg",
  card: {
    className: "bg-[#111111]",
  },
};

const cliqueTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/clique-mainnet/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#23B2EF] to-[#0049C6] ",
  },
};

const fraxTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/frax-mainnet/icon.svg",
  card: {
    className: "bg-[#070707] border border-white/5",
  },
};

const ebiTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/ebi-mainnet/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#FF8000] to-[#FF0079]",
  },
};

const mintTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/mint-mainnet/icon.svg",
  card: {
    className: "bg-[#30BF54]",
  },
};

const superseedTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/superseed-mainnet/icon.svg",
  card: {
    className: "bg-[#0B0B0A]",
  },
};

const worldchainTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/worldchain-mainnet/icon.svg",
  card: {
    className: "bg-black",
  },
};

const cyberTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/cyber-mainnet/icon.svg",
  card: {
    className: "bg-black",
  },
};

const xterioTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/xterio-chain-eth/icon.svg",
  card: {
    className: "bg-black",
    overlay: {
      image: "/img/xterio-chain-eth/bg-card.png",
      className: "bg-cover bg-center opacity-100",
    },
  },
};

const celoTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/celo/icon.svg",
  card: {
    className: "bg-[#FFFF52]",
    title: "text-black",
  },
};

const blastTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/blast/icon.svg",
  card: {
    className: "bg-black border border-white/5",
    title: "text-[#FCFC03]",
  },
};

const lineaTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/linea/icon.svg",
  card: {
    className: "bg-[#121212]",
    title: "text-white",
    overlay: {
      className:
        "bg-[url('/img/linea/bg.svg')] bg-no-repeat bg-contain opacity-30",
    },
  },
};

const ethereumTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/ethereum/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#88AAF1] to-[#C9B3F5]",
    title: "text-white",
  },
};

const bscTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/bsc/icon.svg",
  card: {
    className: "bg-[#FFE900]",
    title: "text-[#181A1E]",
  },
};

const victionTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/viction/icon.svg",
  card: {
    className: "bg-[#F8F6D7]",
    title: "text-[#231F20]",
  },
};

const injectiveTheme: Theme = {
  ...defaultTheme,
  iconSrc: "/img/injective/icon.svg",
  card: {
    className: "bg-[#ECF3FB]",
    title: "text-[#231F20]",
    overlay: {
      className:
        "bg-gradient-to-br from-[#32B2FD] via-[#ECF3FB] to-[#A85CFC] opacity-40",
    },
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
  ["fraxtal-mainnet-l2"]: fraxTheme,
  ["fraxtal-testnet-l2"]: fraxTheme,
  ["test-figaro-cuqjfe7wkd"]: ebiTheme,
  ["grubby-red-rodent-a6u9rz8x70"]: ebiTheme,
  ["ebi-mainnet"]: ebiTheme,
  ["mint-sepolia-testnet-ijtsrc4ffq"]: mintTheme,
  ["mint-mainnet-0"]: mintTheme,
  ["worldchain-mainnet"]: worldchainTheme,
  ["sepolia-superseed-826s35710w"]: superseedTheme,
  ["cyber-mainnet"]: cyberTheme,
  ["cyber-testnet"]: cyberTheme,
  ["xterio-chain-eth"]: xterioTheme,
  ["xterio-eth-testnet"]: xterioTheme,
  ["celo-testnet"]: celoTheme,
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

export const cardThemes: {
  [chainId: string]: { card: Theme["card"]; icon: string } | undefined;
} = {
  [base.id]: { card: baseTheme.card, icon: baseTheme.iconSrc },
  [baseSepolia.id]: { card: baseTheme.card, icon: baseTheme.iconSrc },
  [optimism.id]: { card: optimismTheme.card, icon: optimismTheme.iconSrc },
  [optimismSepolia.id]: {
    card: optimismTheme.card,
    icon: "/img/optimism/icon.svg",
  },
  [arbitrum.id]: {
    card: arbitrumOneTheme.card,
    icon: arbitrumOneTheme.iconSrc,
  },
  [mode.id]: {
    card: modeTheme.card,
    icon: modeTheme.iconSrc,
  },
  [fraxtal.id]: {
    card: fraxTheme.card,
    icon: frameTheme.iconSrc,
  },
  [blast.id]: {
    card: blastTheme.card,
    icon: blastTheme.iconSrc,
  },
  [linea.id]: {
    card: lineaTheme.card,
    icon: lineaTheme.iconSrc,
  },
  [bsc.id]: {
    card: bscTheme.card,
    icon: bscTheme.iconSrc,
  },
  [88]: {
    card: victionTheme.card,
    icon: victionTheme.iconSrc,
  },
  [inEVM.id]: {
    card: injectiveTheme.card,
    icon: injectiveTheme.iconSrc,
  },
  [ancient8.id]: {
    card: ancient8Theme.card,
    icon: ancient8Theme.iconSrc,
  },
  // ethereum
  [mainnet.id]: {
    card: ethereumTheme.card,
    icon: ethereumTheme.iconSrc,
  },
};
