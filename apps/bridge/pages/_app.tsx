import "../styles/base.css";

import "@/services/i18n";
import "@/services/sentry";

import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";
import Head from "next/head";

import { Layout } from "@/components/Layout";
import { Providers } from "@/components/Providers";
import { dedicatedDeployment } from "@/config/dedicated-deployment";
import { isRollbridge, isSuperbridge } from "@/config/superbridge";
import * as metadata from "@/constants/metadata";
import { UNSTYLED_PAGES } from "@/constants/unstyled-pages";

export default function App(appProps: AppProps) {
  return (
    <>
      <Head>
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
        {dedicatedDeployment ? (
          <>
            <meta
              property="og:image"
              content={`https://superbridge.app/img/${
                dedicatedDeployment.name
              }/og${isRollbridge ? "-rb" : ""}.png`}
            />
            <meta
              name="twitter:image"
              content={`https://superbridge.app/img/${
                dedicatedDeployment.name
              }/og${isRollbridge ? "-rb" : ""}.png`}
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
          <>
            <meta
              property="og:image"
              content={`https://superbridge.app/img/${
                appProps.router.query.id
              }/og${isRollbridge ? "-rb" : ""}.png`}
            />
            <meta
              name="twitter:image"
              content={`https://superbridge.app/img/${
                appProps.router.query.id
              }/og${isRollbridge ? "-rb" : ""}.png`}
            />
          </>
        )}
        <meta name="twitter:creator" content="@superbridgeapp" />
        <meta name="twitter:site" content="@superbridgeapp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />

        <link
          rel="shortcut icon"
          href={
            dedicatedDeployment
              ? `/img/${dedicatedDeployment.name}/icon.svg`
              : isSuperbridge
              ? "/img/superbridge/favicon-32x32.png"
              : "/img/rollbridge/favicon-32x32.png"
          }
        />
        <link
          rel="icon"
          href={
            dedicatedDeployment
              ? `/img/${dedicatedDeployment.name}/icon.svg`
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
