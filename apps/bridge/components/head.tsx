import { useMetadata } from "@/hooks/use-metadata";

import { SuperbridgeHead } from "./superbridge/superbridge-head";

export function Head() {
  const metadata = useMetadata();

  return (
    <SuperbridgeHead
      title={metadata.head.name}
      description={metadata.head.description}
      og={metadata.head.og}
      icon={metadata.head.favicon}
      bodyFont={metadata.theme.fontBody}
      buttonFont={metadata.theme.fontButton}
      headingFont={metadata.theme.fontHeading}
    />
  );
}
