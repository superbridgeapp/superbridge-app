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

export interface SuperbridgeTokenListToken extends BaseToken {
  extensions: {
    opTokenId: string;
    standardBridgeAddresses: {
      [chainId: number]: Address | undefined;
    };
  };
}

export interface ArbitrumToken extends BaseToken {
  arbitrumBridgeInfo: {
    [chainId: number]: Address | undefined;
  };
}

export interface CctpToken extends BaseToken {
  isCctp: true;
}

export type Token = OptimismToken | ArbitrumToken | CctpToken;

export interface MultiChainToken {
  [chainId: number]: Token | undefined;
}
