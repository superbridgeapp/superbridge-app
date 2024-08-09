import { LinkDto } from "@/codegen/model";

import { FrontendThemeDto } from "./theme";

export type AppConfig = {
  head: {
    name: string;
    description: string;
    og: string;
    favicon: string;
  };

  theme: FrontendThemeDto;

  images: {
    logoLight: string;
    logoLightSmall: string;

    logoDark: string;
    logoDarkSmall: string;
  };

  links: LinkDto[];
};
