import NextHead from "next/head";

import { DeploymentDto } from "@/codegen/model";
import { isSuperbridge } from "@/config/superbridge";
import { useDeployment } from "@/hooks/use-deployment";

function useMetadata(deployment: DeploymentDto | null | undefined) {
  if (isSuperbridge) {
    return {
      title: `Superbridge`,
      description: `Bridge ETH and ERC20 tokens into and out of the Superchain`,
    };
  }

  return {
    title: `${deployment?.l2.name} Bridge`,
    description: `Bridge ETH and ERC20 tokens into and out of ${deployment?.l2.name}`,
  };
}

export function StatefulHead() {
  const deployment = useDeployment();
  return <StatelessHead deployment={deployment} />;
}

export function StatelessHead({
  deployment,
}: {
  deployment?: DeploymentDto | null;
}) {
  const metadata = useMetadata(deployment);

  const defaultOg = isSuperbridge
    ? "https://superbridge.app/og/superbridge-og-image.png"
    : "https://raw.githubusercontent.com/superbridgeapp/assets/main/rollies/og-rollies.png";
  const og = deployment?.theme?.theme.imageOg ?? defaultOg;

  const icon = isSuperbridge
    ? "/img/superbridge/favicon-32x32.png"
    : deployment?.theme?.theme.imageNetwork;

  const fonts = `
@font-face {
  font-family: sb-heading;
  src: url(${
    isSuperbridge
      ? "https://superbridge-fonts.vercel.app/GT-Maru-Bold.woff2"
      : deployment?.theme?.theme.fontHeading ||
        "https://superbridge-fonts.vercel.app/GT-Maru-Bold.woff2"
  });
}
@font-face {
  font-family: sb-button;
  src: url(${
    isSuperbridge
      ? "https://superbridge-fonts.vercel.app/GT-Maru-Bold.woff2"
      : deployment?.theme?.theme.fontButton ||
        "https://superbridge-fonts.vercel.app/GT-Maru-Bold.woff2"
  });
}
@font-face {
  font-family: sb-body;
  src: url(${
    isSuperbridge
      ? "https://superbridge-fonts.vercel.app/GT-Maru-Medium.woff2"
      : deployment?.theme?.theme.fontBody ||
        "https://superbridge-fonts.vercel.app/GT-Maru-Medium.woff2"
  });
}`;

  return (
    <NextHead>
      <title>{metadata.title}</title>
      <meta name="title" content={metadata.title} />
      <meta property="og:title" content={metadata.title} />
      <meta name="description" content={metadata.description} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:url" content={`https://superbridge.app`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={metadata.title} />
      <meta property="og:image" content={og} />
      <meta name="twitter:image" content={og} />
      <meta name="twitter:creator" content="@superbridgeapp" />
      <meta name="twitter:site" content="@superbridgeapp" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />

      <link rel="shortcut icon" href={icon} />
      <link rel="icon" href={icon} />
      <link rel="apple-touch-icon" href={icon} />
      <link rel="apple-touch-icon-precomposed" href={icon} />

      <style>{fonts}</style>
    </NextHead>
  );
}
