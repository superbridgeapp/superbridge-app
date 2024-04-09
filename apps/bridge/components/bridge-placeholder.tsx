import clsx from "clsx";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { DeploymentDto, DeploymentType } from "@/codegen/model";
import { deploymentTheme } from "@/config/theme";

export const BridgePlaceholder = ({
  deployment,
  comingSoon,
  newDeployment,
}: {
  deployment: Pick<DeploymentDto, "name" | "displayName" | "type">;
  comingSoon?: boolean;
  newDeployment?: boolean;
}) => {
  const theme = deploymentTheme(deployment);
  const { t } = useTranslation();
  return (
    <div
      className={`relative w-full h-full flex flex-col shrink-0 cursor-pointer overflow-hidden rounded-[21px] lg:rounded-[32px] shadow-sm ${theme.card.className}`}
    >
      {theme.card.overlay?.image ? (
        <Image
          src={theme.card.overlay.image}
          className={clsx("inset-0 z-0 absolute", theme.card.overlay.className)}
          alt={deployment.displayName}
          fill
          loading="eager"
          sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
        />
      ) : (
        <div
          className={clsx(
            "inset-0 z-0 absolute",
            theme.card.overlay?.className
          )}
        />
      )}
      <div className="flex gap-4 flex-col capitalize items-center justify-center px-3 md:px-6 grow w-full relative z-10">
        <Image
          src={theme.iconSrc}
          width={96}
          height={96}
          alt="Chain"
          className={`pointer-events-none w-16 h-16 md:w-24 md:h-24 ${
            comingSoon ? "opacity-100" : "opacity-100"
          }`}
        />
        <h2
          className={`text-sm text-center font-bold text-zinc-50 ${
            comingSoon ? "opacity-50" : "opacity-100"
          }`}
        >
          {deployment.displayName}
        </h2>
      </div>
      {/* coming soon */}
      {comingSoon && (
        <span className="text-[10px] font-medium inline-flex leading-none bg-black/30 text-white font-medium absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full px-2 py-1">
          {t("comingSoon")}
        </span>
      )}
      {!comingSoon && deployment.type === DeploymentType.testnet && (
        <span className="text-[10px] font-medium inline-flex leading-none bg-black/30 text-white font-medium absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full px-2 py-1">
          Testnet
        </span>
      )}
    </div>
  );
};
