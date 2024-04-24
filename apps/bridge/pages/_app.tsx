import "../styles/base.css";

import "@/services/i18n";
import "@/services/sentry";

import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";

export default function CustomApp(appProps: AppProps) {
  return (
    <>
      <appProps.Component
        {...appProps.pageProps}
        key={appProps.router.asPath}
      />
      <Analytics />
    </>
  );
}
