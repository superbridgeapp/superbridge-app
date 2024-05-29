import { FastBridgeBody } from "./bridge-body";
import { FastBridgeHeader } from "./bridge-header";

export const FastBridge = () => {
  return (
    <main
      className="flex items-start justify-center w-screen h-screen fixed inset-0 overflow-y-auto overflow-x-hidden"
      key="bridgeMain"
    >
      <div className="w-full px-2 md:px-0  md:w-[420px] aspect-[3/4] relative mb-24 mt-16 md:mt-24 2xl:mt-32">
        <div className="flex flex-col gap-2 md:gap-2 items-center">
          <div
            className={`bg-card mx-auto rounded-[24px] md:rounded-[32px] shadow-sm w-full shrink-0 backdrop-blur-sm`}
          >
            <FastBridgeHeader />
            <FastBridgeBody />
          </div>
        </div>
      </div>
    </main>
  );
};
