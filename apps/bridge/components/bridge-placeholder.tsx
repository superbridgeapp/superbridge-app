import clsx from "clsx";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { DeploymentDto, DeploymentType } from "@/codegen/model";
import { deploymentTheme } from "@/config/theme";

import { BadgeNew } from "./badges/new-badge";
import {
  CardPoweredByAlchemy,
  PoweredByAlchemy,
} from "./badges/powered-by-alchemy";
import {
  CardPoweredByAltLayer,
  PoweredByAltLayer,
} from "./badges/powered-by-alt-layer-badge";
import {
  CardPoweredByConduit,
  PoweredByConduit,
} from "./badges/powered-by-conduit-badge";

export const BridgePlaceholder = ({
  deployment,
  comingSoon,
  newDeployment,
}: {
  deployment: Pick<DeploymentDto, "name" | "displayName" | "type"> & {
    provider?: string | null;
  };
  comingSoon?: boolean;
  newDeployment?: boolean;
}) => {
  const theme = deploymentTheme(deployment);
  const { t } = useTranslation();
  return (
    <>
      <div
        className={`relative w-full h-full flex flex-col shrink-0 cursor-pointer overflow-hidden rounded-[21px] lg:rounded-[32px] shadow-sm ${theme.card.className}`}
      >
        {theme.card.overlay?.image ? (
          <Image
            src={theme.card.overlay.image}
            className={clsx(
              "inset-0 z-0 absolute",
              theme.card.overlay.className
            )}
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
            className={clsx(
              "text-sm text-center font-heading",
              comingSoon ? "opacity-50" : "opacity-100",
              theme.card.title ?? "text-zinc-50"
            )}
          >
            {deployment.displayName}
          </h2>
        </div>
        <div className="absolute bottom-0 w-full flex justify-center items-center gap-1.5 pb-4">
          {/* coming soon */}
          {!comingSoon && deployment.type === DeploymentType.testnet && (
            <span
              className={clsx(
                "text-[9px] flex items-center leading-none bg-white/10 rounded-full px-2 py-1",
                theme.card.title ?? "text-white/80"
              )}
            >
              Testnet
            </span>
          )}
          {comingSoon && (
            <span className="text-[9px] inline-flex leading-none bg-black/10 text-white rounded-full px-2 py-1">
              {t("comingSoon")}
            </span>
          )}
          {/* {deployment.provider === "conduit" && (
            <CardPoweredByConduit color={theme.card.title ?? "text-white"} />
          )}
          {deployment.provider === "alt-layer" && (
            <CardPoweredByAltLayer color={theme.card.title ?? "text-white"} />
          )}
          {deployment.name === "shape-testnet" && (
            <CardPoweredByAlchemy color={theme.card.title ?? "text-white"} />
          )} */}
        </div>
      </div>
      {newDeployment && (
        <BadgeNew className="absolute -top-1 -right-1.5 w-8 h-8" />
      )}
    </>
  );
};
