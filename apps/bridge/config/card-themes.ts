import { title } from "process";
import {
  ancient8,
  arbitrum,
  avalanche,
  base,
  baseSepolia,
  blast,
  bsc,
  cyber,
  fraxtal,
  fraxtalTestnet,
  inEVM,
  linea,
  lisk,
  lyra,
  mainnet,
  mode,
  optimism,
  optimismSepolia,
  pgn,
  polygon,
  redstone,
  scroll,
  zora,
} from "viem/chains";

// import { DeploymentDto } from "@/codegen/model";
import { Theme } from "@/types/theme";

// const defaultTheme = {
//   bg: "bg-zinc-50 dark:bg-black/70",
//   bgMuted: "bg-zinc-100 dark:bg-white/10",
//   border: "border-zinc-100 dark:border-white/10",
//   accentBg:
//     "bg-zinc-900 hover:bg-zinc-950 dark:bg-zinc-50 dark:hover:bg-zinc-100",
//   accentText: "text-zinc-50 dark:text-zinc-900",
//   screenBg: "bg-zinc-100 dark:bg-zinc-900 ",
//   card: {
//     className: "bg-violet-500",
//     overlay: {
//       className:
//         "bg-gradient-to-t from-zinc-950 via-zinc-950/0 to-zinc-950/0 mix-blend-multiply opacity-10",
//     },
//   },
//   screenBgImg:
//     "bg-gradient-to-t from-violet-500 via-violet-500/0 to-violet-500/0 mix-blend-lighter opacity-50",
//   fill: "fill-zinc-300 dark:fill-white/20",
//   textColor: "text-zinc-900 dark:text-zinc-50",
//   textColorMuted: "text-zinc-400",
//   logoSrc: "/img/icon-placeholder.svg",
//   logoSrcDark: "/img/icon-placeholder.svg",
//   logoWidth: 42,
//   logoHeight: 42,
//   icon: "/img/icon-placeholder.svg",
//   navicon: "/img/icon.svg",
// };

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

const arbitrumNovaTheme = {
  icon: "/img/arbitrum-nova/icon.svg",
  card: {
    className: "bg-[#E57410]",
    overlay: {
      image: "/img/arbitrum-nova/bg.png",
      className: "bg-cover bg-center mix-blend-overlay opacity-30",
    },
  },
};

const frameTheme = {
  icon: "/img/frame/icon.svg",
  bg: "bg-zinc-50 dark:bg-black/80",
  card: {
    className: "bg-gradient-to-t from-[#FE7822] to-[#FCB72A]",
  },
};

const apeTheme = {
  icon: "/img/icon-apechain.svg",
  card: {
    className: "bg-[#0250E8]",
  },
};

