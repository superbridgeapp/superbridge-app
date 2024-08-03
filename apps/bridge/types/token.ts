import { Address } from "viem";

export interface BaseToken {
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

export interface HyperlaneToken extends BaseToken {
  hyperlane: {
    router: string;
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
  cctp: {
    [chainId: number]: true | undefined;
  };
}

export type Token =
  | BaseToken
  | OptimismToken
  | ArbitrumToken
  | CctpToken
  | HyperlaneToken;

export interface MultiChainToken {
  [chainId: number]: Token | undefined;
}
