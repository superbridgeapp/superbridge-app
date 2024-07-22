import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

import { isSuperbridge } from "@/config/app";

export function Analytics() {
  return (
    <>
      <VercelAnalytics />
      {isSuperbridge && <GoogleAnalytics gaId="G-KN31CJ3PHL" />}
    </>
  );
}
