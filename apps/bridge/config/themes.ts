import { FrontendThemeDto } from "@/types/theme";

import {
  defaultBodyFont,
  defaultButtonFont,
  defaultHeadingFont,
} from "./fonts";

export const superbridgeTheme: Partial<FrontendThemeDto> = {
  darkModeEnabled: true,

  background: "#A882FD",
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

export const renzoTheme: Partial<FrontendThemeDto> = {
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

  rainbowMode: "dark",
};

export const hyperlaneTheme: Partial<FrontendThemeDto> = {
  darkModeEnabled: false,
  rainbowMode: "dark",
  background: "#162A4A",
  muted: "rgba(255,255,255, 0.05)",
  foreground: "#ffffff",
  "muted-foreground": "#A1A1AA",
  primary: "#FFFFFF",
  "primary-foreground": "#000000",
  card: "rgba(0, 0, 0, .5)",
  border: "rgba(255,255,255, 0.1)",
  imageBackground: "/img/hyperlane/bg.svg",
  imageBackgroundDark: "/img/hyperlane/bg.svg",
  backgroundImageBlendMode: "normal",
  backgroundImagePosition: "bottom",
  backgroundImageSize: "cover",
  backgroundImageRepeat: "no-repeat",
  backgroundImageOpacity: "100",
};

export const usdcTheme: Partial<FrontendThemeDto> = {
  darkModeEnabled: false,
  rainbowMode: "dark",
  background: "#1B2543",
  muted: "rgba(153,195,255, 0.04)",
  foreground: "#ffffff",
  "muted-foreground": "#B2B7C8",
  primary: "#ffffff",
  // "primary-foreground": "#ffffff",
  "primary-foreground": "#0F1424",
  card: "rgba(16,22, 40, .666)",
  border: "rgba(110,160,230, 0.1)",
  fontBody: "https://usdc.superbridge.app/fonts/usdc/Inter-Medium.woff2",
  fontButton: "https://usdc.superbridge.app/fonts/usdc/Inter-SemiBold.woff2",
  fontHeading: "https://usdc.superbridge.app/fonts/usdc/Inter-SemiBold.woff2",
  imageBackground: "/img/usdc/bg.svg",
  imageBackgroundDark: "/img/usdc/bg.svg",
  backgroundImageBlendMode: "normal",
  backgroundImagePosition: "top",
  backgroundImageSize: "cover",
  backgroundImageRepeat: "no-repeat",
  backgroundImageOpacity: "12",
};

export const elixirTheme: Partial<FrontendThemeDto> = {
  darkModeEnabled: false,
  rainbowMode: "light",
  background: "#F3F3F3",
  muted: "#F3F3F3",
  foreground: "#020101",
  "muted-foreground": "#808080",
  primary: "#020101",
  "primary-foreground": "#ffffff",
  card: "#ffffff",
  border: "#F3F3F3",
  fontBody:
    "https://elixir.superbridge.app/fonts/elixir/MundialLight-00b6da05.otf",
  fontButton:
    "https://elixir.superbridge.app/fonts/elixir/MundialRegular-b828e325.otf",
  fontHeading:
    "https://elixir.superbridge.app/fonts/elixir/MundialRegular-b828e325.otf",
  imageBackground: "/img/elixir/bg.jpg",
  imageBackgroundDark: "/img/elixir/bg.jpg",
  backgroundImageBlendMode: "normal",
  backgroundImagePosition: "center",
  backgroundImageSize: "cover",
  backgroundImageRepeat: "no-repeat",
  backgroundImageOpacity: "100",
};

export const wbtcTheme: Partial<FrontendThemeDto> = {
  darkModeEnabled: false,
  rainbowMode: "dark",
  background: "#F3F3F3",
  muted: "rgba(134,65,146,0.1)",
  foreground: "#ffffff",
  "muted-foreground": "rgba(255,255,255,0.5)",
  primary: "#F09242",
  "primary-foreground": "#ffffff",
  card: "rgba(18,15,25,0.5)",
  border: "rgba(134,65,146,0.33)",
  fontBody: "https://usdc.superbridge.app/fonts/usdc/Inter-Medium.woff2",
  fontButton: "https://usdc.superbridge.app/fonts/usdc/Inter-SemiBold.woff2",
  fontHeading: "https://usdc.superbridge.app/fonts/usdc/Inter-SemiBold.woff2",
  imageBackground: "/img/wbtc/bg.svg",
  imageBackgroundDark: "/img/wbtc/bg.svg",
  backgroundImageBlendMode: "normal",
  backgroundImagePosition: "center",
  backgroundImageSize: "cover",
  backgroundImageRepeat: "no-repeat",
  backgroundImageOpacity: "100",
};

export const moltenTheme: Partial<FrontendThemeDto> = {
  darkModeEnabled: false,
  rainbowMode: "dark",
  background: "#000000",
  muted: "rgba(255,255,255,0.03)",
  foreground: "#ffffff",
  "muted-foreground": "rgba(255,255,255,0.5)",
  primary: "#F09242",
  "primary-dark": "rgba(255, 115, 26, 1)",
  "primary-foreground": "#ffffff",
  card: "#0d0f13",
  border: "rgba(255,255,255,0.03)",
  imageBackground: "/img/wbtc/bg.svg",
  imageBackgroundDark: "/img/wbtc/bg.svg",
  backgroundImageBlendMode: "normal",
  backgroundImagePosition: "center",
  backgroundImageSize: "cover",
  backgroundImageRepeat: "no-repeat",
  backgroundImageOpacity: "100",
};
