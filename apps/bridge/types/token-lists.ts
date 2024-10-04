import { Address } from "viem";

import { SuperbridgeTokenListToken } from "./token";

export interface SuperchainToken {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  extensions: {
    optimismBridgeAddress?: string;
    baseBridgeAddress?: string;
    modeBridgeAddress?: string;
    pgnBridgeAddress?: string;
    metall2BridgeAddress?: string;
    opListId: string;
    opTokenId: string;
  };
}

export interface SuperchainTokenList {
  name: string;
  logoURI: string;
  keywords: string[];
  timestamp: string;
  tokens: SuperchainToken[];
}

export interface SuperbridgeTokenList {
  name: string;
  logoURI: string;
  keywords: string[];
  timestamp: string;
  tokens: SuperbridgeTokenListToken[];
}

export interface ArbitrumTokenListToken {
  chainId: number;
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  extensions: {
    bridgeInfo: {
      [x: string]:
        | {
            tokenAddress: Address;
            originBridgeAddress: Address;
            destBridgeAddress: Address;
          }
        | undefined;
    };
  };
}

export interface ArbitrumTokenList {
  name: string;
  logoURI: string;
  keywords: string[];
  timestamp: string;
  tokens: ArbitrumTokenListToken[];
}
