import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Address } from "viem";

import { deploymentTheme } from "@/config/theme";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import {
  ArbitrumToken,
  MultiChainToken,
  OptimismToken,
  Token,
} from "@/types/token";
import { addressLink } from "@/utils/transaction-link";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent } from "../ui/dialog";
import { useCustomToken } from "./use-custom-token";

export const CustomTokenImportModal = () => {
  const deployment = useConfigState.useDeployment();
  const theme = deploymentTheme(deployment);
  const { t } = useTranslation();

  const open = useConfigState.useShowCustomTokenImportModal();
  const setOpen = useConfigState.useSetShowCustomTokenImportModal();
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
  } = useCustomToken(open as Address);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const onSubmit = () => {
    let l1Token: Token | undefined;
    let l2Token: Token | undefined;

    if (OP_L1_BRIDGE && OP_L1_TOKEN && OP_L2_BRIDGE) {
      const opL1Token: OptimismToken = {
        address: OP_L1_TOKEN!,
        chainId: deployment!.l1.id,
        decimals: decimals!,
        name: name!,
        symbol: symbol!,
        opTokenId: `custom-${symbol}`,
        logoURI: "",
        standardBridgeAddresses: {
          [deployment!.l2.id]: OP_L1_BRIDGE as Address,
        },
      };
      const opL2Token: OptimismToken = {
        address: open as Address,
        chainId: deployment!.l2.id,
        decimals: decimals!,
        name: name!,
        symbol: symbol!,
        opTokenId: `custom-${symbol}`,
        logoURI: "",
        standardBridgeAddresses: {
          [deployment!.l1.id]: OP_L2_BRIDGE,
        },
      };
      l1Token = opL1Token;
      l2Token = opL2Token;
    }

    if (ARB_L1_TOKEN && ARB_L2_GATEWAY && ARB_L1_GATEWAY) {
      const arbL1Token: ArbitrumToken = {
        address: ARB_L1_TOKEN,
        chainId: deployment!.l1.id,
        decimals: decimals!,
        name: name!,
        symbol: symbol!,
        logoURI: "",
        arbitrumBridgeInfo: {
          [deployment!.l2.id]: ARB_L1_GATEWAY as Address,
        },
      };
      const arbL2Token: ArbitrumToken = {
        address: open as Address,
        chainId: deployment!.l2.id,
        decimals: decimals!,
        name: name!,
        symbol: symbol!,
        logoURI: "",
        arbitrumBridgeInfo: {
          [deployment!.l1.id]: ARB_L2_GATEWAY,
        },
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

    setCustomTokens([...customTokens, token]);
    setOpen(false);
  };

  const l1Link = addressLink(
    OP_L1_TOKEN ?? ARB_L1_TOKEN ?? "0x",
    deployment?.l1
  );
  const l2Link = addressLink(open as Address, deployment?.l2);

  return (
    <Dialog open={!!open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <h2 className="font-bold p-6 pb-0">{"Import token"}</h2>

        <div className="flex flex-col p-4">
          <div>
            <div>{name}</div>
            <div>{symbol}</div>
          </div>

          <div>
            Make sure you have checked the token address and that it is correct:
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div>L1 address</div>
              <a href={l1Link.link} className="bg-zinc-100 rounded-full">
                {l1Link.name}
              </a>
            </div>
            {OP_L1_TOKEN ?? ARB_L1_TOKEN}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div>L2 address</div>
              <a href={l2Link.link} className="bg-zinc-100 rounded-full">
                {l2Link.name}
              </a>
            </div>
            {open}
          </div>
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
