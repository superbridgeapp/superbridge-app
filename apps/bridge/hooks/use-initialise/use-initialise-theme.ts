import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { ThemeDto } from "@/codegen/model";
import {
  defaultBodyFont,
  defaultButtonFont,
  defaultHeadingFont,
} from "@/config/fonts";

import { useApp } from "../use-metadata";

async function refreshFonts(theme: ThemeDto) {
  const heading = new FontFace(
    "sb-heading",
    `url(${theme.fontHeading || defaultHeadingFont})`
  );
  const body = new FontFace(
    "sb-body",
    `url(${theme.fontBody || defaultBodyFont})`
  );
  const buttons = new FontFace(
    "sb-button",
    `url(${theme.fontButton || defaultButtonFont})`
  );

  const fonts = await Promise.all(
    [heading, body, buttons].map((f) => f.load())
  );
  document.fonts.clear();
  fonts.map((f) => {
    document.fonts.add(f);
  });
}

function updateTheme(theme: ThemeDto) {
  Object.entries(theme).forEach(([key, value]) => {
    if (!value || key.includes("font") || key.includes("image")) {
      return;
    }

    let formattedKey = `--${key}`;
    if (!key.includes("dark")) {
      formattedKey = `${formattedKey}-light`;
    }

    document.documentElement.style.setProperty(formattedKey, value);
  });
}

export const useInitialiseTheme = () => {
  const app = useApp();
  const router = useRouter();
  const [themeValues, setThemeValues] = useState<Partial<ThemeDto> | null>({
    ...app.theme,
    imageLogo: app.images.logoLight || app.theme.imageLogo,
    imageLogoDark: app.images.logoDark || app.theme.imageLogoDark,
  });

  useEffect(() => {
    if (app) {
      updateTheme(app.theme);
    }

    const theme = router.query.theme;
    if (theme) {
      try {
        const parsed: Partial<ThemeDto> = JSON.parse(
          router.query.theme as string
        );
        updateTheme(parsed);
      } catch {}
    }
  }, [app]);

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (e.data === "refresh") {
        window.location.reload();
      }

      if (e.data.theme) {
        updateTheme(e.data.theme as ThemeDto);
        setThemeValues(e.data.theme);
        refreshFonts(e.data.theme as ThemeDto);
      }
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  return themeValues;
};
