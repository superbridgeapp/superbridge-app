import {
  arbitrum,
  base,
  baseSepolia,
  mainnet,
  mode,
  optimism,
  optimismSepolia,
  sepolia,
  zora,
} from "viem/chains";

import { OptimismToken } from "@/types/token";

import * as metal from "../metal";

const BRIDGED_USDC = "bridged-usdc";
const NATIVE_USDC = "native-usdc";

export const bridged: OptimismToken[] = [
  // mainnet
  {
    chainId: mainnet.id,
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png",
    standardBridgeAddresses: {
      [optimism.id]: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1",
      [base.id]: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
      [zora.id]: "0x3e2ea9b92b7e48a52296fd261dc26fd995284631",
      [metal.chainId]: metal.l1StandardBridgeAddress,
      [mode.id]: "0x735aDBbE72226BD52e818E7181953f42E3b0FF21",
    },
    opTokenId: BRIDGED_USDC,
  },
  {
    chainId: base.id,
    address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
    name: "USD Base Coin",
    symbol: "USDbC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: BRIDGED_USDC,
  },
  {
    chainId: optimism.id,
    address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    name: "Bridged USDC",
    symbol: "USDC.e",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: BRIDGED_USDC,
  },
  {
    chainId: zora.id,
    address: "0xCccCCccc7021b32EBb4e8C08314bD62F7c653EC4",
    name: "USD Coin (Bridged from Ethereum)",
    symbol: "USDzC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: BRIDGED_USDC,
  },
  {
    chainId: mode.id,
    address: "0xd988097fb8612cc24eeC14542bC03424c656005f",
    name: "USD Coin (Bridged from Ethereum)",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: BRIDGED_USDC,
  },
  {
    chainId: metal.chainId,
    address: "0xb91CFCcA485C6E40E3bC622f9BFA02a8ACdEeBab",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: BRIDGED_USDC,
  },

  // sepolia
  {
    chainId: baseSepolia.id,
    address: "0x853154e2A5604E5C74a2546E2871Ad44932eB92C",
    name: "USD Base Coin",
    symbol: "USDbC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png",
    standardBridgeAddresses: {
      [sepolia.id]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: BRIDGED_USDC,
  },
];

export const native: OptimismToken[] = [
  // sepolia
  {
    chainId: sepolia.id,
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/USDC/logo.png",
    standardBridgeAddresses: {
      [optimismSepolia.id]: "0x",
      [baseSepolia.id]: "0x",
    },
    opTokenId: NATIVE_USDC,
  },
  {
    chainId: optimismSepolia.id,
    address: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/USDC/logo.png",
    standardBridgeAddresses: {
      [sepolia.id]: "0x",
    },
    opTokenId: NATIVE_USDC,
  },
  {
    chainId: baseSepolia.id,
    address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/USDC/logo.png",
    standardBridgeAddresses: {
      [sepolia.id]: "0x",
    },
    opTokenId: NATIVE_USDC,
  },
  // mainnet
  {
    chainId: mainnet.id,
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/USDC/logo.png",
    standardBridgeAddresses: {
      [optimism.id]: "0x",
      [base.id]: "0x",
      [arbitrum.id]: "0x",
    },
    opTokenId: NATIVE_USDC,
  },
  {
    chainId: base.id,
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/USDC/logo.png",
    standardBridgeAddresses: {
      [mainnet.id]: "0x",
    },
    opTokenId: NATIVE_USDC,
  },
  {
    chainId: optimism.id,
    address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/USDC/logo.png",
    standardBridgeAddresses: {
      [mainnet.id]: "0x",
    },
    opTokenId: NATIVE_USDC,
  },
  {
    chainId: arbitrum.id,
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/USDC/logo.png",
    standardBridgeAddresses: {
      [mainnet.id]: "0x",
    },
    opTokenId: NATIVE_USDC,
  },
];
