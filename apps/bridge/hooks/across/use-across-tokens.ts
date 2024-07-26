import { Address, zeroAddress } from "viem";
import { base, lisk, mainnet, mode, optimism } from "viem/chains";

import { MultiChainToken, OptimismToken } from "@/types/token";
import { deadAddress } from "@/utils/is-eth";

const nativeUsdc = (address: Address, chainId: number): OptimismToken => ({
  chainId,
  address,
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  logoURI: "https://ethereum-optimism.github.io/data/USDC/logo.png",
  standardBridgeAddresses: {},
  opTokenId: "native-usdc",
});

const bridgedUsdc = (address: Address, chainId: number): OptimismToken => ({
  chainId,
  address,
  name: "Bridged USDC (from Ethereum)",
  symbol: "USDC.e",
  decimals: 6,
  logoURI: "https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png",
  standardBridgeAddresses: {},
  opTokenId: "bridged-usdc",
});

const usdt = (address: Address, chainId: number): OptimismToken => ({
  chainId,
  address,
  name: "Tether USD",
  symbol: "USDT",
  decimals: 6,
  logoURI: "https://ethereum-optimism.github.io/data/USDT/logo.png",
  standardBridgeAddresses: {},
  opTokenId: "USDT",
});

const eth = (address: Address, chainId: number): OptimismToken => ({
  chainId,
  address,
  name: mainnet.nativeCurrency.name,
  symbol: mainnet.nativeCurrency.symbol,
  decimals: mainnet.nativeCurrency.decimals,
  standardBridgeAddresses: {},
  opTokenId: "ETH",
  logoURI: "https://ethereum-optimism.github.io/data/ETH/logo.svg",
});

export const useAcrossTokens = (): MultiChainToken[] => {
  return [
    {
      [mainnet.id]: nativeUsdc(
        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        mainnet.id
      ),
      [base.id]: nativeUsdc(
        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        base.id
      ),
      [optimism.id]: nativeUsdc(
        "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
        optimism.id
      ),
      [mode.id]: bridgedUsdc(
        "0xd988097fb8612cc24eeC14542bC03424c656005f",
        mode.id
      ),
    },
    {
      [mainnet.id]: eth(zeroAddress, mainnet.id),
      [base.id]: eth(deadAddress, base.id),
      [optimism.id]: eth(deadAddress, optimism.id),
      [mode.id]: eth(deadAddress, mode.id),
      [lisk.id]: eth(deadAddress, lisk.id),
    },
    {
      [mainnet.id]: usdt(
        "0xdac17f958d2ee523a2206206994597c13d831ec7",
        mainnet.id
      ),
      [optimism.id]: usdt(
        "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
        optimism.id
      ),
      [mode.id]: usdt("0xf0F161fDA2712DB8b566946122a5af183995e2eD", mode.id),
      [lisk.id]: usdt("0x05D032ac25d322df992303dCa074EE7392C117b9", lisk.id),
    },
  ];
};
