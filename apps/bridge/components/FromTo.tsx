import { useTranslation } from "react-i18next";

import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";

import { NetworkIcon } from "./network-icon";

export const FromTo = () => {
  const from = useFromChain();
  const to = useToChain();
  const deployment = useDeployment();
  const { t } = useTranslation();

  return (
    <div
      className={`border box-border relative flex items-start justify-between box-border p-3 py-4  rounded-[16px] relative`}
    >
      <div className="grow flex gap-2 items-start w-1/2 pr-3">
        <NetworkIcon
          chain={from}
          deployment={deployment}
          width={32}
          height={32}
          className="pointer-events-none"
        />
        <div>
          <span
            className={`text-muted-foreground text-xs font-medium leading-4 block `}
          >
            {t("from")}
          </span>
          <span
            className={`text-sm md:text-sm font-medium leading-4 block tracking-tight`}
            style={{ lineHeight: "1em" }}
          >
            {from?.name}
          </span>
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 256 256"
        className={`fill-muted-foreground absolute left-[50%] top-1/2 w-6 h-6 -translate-x-[50%] -translate-y-2/4 transparent`}
      >
        <path d="M224.49 136.49l-72 72a12 12 0 01-17-17L187 140H40a12 12 0 010-24h147l-51.49-51.52a12 12 0 0117-17l72 72a12 12 0 01-.02 17.01z"></path>
      </svg>

      <div className="grow flex gap-2 justify-end items-start w-1/2 pl-3">
        <div>
          <span
            className={`text-muted-foreground text-xs text-right font-medium leading-4 block `}
          >
            {t("to")}
          </span>
          <span
            className={`text-sm md:text-sm font-medium text-right leading-4 block tracking-tight`}
            style={{ lineHeight: "1.125em" }}
          >
            {to?.name}
          </span>
        </div>
        <NetworkIcon
          chain={to}
          deployment={deployment}
          width={32}
          height={32}
          className="pointer-events-none"
        />
      </div>
    </div>
  );
};
