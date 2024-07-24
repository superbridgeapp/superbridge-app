import { Token } from "@/types/token";
import {
  isArbitrumToken,
  isCctpToken,
  isHyperlaneToken,
  isOptimismToken,
} from "@/utils/guards";

export function isBridgeable(a: Token, b: Token) {
  if (isCctpToken(a) && isCctpToken(b)) {
    return true;
  }

  if (isOptimismToken(a) && isOptimismToken(b)) {
    return (
      !!a.standardBridgeAddresses[b.chainId] &&
      !!b.standardBridgeAddresses[a.chainId]
    );
  }

  if (isArbitrumToken(a) && isArbitrumToken(b)) {
    return (
      !!a.arbitrumBridgeInfo[b.chainId] && !!b.arbitrumBridgeInfo[a.chainId]
    );
  }

  if (isHyperlaneToken(a) && isHyperlaneToken(b)) {
    return true;
  }

  return false;
}
