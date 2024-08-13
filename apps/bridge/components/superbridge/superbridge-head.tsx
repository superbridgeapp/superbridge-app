import NextHead from "next/head";

import {
  defaultBodyFont,
  defaultButtonFont,
  defaultHeadingFont,
} from "@/config/fonts";

export const SuperbridgeHead = ({
  title,
  description,
  og,
  icon,

  headingFont,
  buttonFont,
  bodyFont,
}: {
  title: string;
  description: string;
  og: string;
  icon: string;

  headingFont?: string;
  buttonFont?: string;
  bodyFont?: string;
}) => {
  const fonts = `
@font-face {
  font-family: sb-heading;
  src: url(${headingFont || defaultHeadingFont});
}
@font-face {
  font-family: sb-button;
  src: url(${buttonFont || defaultButtonFont});
}
@font-face {
  font-family: sb-body;
  src: url(${bodyFont || defaultBodyFont});
}`;

  return (
    <NextHead>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta property="og:title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`https://superbridge.app`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image" content={og} />
      <meta name="twitter:image" content={og} />
      <meta name="twitter:creator" content="@superbridgeapp" />
      <meta name="twitter:site" content="@superbridgeapp" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      <link rel="shortcut icon" href={icon} />
      <link rel="icon" href={icon} />
      <link rel="apple-touch-icon" href={icon} />
      <link rel="apple-touch-icon-precomposed" href={icon} />

      <style>{fonts}</style>
    </NextHead>
  );
};
