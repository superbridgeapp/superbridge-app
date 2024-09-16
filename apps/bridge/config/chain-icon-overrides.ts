import {
  ancient8,
  arbitrum,
  arbitrumNova,
  arbitrumSepolia,
  avalanche,
  base,
  baseSepolia,
  blast,
  bsc,
  bscTestnet,
  fraxtal,
  gravity,
  holesky,
  inEVM,
  kroma,
  linea,
  mainnet,
  manta,
  mode,
  modeTestnet,
  optimism,
  optimismSepolia,
  pgn,
  polygon,
  rollux,
  scroll,
  sepolia,
  syscoin,
  zora,
  zoraSepolia,
} from "viem/chains";

export const chainIcons: { [chainId: number]: string | undefined } = {
  [mainnet.id]: "/img/networks/ethereum.svg",
  [sepolia.id]: "/img/networks/sepolia.svg",
  [holesky.id]: "/img/networks/holesky.png",
  [arbitrumSepolia.id]: "/img/networks/arbitrum-one.svg",
  [arbitrum.id]: "/img/networks/arbitrum-one.svg",
  [arbitrumNova.id]: "/img/networks/arbitrum-nova.svg",
  [syscoin.id]: "/img/networks/syscoin.svg",
  [rollux.id]: "/img/networks/rollux.svg",
  [788988]: "/img/orb3-mainnet/network.svg",
  [pgn.id]: "/img/networks/pgn.svg",
  [kroma.id]: "/img/networks/kroma.svg",
  1024: "/img/parallel/network.svg",
  [mode.id]: "/img/networks/mode.svg",
  [modeTestnet.id]: "/img/networks/mode.svg",
  [zora.id]: "/img/networks/zora.svg",
  [zoraSepolia.id]: "/img/networks/zora.svg",
  [base.id]: "/img/networks/base.svg",
  [baseSepolia.id]: "/img/networks/base.svg",
  [optimism.id]: "/img/networks/optimism.svg",
  [optimismSepolia.id]: "/img/networks/optimism.svg",
  [bsc.id]: "/img/networks/bsc.svg",
  [bscTestnet.id]: "/img/networks/bsc.svg",
  [linea.id]: "/img/networks/linea.svg",
  [fraxtal.id]: "/img/networks/frax.svg",
  [manta.id]: "/img/networks/manta.svg",
  [inEVM.id]: "/img/networks/injective.svg",
  [blast.id]: "/img/networks/blast.svg",
  [88]: "/img/networks/viction.svg",
  [ancient8.id]: "/img/networks/ancient8.svg",
  [avalanche.id]: "/img/networks/avalanche.svg",
  [scroll.id]: "/img/networks/scroll.svg",
  [polygon.id]: "/img/networks/polygon.svg",
  [48900]: "/img/networks/zircuit.svg",
  [gravity.id]: "/img/networks/gravity.png",
  [360]: "/img/molten/network.svg",
};
