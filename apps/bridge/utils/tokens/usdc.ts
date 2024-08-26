import {
  arbitrum,
  avalanche,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  sepolia,
} from "viem/chains";

import { Token } from "@/types/token";

const bridgedUsdcSymbols = ["USDC.e", "USDzC", "USDbC"];

export const nativeUSDC: { [x: number]: string | undefined } = {
  [sepolia.id]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  [optimismSepolia.id]: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
  [baseSepolia.id]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  [mainnet.id]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  [optimism.id]: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
  [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  [arbitrum.id]: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  [avalanche.id]: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  [polygon.id]: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
};

export const isBridgedUsdc = (a: Token) => {
  if (bridgedUsdcSymbols.includes(a.symbol)) {
    return true;
  }

  if (a.symbol === "USDC" && !nativeUSDC[a.chainId]) {
    return true;
  }

  return false;
};
