import "../styles/base.css";

import "@/services/i18n";

import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";
import Head from "next/head";

import { Layout } from "@/components/Layout";
import { Providers } from "@/components/Providers";
import { dedicatedDeployment } from "@/config/dedicated-deployment";
import { isSuperbridge } from "@/config/superbridge";
import { UNSTYLED_PAGES } from "@/constants/unstyled-pages";

export default function App(appProps: AppProps) {
  const title =
    dedicatedDeployment?.og.title ?? isSuperbridge
      ? "Superbridge App"
      : "Rollbridge App";
  const description =
    dedicatedDeployment?.og.description ?? isSuperbridge
      ? "Bridge ETH and ERC20 tokens into and out of the Superchain"
      : "Bridge ETH and ERC20 tokens into and out of Optimism OP Stack rollups and Arbitrum Nitro rollups";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
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
        <meta property="og:image:alt" content={title} />
        {dedicatedDeployment ? (
          <>
            <meta
              property="og:image"
              content={`https://superbridge.app/og/${dedicatedDeployment.name}-og-image.png`}
            />
            <meta
              name="twitter:image"
              content={`https://superbridge.app/og/${dedicatedDeployment.name}-og-image.png`}
            />
          </>
        ) : appProps.router.route !== "/[id]/[[...index]]" ? (
          <>
            <meta
              property="og:image"
              content={
                isSuperbridge
                  ? "https://superbridge.app/og/superbridge-og-image.png"
                  : "https://superbridge.app/og/rollbridge-og-image.png"
              }
            />
            <meta
              name="twitter:image"
              content={
                isSuperbridge
                  ? "https://superbridge.app/og/superbridge-og-image.png"
                  : "https://superbridge.app/og/rollbridge-og-image.png"
              }
            />
          </>
        ) : (
          <></>
        )}
        <meta name="twitter:creator" content="@superbridgeapp" />
        <meta name="twitter:site" content="@superbridgeapp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        <link
          rel="shortcut icon"
          href={
            dedicatedDeployment
              ? `/img/icon-${dedicatedDeployment.name}.svg`
              : isSuperbridge
              ? "/img/superbridge/favicon-32x32.png"
              : "/img/rollbridge/favicon-32x32.png"
          }
        />
        <link
          rel="icon"
          href={
            dedicatedDeployment
              ? `/img/icon-${dedicatedDeployment.name}.svg`
              : isSuperbridge
              ? "/img/superbridge/favicon-32x32.png"
              : "/img/rollbridge/favicon-32x32.png"
          }
        />
        <link
          rel="apple-touch-icon"
          href={
            isSuperbridge
              ? "/img/superbridge/apple-touch-icon.png"
              : "/img/rollbridge/apple-touch-icon.png"
          }
        />
        <link
          rel="apple-touch-icon-precomposed"
          href={
            isSuperbridge
              ? "/img/superbridge/apple-touch-icon.png"
              : "/img/rollbridge/apple-touch-icon.png"
          }
        />
      </Head>

      {UNSTYLED_PAGES.includes(appProps.router.pathname) ? (
        <appProps.Component
          {...appProps.pageProps}
          key={appProps.router.asPath}
        />
      ) : (
        <Providers>
          <Layout {...appProps} />
        </Providers>
      )}
      <Analytics />
    </>
  );
}
