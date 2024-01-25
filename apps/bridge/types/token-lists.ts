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
