import { FromTo } from "./FromTo";
import { BridgeButton } from "./bridge-button";
import { ConfirmationModalV2 } from "./confirmation-modal-v2";
import { LineItems } from "./line-items";
import { Modals } from "./modals";
import { TokenInput } from "./token-input";

export const BridgeBody = () => {
  return (
    <>
      <div className="flex flex-col gap-4 px-4 pb-4">
        <ConfirmationModalV2 />

        <div className="flex flex-col gap-1">
          <FromTo />
          <TokenInput />
        </div>

        <LineItems />

        <BridgeButton />
      </div>

      <Modals />
    </>
  );
};
