import {
  ancient8,
  arbitrum,
  avalanche,
  base,
  baseSepolia,
  blast,
  bsc,
  celo,
  celoAlfajores,
  cyber,
  cyberTestnet,
  fraxtal,
  fraxtalTestnet,
  holesky,
  inEVM,
  linea,
  lisk,
  liskSepolia,
  lyra,
  mainnet,
  metalL2,
  mintSepoliaTestnet,
  mode,
  modeTestnet,
  optimism,
  optimismSepolia,
  pgn,
  pgnTestnet,
  polygon,
  redstone,
  scroll,
  sepolia,
  shapeSepolia,
  zircuitTestnet,
  zora,
  zoraSepolia,
} from "viem/chains";

import { Theme } from "@/types/theme";

const baseTheme = {
  icon: "/img/base/icon.svg",
  card: {
    className: "bg-blue-600",
    title: "text-white",
  },
};

const optimismTheme = {
  icon: "/img/optimism/icon.svg",
  card: {
    className: "bg-red-500",
    title: "text-white",
    overlay: {
      className:
        "bg-gradient-to-t from-[#EA3431]  to-[#EA3431]/0  mix-blend-multiply opacity-50",
    },
  },
};

const zoraTheme = {
  icon: "/img/zora/icon.svg",
  card: {
    className: "bg-[#006FFE]",
    title: "text-white",
    overlay: {
      image: "/img/zora/bg.jpg",
      className: "w-full h-full mix-blend-screen opacity-100",
    },
  },
};

const modeTheme = {
  icon: "/img/mode/icon.svg",
  card: {
    className: "bg-[#DFFE00]",
    title: "text-black",
    overlay: {
      className:
        "bg-[url('/img/mode/bg.svg')] bg-repeat bg-center bg-[length:15px_15px] opacity-50",
    },
  },
};

const aevoTheme = {
  icon: "/img/aevo/icon.svg",
  card: {
    className: "bg-zinc-950",
  },
};

const lyraTheme = {
  icon: "/img/lyra/icon.svg",
  card: {
    className: "bg-[#26FAB0]",
    title: "text-black",
  },
};

const orderlyTheme = {
  icon: "/img/orderly/icon.svg",
  card: {
    className: "bg-gradient-to-t from-[#4D00B1] via-[#7C3FCB] to-[#7C3FCB]",
    title: "text-white",
  },
};

const ancient8Theme = {
  icon: "/img/ancient8/icon.svg",
  card: {
    className: "bg-gradient-to-t from-[#C7F18C] to-[#AEE760]",
    title: "text-black",
  },
};

const pgnTheme = {
  icon: "/img/pgn/icon.svg",
  card: {
    className: "bg-[#3CE046]",
    overlay: {
      image: "/img/pgn/bg.png",
      className: "w-full h-full",
    },
  },
};

const uniswapTheme = {
  icon: "/img/uniswap-icon.svg",
  card: {
    className: "bg-[#EB79F7]",
  },
};

const kromaTheme = {
  icon: "/img/kroma/icon.svg",
  card: {
    className: "bg-[#72DE2F]",
    overlay: {
      className:
        "bg-gradient-to-t from-teal-950 via-teal-950/0 to-teal-950/0 mix-blend-hard-light opacity-30",
    },
  },
};

const arbitrumOneTheme = {
  icon: "/img/arbitrum-one/icon.svg",
  card: {
    className: "bg-[#1C4ADD]",
    title: "text-white",
    overlay: {
      image: "/img/arbitrum-one/bg.png",
      className: "h-full w-full mix-blend-overlay opacity-80",
    },
  },
};

const redstoneTheme = {
  icon: "/img/redstone-mainnet/icon.svg",
  card: {
    className: "bg-[#F34242]",
    title: "text-white",
  },
};

const liskTheme = {
  icon: "/img/lisk-mainnet/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#4070F4] to-[#295CE9] ",
    title: "text-white",
  },
};

const lumioTheme = {
  icon: "/img/lumio-mainnet/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#2F2B54] to-[#0F0B2D] ",
    title: "text-white",
  },
};

const metalTheme = {
  icon: "/img/metal-mainnet/icon.svg",
  card: {
    className: "bg-white",
    title: "text-white",
    overlay: {
      image: "/img/metal-mainnet/bg-card.jpg",
      className: "w-full h-full opacity-100",
    },
  },
};

const fraxTheme = {
  icon: "/img/frax-mainnet/icon.svg",
  card: {
    className: "bg-[#070707] border border-white/5",
    title: "text-white",
  },
};

const mintTheme = {
  icon: "/img/mint-mainnet/icon.svg",
  card: {
    className: "bg-[#30BF54]",
    title: "text-white",
  },
};

const worldchainTheme = {
  icon: "/img/worldchain-mainnet/icon.svg",
  card: {
    className: "bg-black",
  },
};

