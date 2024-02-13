import { arbitrum, arbitrumNova, goerli, sepolia } from "viem/chains";
import { mainnet } from "wagmi";

export const PROVE_GAS = BigInt(300_000);
export const FINALIZE_GAS = BigInt(400_000);

export const EASY_MODE_GAS_FEES: { [chainId: number]: number | undefined } = {
  [mainnet.id]: 50,
  [arbitrum.id]: 3,
  [arbitrumNova.id]: 3,
  [goerli.id]: 1,
  [sepolia.id]: 1,
};
