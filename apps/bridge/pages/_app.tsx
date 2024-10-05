import { AppProps } from "next/app";

import "@/services/i18n";
import "@/services/sentry";

import "../styles/base.css";

// @ts-expect-error
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
