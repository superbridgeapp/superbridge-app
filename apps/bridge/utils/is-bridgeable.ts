import { BridgeableTokenDto } from "@/codegen/model";

export function isBridgeable(a: BridgeableTokenDto, b: BridgeableTokenDto) {
  return a.bridges.includes(b.chainId) && b.bridges.includes(a.chainId);
}
