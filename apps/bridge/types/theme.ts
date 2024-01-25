import { StaticImageData } from "next/image";

export interface Theme {
  border: string;
  accentBg: string;
  accentText: string;
  bg: string;
  card: {
    className?: string;
    overlay?: {
      className?: string;
      image?: StaticImageData;
    };
  };
  bgMuted: string;
  screenBg: string;
  screenBgImg: string;
  fill: string;
  textColor: string;
  textColorMuted: string;
  logoSrc: string;
  logoSrcDark: string;

  logoWidth: number;
  logoHeight: number;
  iconSrc: string;
  navIconSrc: string;

  l1ChainIcon?: string;
  l2ChainIcon?: string;

  standaloneLogo?: string;
  standaloneLogoDark?: string;
}
