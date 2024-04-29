import NextHead from "next/head";

import { DeploymentDto } from "@/codegen/model";
import { isSuperbridge } from "@/config/superbridge";
import { useDeployment } from "@/hooks/use-deployment";
import { useDeployments } from "@/hooks/use-deployments";

function useMetadata(deployments: DeploymentDto[]) {
  if (deployments.length === 1) {
    const [deployment] = deployments;

    return {
      title: `${deployment.displayName} Bridge`,
      description: `"Bridge ETH and ERC20 tokens into and out of ${deployment.displayName}`,
    };
  }

  return {
    title: `Superbridge`,
    description: `"Bridge ETH and ERC20 tokens into and out of the Superchain`,
  };
}

export function Head() {
  const deployment = useDeployment();
  const { deployments } = useDeployments();
  const metadata = useMetadata(deployments);

  const defaultOg = isSuperbridge
    ? "https://superbridge.app/og/superbridge-og-image.png"
    : "https://superbridge.app/og/rollbridge-og-image.png";
  const og = deployment?.theme?.theme.imageOg ?? defaultOg;

  const icon = isSuperbridge
    ? "/img/superbridge/favicon-32x32.png"
    : deployments[0].theme?.theme.imageNetwork;

  return (
    <NextHead>
      <title>{metadata.title}</title>
      <meta name="title" content={metadata.title} />
      <meta property="og:title" content={metadata.title} />
      <meta name="description" content={metadata.description} />
      <meta property="og:description" content={metadata.description} />
      <meta
        property="og:url"
        content={
          isSuperbridge
            ? `https://superbridge.app`
            : "https://app.rollbridge.app"
        }
      />
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
    </NextHead>
  );
}