const cyberTheme = {
  icon: "/img/cyber-mainnet/icon.svg",
  card: {
    className: "bg-black",
    title: "text-white",
  },
};

const xterioTheme = {
  icon: "/img/xterio-chain-eth/icon.svg",
  card: {
    className: "bg-black",
    title: "text-white",
    overlay: {
      image: "/img/xterio-chain-eth/bg-card.png",
      className: "bg-cover bg-center opacity-100",
    },
  },
};

const celoTheme = {
  icon: "/img/celo/icon.svg",
  card: {
    className: "bg-[#FFFF52]",
    title: "text-black",
  },
};

const blastTheme = {
  icon: "/img/blast/icon.svg",
  card: {
    className: "bg-black border border-white/5",
    title: "text-[#FCFC03]",
  },
};

const lineaTheme = {
  icon: "/img/linea/icon.svg",
  card: {
    className: "bg-[#121212]",
    title: "text-white",
    overlay: {
      className:
        "bg-[url('/img/linea/bg.svg')] bg-no-repeat bg-contain opacity-30",
    },
  },
};

const ethereumTheme = {
  icon: "/img/ethereum/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#88AAF1] to-[#C9B3F5]",
    title: "text-white",
  },
};

const bscTheme = {
  icon: "/img/bsc/icon.svg",
  card: {
    className: "bg-[#FFE900]",
    title: "text-[#181A1E]",
  },
};

const victionTheme = {
  icon: "/img/viction/icon.svg",
  card: {
    className: "bg-[#F8F6D7]",
    title: "text-[#231F20]",
  },
};

const injectiveTheme = {
  icon: "/img/injective/icon.svg",
  card: {
    className: "bg-[#ECF3FB]",
    title: "text-[#231F20]",
    overlay: {
      className:
        "bg-gradient-to-br from-[#32B2FD] via-[#ECF3FB] to-[#A85CFC] opacity-40",
    },
  },
};

const avalancheTheme = {
  card: {
    className: "bg-[#E84142]",
    title: "text-[#ffffff]",
  },
  icon: "/img/avalanche/icon.svg",
};

const scrollTheme = {
  card: {
    className: "bg-[#FADFBA]",
    title: "text-[#101010]",
  },
  icon: "/img/scroll/icon.svg",
};

const polygonTheme = {
  card: {
    className: "bg-gradient-to-b from-[#7F49F3] to-[#693CC8]",
    title: "text-[#ffffff]",
  },
  icon: "/img/polygon/icon.svg",
};

const shapeTheme = {
  icon: "/img/shape/icon.svg",
  card: {
    className: "bg-[#31E3DF]",
    title: "text-black",
  },
};

const zircuitTheme = {
  icon: "/img/zircuit/icon.svg",
  card: {
    className: "bg-[#F6F3E9]",
    title: "text-black",
  },
};

export const cardThemes: {
  [chainId: string]: { card: Theme["card"]; icon: string } | undefined;
} = {
  [base.id]: baseTheme,
  [baseSepolia.id]: baseTheme,
  [optimism.id]: optimismTheme,
  [optimismSepolia.id]: optimismTheme,
  [arbitrum.id]: arbitrumOneTheme,
  [mode.id]: modeTheme,
  [modeTestnet.id]: modeTheme,
  [fraxtal.id]: fraxTheme,
  [fraxtalTestnet.id]: fraxTheme,
  [blast.id]: blastTheme,
  [linea.id]: lineaTheme,
  [bsc.id]: bscTheme,
  [88]: victionTheme,
  [inEVM.id]: injectiveTheme,
  [ancient8.id]: ancient8Theme,
  [mainnet.id]: ethereumTheme,
  [sepolia.id]: ethereumTheme,
  [holesky.id]: ethereumTheme,
  [polygon.id]: polygonTheme,
  [avalanche.id]: avalancheTheme,
  [scroll.id]: scrollTheme,
  [185]: mintTheme,
  [1687]: mintTheme,
  [mintSepoliaTestnet.id]: mintTheme,
  [8866]: lumioTheme,
  [2702128]: xterioTheme,
  [metalL2.id]: metalTheme,
  [1740]: metalTheme,
  [shapeSepolia.id]: shapeTheme,
  [zora.id]: zoraTheme,
  [zoraSepolia.id]: zoraTheme,
  [pgn.id]: pgnTheme,
  [pgnTestnet.id]: pgnTheme,
  [redstone.id]: redstoneTheme,
  [17069]: redstoneTheme,
  [lyra.id]: lyraTheme,
  [lisk.id]: liskTheme,
  [liskSepolia.id]: liskTheme,
  [291]: orderlyTheme,
  [4460]: orderlyTheme,
  [cyber.id]: cyberTheme,
  [cyberTestnet.id]: cyberTheme,
  [celo.id]: celoTheme,
  [celoAlfajores.id]: celoTheme,
  [48900]: zircuitTheme,
  [zircuitTestnet.id]: zircuitTheme,
};
