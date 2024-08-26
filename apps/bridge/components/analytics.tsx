import { GoogleAnalytics } from "@next/third-parties/google";

import { useApp } from "@/hooks/use-metadata";

export function Analytics() {
  const metadata = useApp();
  return (
    <>
      {typeof window !== "undefined" && metadata.metadata.gId && (
        <GoogleAnalytics gaId={metadata.metadata.gId} />
      )}
    </>
  );
}
