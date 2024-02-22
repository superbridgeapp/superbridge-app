import { useTranslation } from "react-i18next";

import { useBridgeControllerFiatPrices } from "@/codegen/index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { flagSymbolMap } from "@/constants/currency-symbol-map";
import { useSettingsState } from "@/state/settings";

import { Dialog, DialogContent } from "../ui/dialog";
import { TokenLists } from "./token-lists";
import { useConfigState } from "@/state/config";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

export interface SettingsModalProps {
  open: boolean;
  setOpen: (b: boolean) => void;
}

export const CustomTokenListModal = () => {
  const { t, i18n } = useTranslation();

  const tokenListOrOpen = useConfigState.useShowCustomTokenListModal();
  const setOpen = useConfigState.useSetShowCustomTokenListModal();

  const customTokenLists = useSettingsState.useCustomTokenLists();
  const setCustomTokenLists = useSettingsState.useSetCustomTokenLists();

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const onSubmit = () => {
    if (typeof tokenListOrOpen === "boolean") {
      // adding
      setCustomTokenLists([
        ...customTokenLists,
        { id: Math.random().toString(), name, url, enabled: true },
      ]);
    } else {
      // editing
      setCustomTokenLists(
        customTokenLists.map((x) =>
          x.id === tokenListOrOpen.id ? { ...x, name, url } : x
        )
      );
    }
    setOpen(false);
  };

  const onDelete = () => {
    if (typeof tokenListOrOpen === "boolean") {
      // can't delete new tokenList
      return;
    }
    setCustomTokenLists(
      customTokenLists.filter((x) => x.name !== tokenListOrOpen.name)
    );
    setOpen(false);
  };

  return (
    <Dialog open={!!tokenListOrOpen} onOpenChange={setOpen}>
      <DialogContent>
        <div className="">
          <h2 className="font-bold p-6 pb-0">{"Custom token list"}</h2>

          <div className="p-4 flex flex-col">
            <div>Name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} />

            <div>Token list URL</div>
            <input value={url} onChange={(e) => setUrl(e.target.value)} />

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

            <Button
              onClick={onSubmit}
              disabled={!name || !url || !disclaimerChecked}
            >
              Save list
            </Button>

            {typeof tokenListOrOpen !== "boolean" && (
              <Button
                onClick={onSubmit}
                disabled={!name || !url || !disclaimerChecked}
              >
                Delete list
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
