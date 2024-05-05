import "../styles/base.css";

import "@/services/i18n";
import "@/services/sentry";

import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />

      <Analytics />
    </>
  );
}
