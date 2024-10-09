import {
  ancient8,
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  blast,
  bsc,
  bscTestnet,
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
  polygonAmoy,
  redstone,
  scroll,
  sepolia,
  shapeSepolia,
  zircuitTestnet,
  zora,
  zoraSepolia,
} from "viem/chains";

interface CardTheme {
  className?: string;
  overlay?: {
    className?: string;
    image?: string;
  };
  title?: string;
}

export const defaultCardTheme: { card: CardTheme; icon: string } = {
  icon: "/img/default/icon.svg",
  card: {
    className: "bg-[#A882FD]",
    title: "text-white",
    overlay: {
      className:
        "bg-[url('/img/default/bg.svg')] bg-repeat bg-center bg-[length:16px_16px] opacity-15",
    },
  },
};

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
        "bg-gradient-to-t from-teal-950 via-teal-950/0 to-teal-950/0 mix-blend-screen opacity-100",
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
    title: "text-white",
  },
};

const cyberTheme = {
  icon: "/img/cyber-mainnet/icon.svg",
  card: {
    className: "bg-[#EAFFE7]",
    title: "text-zinc-900",
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
    title: "text-white",
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
    title: "text-white",
  },
  icon: "/img/polygon/icon.svg",
};

const polygonAmoyTheme = {
  card: {
    className: "bg-gradient-to-tr from-[#7F49F3] to-[#693CC8]",
    title: "text-white",
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

const degenTheme = {
  icon: "/img/degen/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#0F172A] to-[#412978]",
    title: "text-white",
  },
};

const fuseTheme = {
  icon: "/img/fuse/icon.svg",
  card: {
    className: "bg-[#BAFEC0]",
    title: "text-black",
  },
};

const gnosisTheme = {
  icon: "/img/gnosis/icon.svg",
  card: {
    className: "bg-[#133629]",
    title: "text-white",
  },
};

const luksoTheme = {
  icon: "/img/lukso/icon.svg",
  card: {
    className: "bg-white",
    title: "text-black",
  },
};

const mantleTheme = {
  icon: "/img/mantle/icon.svg",
  card: {
    className: "bg-black",
    title: "text-white",
  },
};

const merlinTheme = {
  icon: "/img/merlin/icon.svg",
  card: {
    className: "bg-[#0F0832]",
    title: "text-white",
  },
};

const metisTheme = {
  icon: "/img/metis/icon.svg",
  card: {
    className: "bg-[#00CFFF]",
    title: "text-white",
  },
};

const moonbeamTheme = {
  icon: "/img/moonbeam/icon.svg",
  card: {
    className: "bg-[url('/img/moonbeam/bg.svg')] bg-no-repeat bg-cover",
    title: "text-white",
  },
};

const polygonZkEvmTheme = {
  icon: "/img/polygonzkevm/icon.svg",
  card: {
    className: "bg-[#6C00F6]",
    title: "text-white",
  },
};

const realTheme = {
  icon: "/img/real/icon.svg",
  card: {
    className: "bg-gradient-to-t from-[#D0D3E2] to-[#F5F6FB]",
    title: "text-black",
  },
};

const seiTheme = {
  icon: "/img/sei/icon.svg",
  card: {
    className: "bg-gradient-to-b from-[#F2E9E9] to-[#ecedee]",
    title: "text-black",
  },
};

const taikoTheme = {
  icon: "/img/taiko/icon.svg",
  card: {
    className: "bg-[#E81899]",
    title: "text-white",
  },
};

const xiaTheme = {
  icon: "/img/xia/icon.svg",
  card: {
    className: "bg-[#FF0030]",
    title: "text-white",
  },
};

const xlayerTheme = {
  icon: "/img/xlayer/icon.svg",
  card: {
    className: "bg-gradient-to-b from-zinc-900 to-zinc-950",
    title: "text-white",
  },
};

const zetaTheme = {
  icon: "/img/zeta/icon.svg",
  card: {
    className: "bg-[#005741]",
    title: "text-white",
  },
};

const cheesechainTheme = {
  icon: "/img/cheesechain/icon.png",
  card: {
    className: "bg-[#03F3F2]",
    title: "text-zinc-900",
  },
};

const proofofplayTheme = {
  icon: "/img/proofofplay/icon.svg",
  card: {
    className: "bg-gradient-to-tr from-[#863AF8] to-[#37D7D5]",
    title: "text-white",
  },
};

const sankoTheme = {
  icon: "/img/sanko/icon.png",
  card: {
    className: "bg-[#11131E]",
    title: "text-white",
  },
};

const enduranceTheme = {
  icon: "/img/endurance/icon.png",
  card: {
    className: "bg-gradient-to-bl from-[#936A48] to-[#1C1B25]",
    title: "text-white",
  },
};

const moltenTheme = {
  icon: "/img/molten/icon.svg",
  card: {
    className: "bg-zinc-900",
    title: "text-white",
  },
};
const mantaTheme = {
  icon: "/img/manta/icon.svg",
  card: {
    className: "bg-gradient-to-tr from-[#29CCB9] via-[#0091FF] to-[#FF66B7]",
    title: "text-white",
  },
};

const bobTheme = {
  icon: "/img/bob/icon.svg",
  card: {
    className: "bg-[#F25D00]",
    title: "text-white",
  },
};

const formTheme = {
  icon: "/img/form/icon.svg",
  card: {
    className: "bg-black",
    title: "text-white",
    overlay: {
      className:
        "bg-[url('/img/form/bg-card.jpg')] bg-center bg-cover opacity-70",
    },
  },
};
const campTheme = {
  icon: "/img/camp/icon.svg",
  card: {
    className: "bg-white border-black/5",
    title: "text-black",
  },
};
const citreaTheme = {
  icon: "/img/citrea/icon.svg",
  card: {
    className: "bg-white",
    title: "text-black",
    overlay: {
      className: "bg-[url('/img/citrea/bg-card.svg')] bg-bottom bg-cover",
    },
  },
};
const suaveTheme = {
  icon: "/img/suave/icon.png",
  card: {
    className: "bg-white border border-black/5",
    title: "text-black",
  },
};
const soneiumTheme = {
  icon: "/img/soneium/icon.png",
  card: {
    className: "bg-black",
    title: "text-white",
  },
};
const beraTheme = {
  icon: "/img/berachain/icon.svg",
  card: {
    className: "bg-[#F8F2E9]",
    title: "text-black",
  },
};
const formaTheme = {
  icon: "/img/forma/icon.svg",
  card: {
    className: "bg-black",
    title: "text-white",
  },
};
const unichainTheme = {
  icon: "/img/unichain/icon.svg",
  card: {
    className: "bg-[#F50DB4]",
    title: "text-black",
    overlay: {
      className: "bg-[url('/img/unichain/bg-card.jpg')] bg-bottom bg-cover",
    },
  },
};

export const cardThemes: {
  [chainId: string]: { card: CardTheme; icon: string } | undefined;
} = {
  [base.id]: baseTheme,
  [baseSepolia.id]: baseTheme,
  [optimism.id]: optimismTheme,
  [optimismSepolia.id]: optimismTheme,
  [arbitrum.id]: arbitrumOneTheme,
  [arbitrumSepolia.id]: arbitrumOneTheme,
  [mode.id]: modeTheme,
  [modeTestnet.id]: modeTheme,
  [fraxtal.id]: fraxTheme,
  [fraxtalTestnet.id]: fraxTheme,
  [blast.id]: blastTheme,
  [linea.id]: lineaTheme,
  [bsc.id]: bscTheme,
  [bscTestnet.id]: bscTheme,
  [88]: victionTheme,
  [inEVM.id]: injectiveTheme,
  [ancient8.id]: ancient8Theme,
  [mainnet.id]: ethereumTheme,
  [sepolia.id]: ethereumTheme,
  [holesky.id]: ethereumTheme,
  [polygon.id]: polygonTheme,
  [polygonAmoy.id]: polygonAmoyTheme,
  [avalanche.id]: avalancheTheme,
  [avalancheFuji.id]: avalancheTheme,
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
  // Degen Chain
  [666666666]: degenTheme,
  // Fuse
  [122]: fuseTheme,
  // Gnosis
  [100]: gnosisTheme,
  // Kroma
  [255]: kromaTheme,
  // Lukso
  [42]: luksoTheme,
  // Mantle
  [5000]: mantleTheme,
  // Merlin
  [4200]: merlinTheme,
  // Metis
  [1088]: metisTheme,
  // Moonbeam
  [1284]: moonbeamTheme,
  // Polygon zkEVM
  [1101]: polygonZkEvmTheme,
  // Real
  [111188]: realTheme,
  // Sei
  [1329]: seiTheme,
  // Taiko
  [167000]: taikoTheme,
  // Xai
  [660279]: xiaTheme,
  // xLayer
  [196]: xlayerTheme,
  // Zeta Chain
  [7000]: zetaTheme,
  // Proof of Play Apex
  [70700]: proofofplayTheme,
  // Sanko
  [1996]: sankoTheme,
  // World Chain
  [480]: worldchainTheme,
  // Endurance
  [648]: enduranceTheme,
  // cheesechain
  [383353]: cheesechainTheme,
  [360]: moltenTheme,
  [169]: mantaTheme,
  [60808]: bobTheme,
  [132902]: formTheme,
  [325000]: campTheme,
  [5115]: citreaTheme,
  [33626250]: suaveTheme,
  [1946]: soneiumTheme,
  [80084]: beraTheme,
  [984122]: formaTheme,
};
