import { Address, getAddress } from "viem";
import {
  base,
  baseSepolia,
  mainnet,
  metalL2,
  mode,
  modeTestnet,
  optimism,
  optimismSepolia,
  pgn,
  pgnTestnet,
  sepolia,
} from "viem/chains";

import { OptimismToken } from "@/types/token";
import { SuperchainToken } from "@/types/token-lists";

const IGNORED_BRIDGE_TOKENS = ["Eco", "dForce USD"];

export const transformIntoOptimismToken = (
  token: SuperchainToken
): OptimismToken | null => {
  // we do our own CCTP list
  if (token.extensions.opTokenId.includes("USDC")) {
    return null;
  }

  if (IGNORED_BRIDGE_TOKENS.includes(token.name)) {
    return null;
  }

  if (token.name.includes("Synthetix") && token.chainId === optimism.id) {
    return null;
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
    if (t.chainId === sepolia.id) {
      t.standardBridgeAddresses[baseSepolia.id] = token.extensions
        .baseBridgeAddress as Address;
    }
    if (t.chainId === base.id) {
      t.standardBridgeAddresses[mainnet.id] = token.extensions
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
    if (t.chainId === sepolia.id) {
      t.standardBridgeAddresses[optimismSepolia.id] = token.extensions
        .optimismBridgeAddress as Address;
    }
    if (t.chainId === optimism.id) {
      t.standardBridgeAddresses[mainnet.id] = token.extensions
        .optimismBridgeAddress as Address;
    }
    if (t.chainId === optimismSepolia.id) {
      t.standardBridgeAddresses[sepolia.id] = token.extensions
        .optimismBridgeAddress as Address;
    }
  }

  if (token.extensions.modeBridgeAddress) {
    if (t.chainId === mainnet.id) {
      t.standardBridgeAddresses[mode.id] = token.extensions
        .modeBridgeAddress as Address;
    }
    if (t.chainId === sepolia.id) {
      t.standardBridgeAddresses[modeTestnet.id] = token.extensions
        .modeBridgeAddress as Address;
    }
    if (t.chainId === mode.id) {
      t.standardBridgeAddresses[mainnet.id] = token.extensions
        .modeBridgeAddress as Address;
    }
    if (t.chainId === modeTestnet.id) {
      t.standardBridgeAddresses[sepolia.id] = token.extensions
        .modeBridgeAddress as Address;
    }
  }

  if (token.extensions.pgnBridgeAddress) {
    if (t.chainId === mainnet.id) {
      t.standardBridgeAddresses[pgn.id] = token.extensions
        .pgnBridgeAddress as Address;
    }
    if (t.chainId === sepolia.id) {
      t.standardBridgeAddresses[pgnTestnet.id] = token.extensions
        .pgnBridgeAddress as Address;
    }
    if (t.chainId === pgn.id) {
      t.standardBridgeAddresses[mainnet.id] = token.extensions
        .pgnBridgeAddress as Address;
    }
    if (t.chainId === pgnTestnet.id) {
      t.standardBridgeAddresses[sepolia.id] = token.extensions
        .pgnBridgeAddress as Address;
    }
  }

  if (token.extensions.metall2BridgeAddress) {
    if (t.chainId === mainnet.id) {
      t.standardBridgeAddresses[metalL2.id] = token.extensions
        .metall2BridgeAddress as Address;
    }
    if (t.chainId === metalL2.id) {
      t.standardBridgeAddresses[sepolia.id] = token.extensions
        .metall2BridgeAddress as Address;
    }
  }

  return t;
};
