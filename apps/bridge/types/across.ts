import { Chain } from "viem";

import {
  AcrossBridgeDto as CodegenAcrossBridgeDto,
  AcrossBridgeMetadataDto,
  ChainDto,
} from "@/codegen/model";

export interface AcrossDomain {
  chain: Chain | ChainDto;
  spokePool: string;
}

export interface AcrossBridgeDto extends CodegenAcrossBridgeDto {
  type: "across-bridge";
  metadata: AcrossBridgeMetadataDto;
}
