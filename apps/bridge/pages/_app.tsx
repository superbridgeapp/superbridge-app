import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";

import "@/services/i18n";
import "@/services/sentry";

import "../styles/base.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />

      <Analytics />
    </>
  );
}
