import { Address, getAddress } from "viem";
import {
  base,
  baseGoerli,
  baseSepolia,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  optimismSepolia,
  sepolia,
} from "viem/chains";

import { OptimismToken } from "@/types/token";
import { SuperchainToken } from "@/types/token-lists";

const IGNORED_BRIDGE_TOKENS = ["Synthetix", "Eco", "dForce USD"];

export const transformIntoOptimismToken = (
  token: SuperchainToken
): OptimismToken | null => {
  // we do our CCTP list
  if (token.extensions.opTokenId.includes("USDC")) {
    return null;
  }

  if (IGNORED_BRIDGE_TOKENS.includes(token.name)) {
    return null;
  }

  // https://github.com/ethereum-optimism/ethereum-optimism.github.io/pull/630
  if (token.name === "Dai Stablecoin" && token.chainId === 1) {
    token.extensions.baseBridgeAddress =
      "0x3154Cf16ccdb4C6d922629664174b904d80F2C35";
  }
  if (token.name === "Tether USD" && token.chainId === 1) {
    // No Base deployment for USDT, and we manually add USDT for PGN
    delete token.extensions.baseBridgeAddress;
  }

  // https://github.com/ethereum-optimism/ethereum-optimism.github.io/pull/594 nobridge: true
  if (token.name === "Seamless") {
    if (token.chainId === 1) {
      token.extensions.baseBridgeAddress =
        "0x3154Cf16ccdb4C6d922629664174b904d80F2C35";
    }
    if (token.chainId === base.id) {
      token.extensions.baseBridgeAddress =
        "0x4200000000000000000000000000000000000010";
    }
  }

  const t: OptimismToken = {
    name: token.name,
    chainId: token.chainId,
    logoURI: token.logoURI,
    decimals: token.decimals,
    symbol: token.symbol,
    address: getAddress(token.address),
    opTokenId: token.extensions.opTokenId,
    standardBridgeAddresses: {},
  };

  if (token.extensions.baseBridgeAddress) {
    if (t.chainId === mainnet.id) {
      t.standardBridgeAddresses[base.id] = token.extensions
        .baseBridgeAddress as Address;
    }
    if (t.chainId === goerli.id) {
      t.standardBridgeAddresses[baseGoerli.id] = token.extensions
        .baseBridgeAddress as Address;
    }
    if (t.chainId === sepolia.id) {
      t.standardBridgeAddresses[baseSepolia.id] = token.extensions
        .baseBridgeAddress as Address;
    }
    if (t.chainId === base.id) {
      t.standardBridgeAddresses[mainnet.id] = token.extensions
        .baseBridgeAddress as Address;
    }
    if (t.chainId === baseGoerli.id) {
      t.standardBridgeAddresses[goerli.id] = token.extensions
        .baseBridgeAddress as Address;
    }
    if (t.chainId === baseSepolia.id) {
      t.standardBridgeAddresses[sepolia.id] = token.extensions
        .baseBridgeAddress as Address;
    }
  }

  if (token.extensions.optimismBridgeAddress) {
    if (t.chainId === mainnet.id) {
      t.standardBridgeAddresses[optimism.id] = token.extensions
        .optimismBridgeAddress as Address;
    }
    if (t.chainId === goerli.id) {
      t.standardBridgeAddresses[optimismGoerli.id] = token.extensions
        .optimismBridgeAddress as Address;
    }
    if (t.chainId === sepolia.id) {
      t.standardBridgeAddresses[optimismSepolia.id] = token.extensions
        .optimismBridgeAddress as Address;
    }
    if (t.chainId === optimism.id) {
      t.standardBridgeAddresses[mainnet.id] = token.extensions
        .optimismBridgeAddress as Address;
    }
    if (t.chainId === optimismGoerli.id) {
      t.standardBridgeAddresses[goerli.id] = token.extensions
        .optimismBridgeAddress as Address;
    }
    if (t.chainId === optimismSepolia.id) {
      t.standardBridgeAddresses[sepolia.id] = token.extensions
        .optimismBridgeAddress as Address;
    }
  }

  return t;
};
