import { useTheme } from "next-themes";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { useDeployment } from "@/hooks/use-deployment";
import { useDeployments } from "@/hooks/use-deployments";

export const FastBridgeHeader = () => {
  const deployment = useDeployment();
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();

  const { deployments } = useDeployments();

  return (
    <div>
      <div className="flex items-center justify-between px-4 md:px-6 pt-3 md:pt-6 pb-2 md:pb-8">
        <>
          <div>
            <Image
              src={
                resolvedTheme === "dark"
                  ? deployment?.theme?.theme.imageSuperbridgeLogoDark ?? ""
                  : deployment?.theme?.theme.imageSuperbridgeLogo ?? ""
              }
              width={0}
              height={0}
              sizes="100vw"
              alt="network icon"
              className="pointer-events-none scale-[0.88] -ml-1 md:scale-100 md:ml-0 h-8 w-auto max-w-40"
            />
          </div>
        </>
      </div>
    </div>
  );
};
