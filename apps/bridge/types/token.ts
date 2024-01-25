import { Address } from "viem";

interface BaseToken {
  chainId: number;
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  coinGeckoId?: string;
}

export interface OptimismToken extends BaseToken {
  opTokenId: string;
  standardBridgeAddresses: {
    [chainId: number]: Address | undefined;
  };
}

export interface ArbitrumToken extends BaseToken {
  arbitrumBridgeInfo: {
    [chainId: number]: Address | undefined;
  };
}

export type Token = OptimismToken | ArbitrumToken;

export interface MultiChainToken {
  [chainId: number]: Token | undefined;
}

export interface MultiChainOptimismToken {
  [chainId: number]: OptimismToken | undefined;
}
