import { BridgeableTokenDto } from "@/codegen/model";

export type Token = BridgeableTokenDto;

export interface MultiChainToken {
  [chainId: number]: Token | undefined;
}
