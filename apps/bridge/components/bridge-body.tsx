import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useIsWidget } from "@/hooks/use-is-widget";

import { FromTo } from "./FromTo";
import { AnimateChangeInHeight } from "./animate-height";
import { BridgeButton } from "./bridge-button";
import { IconSB } from "./icons";
import { RoutePreview } from "./route-preview";
import { TokenInput } from "./token-input";

export const BridgeBody = () => {
  const { t } = useTranslation();
  const isWidget = useIsWidget();
  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      <div className="flex flex-col gap-1.5">
        <FromTo />
        <TokenInput />
      </div>

      <AnimateChangeInHeight>
        <RoutePreview key={"route-preview"} />
      </AnimateChangeInHeight>
      <div className="flex flex-col pb-0.5">
        <BridgeButton />
      </div>
      {isWidget && (
        <div className="flex items-center justify-center p-3 h-auto w-full absolute bottom-0 left-0">
          <a
            href="https://superbridge.app/rollies"
            className="flex items-center justify-center gap-1 rounded-full bg-muted pl-1.5 pr-2.5 py-0.5 hover:scale-105 transition-all"
          >
            <IconSB className="w-5 h-auto" />
            <span className="text-[10px] leading-none">
              {t("poweredBy", { name: "Superbridge" })}
            </span>
          </a>
        </div>
      )}
    </div>
  );
};
