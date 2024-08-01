import { ThemeDto } from "@/codegen/model";

import {
  defaultBodyFont,
  defaultButtonFont,
  defaultHeadingFont,
} from "./fonts";

export const superbridgeTheme: Partial<ThemeDto> = {
  darkModeEnabled: true,

  background: "hsl(282 100% 85%)",
  foreground: "hsl(240 10% 3.9%)",
  card: "hsl(0 0% 100%)",
  "card-foreground": "hsl(240 10% 3.9%)",
  popover: "hsl(0 0% 100%)",
  "popover-foreground": "hsl(240 10% 3.9%)",
  primary: "hsl(240 5.9% 10%)",
  "primary-foreground": "hsl(0 0% 98%)",
  secondary: "hsl(240 4.8% 95.9%)",
  "secondary-foreground": "hsl(240 5.9% 10%)",
  muted: "hsl(240 4.8% 95.9%)",
  "muted-foreground": "hsl(240 3.8% 46.1%)",
  accent: "hsl(240 4.8% 95.9%)",
  "accent-foreground": "hsl(240 5.9% 10%)",
  destructive: "hsl(0 84.2% 60.2%)",
  "destructive-foreground": "hsl(0 0% 98%)",
  border: "hsl(240 5.9% 90%)",
  input: "hsl(240 5.9% 90%)",
  ring: "hsl(240 5.9% 90%)",

  "background-dark": "hsl(240 6% 7%)",
  "foreground-dark": "hsl(0 0% 98%)",
  "card-dark": "hsla(0, 0%, 0%, 0.66)",
  "card-foreground-dark": "hsl(0 0% 98%)",
  "popover-dark": "hsl(240 10% 3.9%)",
  "popover-foreground-dark": "hsl(0 0% 98%)",
  "primary-dark": "hsl(0 0% 98%)",
  "primary-foreground-dark": "hsl(240 5.9% 10%)",
  "secondary-dark": "hsl(240 3.7% 15.9%)",
  "secondary-foreground-dark": "hsl(0 0% 98%)",
  "muted-dark": "hsla(0, 0%, 100%, 0.1)",
  "muted-foreground-dark": "hsl(240 5% 64.9%)",
  "accent-dark": "hsl(240 3.7% 15.9%)",
  "accent-foreground-dark": "hsl(0 0% 98%)",
  "destructive-dark": "hsl(0 62.8% 30.6%)",
  "destructive-foreground-dark": "hsl(0 0% 98%)",
  "border-dark": "hsla(0, 0%, 100%, 0.1)",
  "input-dark": "hsl(240 3.7% 15.9%)",
  "ring-dark": "hsl(240 4.9% 83.9%)",

  fontBody: defaultBodyFont,
  fontButton: defaultButtonFont,
  fontHeading: defaultHeadingFont,
};

export const renzoTheme: Partial<ThemeDto> = {
  darkModeEnabled: false,
  background: "#030411",
  muted: "rgba(255, 255, 255, 0.03)",
  foreground: "#ffffff",
  "muted-foreground": "rgba(141,142,175)",
  primary: "#C4FF61",
  "primary-foreground": "#040512",
  card: "rgba(19, 20, 35, .88)",
  border: "rgba(187, 227, 219, 0.1)",
  imageLogo: "/img/renzo/logo.svg",
  imageLogoDark: "/img/renzo/logo.svg",
  fontBody:
    "https://renzo.superbridge.app/fonts/renzo/SpaceGrotesk-Medium.woff2",
  fontButton:
    "https://renzo.superbridge.app/fonts/renzo/SpaceGrotesk-Bold.woff2",
  fontHeading:
    "https://renzo.superbridge.app/fonts/renzo/SpaceGrotesk-Bold.woff2",

  imageBackground: "/img/renzo/bg.jpg",
  imageBackgroundDark: "/img/renzo/bg.jpg",
  backgroundImageBlendMode: "normal",
  backgroundImagePosition: "bottom center",
  backgroundImageSize: "auto",
  backgroundImageRepeat: "no-repeat",
  backgroundImageOpacity: "70",
};
