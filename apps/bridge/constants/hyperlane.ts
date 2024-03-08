import { Address } from "viem";
import { arbitrum, goerli, optimism, optimismGoerli } from "viem/chains";
import { mainnet } from "wagmi/chains";

export const hyperlaneDomains: { [chainId: number]: number | undefined } = {
  [mainnet.id]: 1,
  [arbitrum.id]: 42161,
  [optimism.id]: 10,
  [goerli.id]: 5,
  [optimismGoerli.id]: 420,
};

interface HyperlaneAddresses {
  igp: Address;
}

export const hyperlaneAddresses: {
  [chainId: number]: HyperlaneAddresses | undefined;
} = {
  [mainnet.id]: { igp: "0x6cA0B6D22da47f091B7613223cD4BB03a2d77918" },
  [arbitrum.id]: { igp: "0x6cA0B6D22da47f091B7613223cD4BB03a2d77918" },
  [optimism.id]: { igp: "0x6cA0B6D22da47f091B7613223cD4BB03a2d77918" },
  [goerli.id]: { igp: "0x8f9C3888bFC8a5B25AED115A82eCbb788b196d2a" },
  [optimismGoerli.id]: { igp: "0x8f9C3888bFC8a5B25AED115A82eCbb788b196d2a" },
};

export const CCTP_MINT_GAS_COST = BigInt(300_000);
