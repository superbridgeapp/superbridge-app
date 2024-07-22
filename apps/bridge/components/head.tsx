import NextHead from "next/head";

import { DeploymentDto } from "@/codegen/model";
import { app } from "@/config/app";
import {
  defaultBodyFont,
  defaultButtonFont,
  defaultHeadingFont,
} from "@/config/fonts";
import { useDeployment } from "@/hooks/use-deployment";

function useMetadata(deployment: DeploymentDto | null | undefined) {
  if (app) {
    return {
      title: app.head.name,
      description: app.head.description,
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

  const og =
    app?.head.og ??
    deployment?.theme?.theme.imageOg ??
    "https://raw.githubusercontent.com/superbridgeapp/assets/main/rollies/og-rollies.png";

  const icon = app?.head.favicon ?? deployment?.theme?.theme.imageNetwork;

  const fonts = `
@font-face {
  font-family: sb-heading;
  src: url(${deployment?.theme?.theme.fontHeading || defaultHeadingFont});
}
@font-face {
  font-family: sb-button;
  src: url(${deployment?.theme?.theme.fontButton || defaultButtonFont});
}
@font-face {
  font-family: sb-body;
  src: url(${deployment?.theme?.theme.fontBody || defaultBodyFont});
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
