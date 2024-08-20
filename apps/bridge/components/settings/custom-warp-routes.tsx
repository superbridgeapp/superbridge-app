import { useModal } from "@/hooks/use-modal";

import { Button } from "../ui/button";

export const CustomWarpRoutes = () => {
  const modal = useModal("CustomWarpRoutes");

  return (
    <div className="flex flex-col p-4 gap-3">
      <div className="flex items-center justify-between cursor-pointer">
        <div className="flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 18"
            fill="none"
            className="w-6 h-6"
          >
            <g clipPath="url(#clip0_1003_5967)">
              <path
                d="M0 0.992399V16.7759C0 17.3487 0.41958 17.7683 0.992399 17.7683H18.6768C19.2496 17.7683 19.4831 17.3816 19.6254 17.0058L23.9343 5.19915C24.1897 4.54606 23.6351 3.97324 22.9857 3.97324H19.5379V2.53572C19.5379 1.96291 19.1183 1.54333 18.5455 1.54333H9.59927V0.992399C9.59927 0.41958 9.17969 0 8.60687 0H0.992399C0.41958 0 0 0.41958 0 0.992399Z"
                fill="#CBCCBE"
              />
              <path
                d="M1.62359 16.4476L5.68805 5.30134H22.4895L18.4251 16.4476H1.62359ZM0 16.7796C0 17.3524 0.41958 17.772 0.992399 17.772H18.6768C19.2496 17.772 19.4831 17.3853 19.6254 17.0095L23.9343 5.20283C24.1897 4.54975 23.6351 3.97693 22.9857 3.97693H19.5379V2.53941C19.5379 1.96659 19.1183 1.54701 18.5455 1.54701H9.59927V0.996085C9.59927 0.423266 9.17969 0.00368572 8.60687 0.00368572H0.992399C0.41958 3.71953e-05 0 0.419618 0 0.992436V16.776V16.7796ZM4.48404 4.73947L1.32441 13.3974V1.32445H8.27121V2.09794C8.27121 2.52847 8.61417 2.87143 9.04469 2.87143H18.2134V3.97693H5.43265C4.85984 3.97693 4.62633 4.36367 4.48404 4.73947Z"
                fill="black"
              />
            </g>
            <defs>
              <clipPath id="clip0_1003_5967">
                <rect width="24" height="17.772" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <h3 className="font-heading text-sm">Custom warp routes</h3>
        </div>

        <Button onClick={() => modal.open()}>Edit</Button>
      </div>
    </div>
  );
};
