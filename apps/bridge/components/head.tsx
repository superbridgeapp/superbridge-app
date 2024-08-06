import NextHead from "next/head";

import { DeploymentDto } from "@/codegen/model";
import {
  defaultBodyFont,
  defaultButtonFont,
  defaultHeadingFont,
} from "@/config/fonts";
import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useMetadata } from "@/hooks/use-metadata";

export function StatefulHead() {
  const deployment = useDeployment();
  return <StatelessHead deployment={deployment} />;
}

export function StatelessHead({
  deployment,
}: {
  deployment?: DeploymentDto | null;
}) {
  const metadata = useMetadata();

  const fonts = `
@font-face {
  font-family: sb-heading;
  src: url(${metadata.theme.fontHeading || defaultHeadingFont});
}
@font-face {
  font-family: sb-button;
  src: url(${metadata.theme.fontButton || defaultButtonFont});
}
@font-face {
  font-family: sb-body;
  src: url(${metadata.theme.fontBody || defaultBodyFont});
}`;

  return (
    <NextHead>
      <title>{metadata.head.name}</title>
      <meta name="title" content={metadata.head.name} />
      <meta property="og:title" content={metadata.head.name} />
      <meta name="description" content={metadata.head.description} />
      <meta property="og:description" content={metadata.head.description} />
      <meta property="og:url" content={`https://superbridge.app`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={metadata.head.name} />
      <meta property="og:image" content={metadata.head.og} />
      <meta name="twitter:image" content={metadata.head.og} />
      <meta name="twitter:creator" content="@superbridgeapp" />
      <meta name="twitter:site" content="@superbridgeapp" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.head.name} />
      <meta name="twitter:description" content={metadata.head.description} />

      <link rel="shortcut icon" href={metadata.head.favicon} />
      <link rel="icon" href={metadata.head.favicon} />
      <link rel="apple-touch-icon" href={metadata.head.favicon} />
      <link rel="apple-touch-icon-precomposed" href={metadata.head.favicon} />

      <style>{fonts}</style>
    </NextHead>
  );
}
