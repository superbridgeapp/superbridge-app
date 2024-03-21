import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env["NEXT_PUBLIC_SENTRY_DSN"],
  integrations: [],
});
