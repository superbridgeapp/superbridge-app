import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isPresent } from "ts-is-present";
import { useDebounce } from "use-debounce";

import { Input } from "@/components/ui/input";
import { useMetadata } from "@/hooks/use-metadata";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { transformIntoOptimismToken } from "@/utils/token-list/transform-optimism-token";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent } from "../ui/dialog";

export interface SettingsModalProps {
  open: boolean;
  setOpen: (b: boolean) => void;
}

export const CustomTokenListModal = () => {
  const { t } = useTranslation();
  const metadata = useMetadata();

  const tokenListOrOpen = useConfigState.useShowCustomTokenListModal();
  const setOpen = useConfigState.useSetShowCustomTokenListModal();

  const customTokenLists = useSettingsState.useCustomTokenLists();
  const setCustomTokenLists = useSettingsState.useSetCustomTokenLists();

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [debouncedUrl] = useDebounce(url, 400);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const tokensImported = useQuery(
    ["custom tokens", debouncedUrl],
    async () => {
      const response = await fetch(debouncedUrl);
      const result = await response.json();

      return result.tokens
        .map((t: any) => transformIntoOptimismToken(t))
        .filter(isPresent).length;
    },
    { retry: false }
  );

  useEffect(() => {
    if (typeof tokenListOrOpen === "object") {
      setName(tokenListOrOpen.name);
      setUrl(tokenListOrOpen.url);
      setDisclaimerChecked(true);
    } else {
      setName("");
      setUrl("");
      setDisclaimerChecked(false);
    }
  }, [tokenListOrOpen]);

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
        <div className="p-6 pb-0">
          <h2 className="font-heading">{"Custom token list"}</h2>
        </div>
        <div className="p-6 pb-0 flex flex-col gap-4">
          <div>
            <label htmlFor="tokenListName" className="font-heading text-sm">
              {t("customTokenLists.name")}
            </label>
            <Input
              id="tokenListName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // className="bg-muted block w-full rounded-lg border-0 py-3 px-4 pr-10 text-sm  outline-none focus:ring-2 ring-inset ring-zinc-900/5 dark:ring-zinc-50/5 placeholder:text-muted-foreground sm:leading-6"
              placeholder={t("customTokenLists.namePlaceholder")}
            />
          </div>
          <div>
            <label htmlFor="tokenListURL" className="font-heading text-sm">
              {t("customTokenLists.url")}
            </label>
            <Input
              id="tokenListURL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              // className="bg-muted block w-full rounded-lg border-0 py-3 px-4 pr-10 text-sm  outline-none focus:ring-2 ring-inset ring-zinc-900/5 dark:ring-zinc-50/5 placeholder:text-muted-foreground sm:leading-6"
              placeholder={t("customTokenLists.urlPlaceholder")}
            />
            {debouncedUrl && tokensImported.isError && (
              <span className="py-2 text-red-500 text-xs">
                {t("customTokenLists.invalid")}
              </span>
            )}
            {tokensImported.data && (
              <span className="py-2 text-green-500 text-xs">
                {t("customTokenLists.loadedTokens", {
                  num: tokensImported.data,
                })}
              </span>
            )}
          </div>
        </div>
        <div className="p-6 pb-0">
          <div className="flex gap-2">
            <Checkbox
              id="tokenListAgree"
              checked={disclaimerChecked}
              onCheckedChange={(v) => setDisclaimerChecked(v as boolean)}
            />
            <label
              htmlFor="tokenListAgree"
              className="text-[11px] text-muted-foreground "
            >
              {t("customTokenLists.disclaimer", { app: metadata.title })}{" "}
              <a
                target="_blank"
                href="https://docs.rollbridge.app/custom-tokens"
              >
                {t("customTokenLists.learnMore")}
              </a>
            </label>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-2">
          <Button
            onClick={onSubmit}
            disabled={
              !name ||
              !url ||
              !disclaimerChecked ||
              typeof tokensImported.data !== "number"
            }
          >
            {t("customTokenLists.save")}
          </Button>

          {typeof tokenListOrOpen === "object" && (
            <Button
              onClick={onDelete}
              disabled={!name || !url || !disclaimerChecked}
            >
              {t("customTokenLists.delete")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
