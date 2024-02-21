import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { deploymentTheme } from "@/config/theme";
import { useConfigState } from "@/state/config";

import { Dialog, DialogContent } from "../ui/dialog";
import { useCustomToken } from "./use-custom-token";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { MultiChainToken, OptimismToken } from "@/types/token";
import { Address } from "viem";
import { useSettingsState } from "@/state/settings";

export const CustomTokenImportModal = () => {
  const deployment = useConfigState.useDeployment();
  const theme = deploymentTheme(deployment);
  const { t } = useTranslation();

  const open = useConfigState.useShowCustomTokenImportModal();
  const setOpen = useConfigState.useSetShowCustomTokenImportModal();
  const customTokens = useSettingsState.useCustomTokens();
  const setCustomTokens = useSettingsState.useSetCustomTokens();

  const { name, symbol, L1_TOKEN, decimals, L1_BRIDGE, L2_BRIDGE } =
    useCustomToken(open as Address);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const onSubmit = () => {
    const l1Token: OptimismToken = {
      address: L1_TOKEN!,
      chainId: deployment!.l1.id,
      decimals: decimals!,
      name: name!,
      symbol: symbol!,
      opTokenId: `custom-${symbol}`,
      logoURI: "",
      standardBridgeAddresses: {
        [deployment!.l2.id]: L1_BRIDGE!,
      },
    };
    const l2Token: OptimismToken = {
      address: open as Address,
      chainId: deployment!.l2.id,
      decimals: decimals!,
      name: name!,
      symbol: symbol!,
      opTokenId: `custom-${symbol}`,
      logoURI: "",
      standardBridgeAddresses: {
        [deployment!.l1.id]: L2_BRIDGE!,
      },
    };
    const token: MultiChainToken = {
      [deployment!.l1.id]: l1Token,
      [deployment!.l2.id]: l2Token,
    };

    setCustomTokens([...customTokens, token]);
    setOpen(false);
  };

  return (
    <Dialog open={!!open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <h2 className="font-bold p-6 pb-0">{"Import token"}</h2>

        <div className="flex flex-col p-4">
          <div>{name}</div>
          <div>{symbol}</div>

          <div>L1 address: {L1_TOKEN}</div>
          <div>L2 address: {open}</div>

          <div className="flex gap-2">
            <Checkbox
              checked={disclaimerChecked}
              onCheckedChange={(v) => setDisclaimerChecked(v as boolean)}
            />
            <div>
              Anyone can create any token, including fake versions of the
              existing tokens. Take due care. Some tokens and their technical
              parameters may be incompatible with Superbridge services. By
              importing this custom token list you acknowledge and accept the
              risks.Learn more about the risks.
            </div>
          </div>

          <Button onClick={onSubmit} disabled={!disclaimerChecked}>
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
