import { LinkDto, ThemeDto, ToSDto } from "@/codegen/model";

export type AppConfig = {
  head: {
    title: string;
    description: string;
    og: string;
    favicon: string;
  };

  theme: ThemeDto;

  links: LinkDto[];
  tos: ToSDto | null;

  metadata: {
    gId: string;
  };
};
