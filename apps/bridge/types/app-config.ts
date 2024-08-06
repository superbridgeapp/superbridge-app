import { LinkDto, ThemeDto } from "@/codegen/model";

export type AppConfig = {
  head: {
    name: string;
    description: string;
    og: string;
    favicon: string;
  };

  theme: Partial<ThemeDto>;

  images: {
    logoLight: string;
    logoLightSmall: string;

    logoDark: string;
    logoDarkSmall: string;
  };

  links: LinkDto[];
};
