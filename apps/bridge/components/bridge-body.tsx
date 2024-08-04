import { FromTo } from "./FromTo";
import { BridgeButton } from "./bridge-button";
import { Modals } from "./modals";
import { RoutePreview } from "./route-preview";
import { TokenInput } from "./token-input";

export const BridgeBody = () => {
  return (
    <>
      <div className="flex flex-col gap-4 px-4 pb-4">
        <div className="flex flex-col gap-1">
          <FromTo />
          <TokenInput />
        </div>

        <RoutePreview />

        <BridgeButton />
      </div>

      <Modals />
    </>
  );
};
