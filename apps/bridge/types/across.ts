import {
  AcrossBridgeMetadataDto,
  AcrossBridgeDto as CodegenAcrossBridgeDto,
} from "@/codegen/model";

export interface AcrossBridgeDto extends CodegenAcrossBridgeDto {
  type: "across-bridge";
  metadata: AcrossBridgeMetadataDto;
}
