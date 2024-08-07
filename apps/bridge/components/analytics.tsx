import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

import { isSuperbridge } from "@/utils/is-superbridge";

export function Analytics() {
  return (
    <>
      <VercelAnalytics />
      {typeof window !== "undefined" && isSuperbridge(window.location.host) && (
        <GoogleAnalytics gaId="G-KN31CJ3PHL" />
      )}
    </>
  );
}
