import { AnimatePresence } from "framer-motion";

import { FromTo } from "./FromTo";
import { AnimateChangeInHeight } from "./animate-height";
import { BridgeButton } from "./bridge-button";
import { RoutePreview } from "./route-preview";
import { TokenInput } from "./token-input";

export const BridgeBody = () => {
  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <div className="flex flex-col gap-1">
        <FromTo />
        <TokenInput />
      </div>

      <AnimateChangeInHeight>
        <RoutePreview key={"route-preview"} />
      </AnimateChangeInHeight>

      <BridgeButton />
    </div>
  );
};
