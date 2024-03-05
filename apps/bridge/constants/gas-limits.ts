import { arbitrum, arbitrumNova, goerli, mainnet, sepolia } from "wagmi/chains";

export const PROVE_GAS = BigInt(300_000);
export const FINALIZE_GAS = BigInt(400_000);

export const EASY_MODE_GAS_FEES: { [chainId: number]: number | undefined } = {
  [mainnet.id]: 50,
  [arbitrum.id]: 3,
  [arbitrumNova.id]: 3,
  [goerli.id]: 1,
  [sepolia.id]: 1,
};
