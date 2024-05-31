import { Chain } from "viem";

import { ChainDto } from "@/codegen/model";

export interface AcrossDomain {
  chain: Chain | ChainDto;
  spokePool: string;
}
