import "../styles/base.css";

import { AppProps } from "next/app";

import { Analytics } from "@/components/analytics";
import "@/services/i18n";
import "@/services/sentry";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />

      <Analytics />
    </>
  );
}
