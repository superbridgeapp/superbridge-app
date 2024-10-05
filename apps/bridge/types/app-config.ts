import { LinkDto, ThemeDto } from "@/codegen/model";

export type AppConfig = {
  head: {
    title: string;
    description: string;
    og: string;
    favicon: string;
  };

  theme: ThemeDto;

  links: LinkDto[];

  metadata: {
    gId: string;
  };
};
