import { BridgeConfigDto } from "@/codegen/model";
import { AppConfig } from "@/types/app-config";

export const parseApp = ({
  dto,
}: {
  dto: BridgeConfigDto;
  host: string;
  url: string;
}): AppConfig => {
  return {
    head: {
      title: dto.metadata.title ?? "",
      description: dto.metadata.description ?? "",
      favicon: dto.metadata.imageFavicon ?? "",
      og: dto.metadata.imageOg ?? "",
    },
    theme: dto.theme ?? {},
    links: dto.links,
    metadata: {
      gId: dto.metadata.googleAnalyticsId ?? "",
    },
  };
};