const rolluxTheme = {
  icon: "/img/rollux/network.svg",
  card: {
    className: "bg-[#DBEF88]",
    overlay: {
      className:
        "bg-gradient-to-b from-[#DBEF88] via-[#DBEF88]  to-[#EACF5E]  opacity-100",
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

const orb3 = {
  icon: "/img/orb3-mainnet/icon.svg",
  card: {
    className: "bg-zinc-950",
  },
};

const parallel = {
  icon: "/img/parallel/icon.svg",
  card: {
    className: "bg-black",
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

const stackTheme = {
  icon: "/img/stack-mainnet/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#13151A] to-[#000000] ",
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

const campTheme = {
  icon: "/img/camp-mainnet/icon.svg",
  card: {
    className: "bg-[#111111]",
  },
};

const cliqueTheme = {
  icon: "/img/clique-mainnet/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#23B2EF] to-[#0049C6] ",
  },
};

const fraxTheme = {
  icon: "/img/frax-mainnet/icon.svg",
  card: {
    className: "bg-[#070707] border border-white/5",
    title: "text-white",
  },
};

const ebiTheme = {
  icon: "/img/ebi-mainnet/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#FF8000] to-[#FF0079]",
  },
};

const mintTheme = {
  icon: "/img/mint-mainnet/icon.svg",
  card: {
    className: "bg-[#30BF54]",
    title: "text-white",
  },
};

const superseedTheme = {
  icon: "/img/superseed-mainnet/icon.svg",
  card: {
    className: "bg-[#0B0B0A]",
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

// export const themes: { [name: string]| undefined } = {
//   ["base"]: baseTheme,
//   ["base-sepolia"]: baseTheme,
//   ["optimism"]: optimismTheme,
//   ["optimism-testnet"]: optimismTheme,
//   ["op-sepolia"]: optimismTheme,
//   ["arbitrum-goerli"]: arbitrumOneTheme,
//   ["arbitrum-one"]: arbitrumOneTheme,
//   ["arbitrum-nova"]: arbitrumNovaTheme,
//   ["frame-testnet"]: frameTheme,
//   ["frame"]: frameTheme,
//   ["zora"]: zoraTheme,
//   ["zora-sepolia-0thyhxtf5e"]: zoraTheme,
//   ["aevo"]: aevoTheme,
//   ["kroma"]: kromaTheme,
//   pgn: pgnTheme,
//   "pgn-sepolia-i4td3ji6i0": pgnTheme,
//   mode: modeTheme,
//   "mode-sepolia-vtnhnpim72": modeTheme,
//   lyra: lyraTheme,
//   orderly: orderlyTheme,
//   "orderly-l2-4460-sepolia-8tc3sd7dvy": orderlyTheme,
//   ancient8: ancient8Theme,
//   ["uniswap-v4-hook-sandbox-6tl5qq8i4d"]: uniswapTheme,
//   ["apechain-test-qbuapbatak"]: apeTheme,
//   rollux: rolluxTheme,
//   ["redstone-mainnet"]: redstoneTheme,
//   ["lattice-testnet"]: redstoneTheme,
//   ["orb3-mainnet"]: orb3,
//   parallel,
//   ["parallel-chain-oqwzakghzt"]: parallel,
//   ["surprised-harlequin-bonobo-fvcy2k9oqh"]: parallel,
//   ["accused-coffee-koala-b9fn1dik76"]: parallel,
//   ["lisk-mainnet"]: liskTheme,
//   ["lisk-sepolia"]: liskTheme,
//   ["lumio-mainnet"]: lumioTheme,
//   ["stack-mainnet"]: stackTheme,
//   ["stack-testnet-p776aut4wc"]: stackTheme,
//   ["metal-mainnet"]: metalTheme,
//   ["metal-mainnet-0"]: metalTheme,
//   ["metal-l2-testnet-3bbzi9kufn"]: metalTheme,
//   ["camp-network-4xje7wy105"]: campTheme,
//   ["clique-mainnet"]: cliqueTheme,
//   ["fraxtal-mainnet-l2"]: fraxTheme,
//   ["fraxtal-testnet-l2"]: fraxTheme,
//   ["test-figaro-cuqjfe7wkd"]: ebiTheme,
//   ["grubby-red-rodent-a6u9rz8x70"]: ebiTheme,
//   ["ebi-mainnet"]: ebiTheme,
//   ["mint-sepolia-testnet-ijtsrc4ffq"]: mintTheme,
//   ["mint-mainnet-0"]: mintTheme,
//   ["worldchain-mainnet"]: worldchainTheme,
//   ["sepolia-superseed-826s35710w"]: superseedTheme,
//   ["cyber-mainnet"]: cyberTheme,
//   ["cyber-testnet"]: cyberTheme,
//   ["xterio-chain-eth"]: xterioTheme,
//   ["xterio-eth-testnet"]: xterioTheme,
//   ["celo-testnet"]: celoTheme,
// };

// export const deploymentTheme = (
//   deployment: DeploymentDto | Pick<DeploymentDto, "name"> | null
// ) => {
//   if (deployment && themes[deployment.name]) {
//     return themes[deployment.name];
//   }

//   return {
//     // @ts-expect-error
//     ...deployment?.theme?.theme,
//   };
// };

export const cardThemes: {
  [chainId: string]: { card: Theme["card"]; icon: string } | undefined;
} = {
  [base.id]: baseTheme,
  [baseSepolia.id]: baseTheme,
  [optimism.id]: optimismTheme,
  [optimismSepolia.id]: optimismTheme,

  [arbitrum.id]: arbitrumOneTheme,
  [mode.id]: modeTheme,
  [fraxtal.id]: fraxTheme,
  [fraxtalTestnet.id]: fraxTheme,
  [blast.id]: blastTheme,
  [linea.id]: lineaTheme,
  [bsc.id]: bscTheme,
  [88]: victionTheme,
  [inEVM.id]: injectiveTheme,
  [ancient8.id]: ancient8Theme,
  // ethereum
  [mainnet.id]: ethereumTheme,
  [polygon.id]: polygonTheme,
  [avalanche.id]: avalancheTheme,
  [scroll.id]: scrollTheme,
  [185]: mintTheme,
  [8866]: lumioTheme,
  [2702128]: xterioTheme,
  [1750]: metalTheme,
  [1740]: metalTheme,
  [11011]: shapeTheme,
  [zora.id]: zoraTheme,
  [pgn.id]: pgnTheme,
  [redstone.id]: redstoneTheme,
  [lyra.id]: lyraTheme,
  [lisk.id]: liskTheme,
  [291]: orderlyTheme,
  [4460]: orderlyTheme,
  [cyber.id]: cyberTheme,
};
