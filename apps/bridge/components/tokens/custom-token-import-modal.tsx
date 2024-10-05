import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Address } from "viem";

import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useMetadata } from "@/hooks/use-metadata";
import { useModal } from "@/hooks/use-modal";
import { useTrackEvent } from "@/services/ga";
import { useSettingsState } from "@/state/settings";
import { MultiChainToken, Token } from "@/types/token";
import { addressLink } from "@/utils/transaction-link";

import { L1_BASE_CHAINS } from "../network-icon";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent } from "../ui/dialog";
import { useCustomToken } from "./use-custom-token";

const CustomTokenImport = () => {
  const deployment = useDeployment();
  const { t } = useTranslation();
  const metadata = useMetadata();
  const trackEvent = useTrackEvent();

  const modal = useModal("CustomTokenImport");
  const customTokens = useSettingsState.useCustomTokens();
  const setCustomTokens = useSettingsState.useSetCustomTokens();

  const {
    name,
    symbol,
    decimals,
    OP_L1_BRIDGE,
    OP_L1_TOKEN,
    OP_L2_BRIDGE,
    ARB_L1_TOKEN,
    ARB_L2_GATEWAY,
    ARB_L1_GATEWAY,
  } = useCustomToken(modal.data);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const onSubmit = () => {
    let l1Token: Token | undefined;
    let l2Token: Token | undefined;

    if (OP_L1_BRIDGE && OP_L1_TOKEN && OP_L2_BRIDGE) {
      const opL1Token: Token = {
        address: OP_L1_TOKEN!,
        chainId: deployment!.l1.id,
        decimals: decimals!,
        name: name!,
        symbol: symbol!,
        logoURI: "",
        bridges: [deployment!.l2.id],
      };
      const opL2Token: Token = {
        address: modal.data as Address,
        chainId: deployment!.l2.id,
        decimals: decimals!,
        name: name!,
        symbol: symbol!,
        logoURI: "",
        bridges: [deployment!.l1.id],
      };
      l1Token = opL1Token;
      l2Token = opL2Token;
    }

    if (ARB_L1_TOKEN && ARB_L2_GATEWAY && ARB_L1_GATEWAY) {
      const arbL1Token: Token = {
        address: ARB_L1_TOKEN,
        chainId: deployment!.l1.id,
        decimals: decimals!,
        name: name!,
        symbol: symbol!,
        logoURI: "",
        bridges: [deployment!.l2.id],
      };
      const arbL2Token: Token = {
        address: modal.data as Address,
        chainId: deployment!.l2.id,
        decimals: decimals!,
        name: name!,
        symbol: symbol!,
        logoURI: "",
        bridges: [deployment!.l1.id],
      };
      l1Token = arbL1Token;
      l2Token = arbL2Token;
    }

    if (!l1Token || !l2Token) {
      return;
    }

    const token: MultiChainToken = {
      [deployment!.l1.id]: l1Token,
      [deployment!.l2.id]: l2Token,
    };

    trackEvent({
      event: "import-custom-token",
      l1: deployment!.l1.name,
      l2: deployment!.l2.name,
      l1Address: l1Token.address,
      l2Address: l2Token.address,
      name: l1Token.name,
    });

    setCustomTokens([...customTokens, token]);
    modal.close();
  };

  const l1Link = addressLink(
    OP_L1_TOKEN ?? ARB_L1_TOKEN ?? "0x",
    deployment?.l1
  );
  const l2Link = addressLink(modal.data as Address, deployment?.l2);

  const isL3 = !L1_BASE_CHAINS.includes(deployment?.l1.id ?? 0);

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <div className="p-6 pb-0">
          <h2 className="font-heading">{"Import token"}</h2>
        </div>
        <div className="p-6 pb-0">
          <div className="flex gap-2 items-center">
            <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 h-10 w-10 flex items-center justify-center">
              <span className="text-[10px]  font-heading text-muted-foreground leading-4 mt-0.5">
                {symbol?.substring(0, 3)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl  font-heading leading-4">{name}</h3>
              <p className="text-sm  font-heading text-muted-foreground leading-4">
                {symbol}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="border  rounded-[16px]">
            <div className="flex gap-4 p-4 border-b">
              <p className=" text-sm">{t("tokens.customImportCheck")}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="h-8 w-8"
              >
                <g clipPath="url(#clip0_995_5016)">
                  <path
                    d="M5.68325 4.28632C5.68325 4.02007 5.80325 3.87195 6.05263 3.87195C6.302 3.87195 6.42763 4.02007 6.42763 4.28632C6.42763 4.55257 6.15575 6.8982 6.09763 7.3407C6.092 7.39132 6.08075 7.44195 6.05263 7.44195C6.0245 7.44195 6.01325 7.40257 6.00763 7.3332C5.957 6.89632 5.68325 4.54132 5.68325 4.28445V4.28632ZM5.68325 9.40507C5.68325 9.20632 5.84825 9.04132 6.05263 9.04132C6.257 9.04132 6.41638 9.20632 6.41638 9.40507C6.41638 9.60382 6.25138 9.77445 6.05263 9.77445C5.85388 9.77445 5.68325 9.60945 5.68325 9.40507ZM1.2545 11.4038H10.8414C11.5801 11.4038 11.9364 10.8188 11.5914 10.1832L6.77263 1.28257C6.38638 0.573823 5.72825 0.573823 5.342 1.27695L0.506377 10.1776C0.165127 10.8132 0.517627 11.4038 1.25638 11.4038H1.2545Z"
                    fill="#F97316"
                  />
                  <path
                    d="M5.00074 4.28625C5.00074 4.58625 5.29512 6.94313 5.37012 7.4475C5.43199 7.87875 5.70012 8.1225 6.05074 8.1225C6.42574 8.1225 6.66387 7.845 6.72574 7.4475C6.85137 6.66375 7.10637 4.58625 7.10637 4.28625C7.10637 3.72375 6.67512 3.19125 6.05074 3.19125C5.42637 3.19125 5.00074 3.73125 5.00074 4.28625ZM6.05637 10.4606C6.63012 10.4606 7.10074 9.99 7.10074 9.39938C7.10074 8.80875 6.63012 8.355 6.05637 8.355C5.48262 8.355 4.99512 8.82563 4.99512 9.39938C4.99512 9.97313 5.46574 10.4606 6.05637 10.4606Z"
                    fill="#FFEDD5"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_995_5016">
                    <rect
                      width="11.3494"
                      height="10.6537"
                      fill="white"
                      transform="translate(0.375 0.75)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="p-4 border-b">
              <div className="flex justify-between">
                <h4 className=" text-sm">
                  {t(
                    isL3 ? "tokens.customL2Address" : "tokens.customL1Address"
                  )}
                </h4>
                <a
                  target="_blank"
                  href={l1Link.link}
                  className={`text-xs   leading-3 rounded-full px-2 py-1 hover:scale-105 transition-all `}
                >
                  {l1Link.name} →
                </a>
              </div>
              <span className=" text-xs text-muted-foreground break-words leading-3">
                {OP_L1_TOKEN ?? ARB_L1_TOKEN}
              </span>
            </div>
            <div className="p-4">
              <div className="flex justify-between">
                <h4 className=" text-sm">
                  {t(
                    isL3 ? "tokens.customL3Address" : "tokens.customL2Address"
                  )}
                </h4>
                <a
                  target="_blank"
                  href={l2Link.link}
                  className={`text-xs   leading-3 rounded-full px-2 py-1 hover:scale-105 transition-all `}
                >
                  {l2Link.name} →
                </a>
              </div>
              <span className=" text-xs text-muted-foreground break-words leading-3">
                {modal.data}
              </span>
            </div>
          </div>
          <div className="flex gap-2 py-4">
            <Checkbox
              checked={disclaimerChecked}
              onCheckedChange={(v) => setDisclaimerChecked(v as boolean)}
              id="importAgree"
            />
            <label
              htmlFor="importAgree"
              className="text-[11px] text-muted-foreground "
            >
              {t("customTokenLists.disclaimer", { app: metadata.head.title })}
            </label>
          </div>

          <Button onClick={onSubmit} disabled={!disclaimerChecked}>
            {t("tokens.import")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const CustomTokenImportModal = () => {
  const modal = useModal("CustomTokenImport");

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <CustomTokenImport />
      </DialogContent>
    </Dialog>
  );
};
