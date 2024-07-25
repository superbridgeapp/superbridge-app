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
  ];
};
