import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";

import { Input } from "@/components/ui/input";
import { useMetadata } from "@/hooks/use-metadata";
import { useModal } from "@/hooks/use-modal";
import { useSettingsState } from "@/state/settings";
import { SuperchainTokenList } from "@/types/token-lists";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";

export interface SettingsModalProps {
  open: boolean;
  setOpen: (b: boolean) => void;
}

export const CustomTokenListModal = () => {
  const { t } = useTranslation();
  const metadata = useMetadata();

  const modal = useModal("CustomTokenListImport");

  const customTokenLists = useSettingsState.useCustomTokenLists();
  const setCustomTokenLists = useSettingsState.useSetCustomTokenLists();

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [debouncedUrl] = useDebounce(url, 400);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const tokensImported = useQuery({
    queryKey: ["custom tokens", debouncedUrl],
    queryFn: async () => {
      const response = await fetch(debouncedUrl);
      if (response.status !== 200) {
        throw new Error("Invalid response");
      }

      const result: SuperchainTokenList | null = await response.json();
      return result?.tokens.length ?? 0;
    },
    retry: false,
    enabled: !!debouncedUrl,
  });

  const list = useMemo(
    () => customTokenLists.find((x) => x.id === modal.data),
    [customTokenLists, modal.data]
  );

  useEffect(() => {
    if (list) {
      setName(list.name);
      setUrl(list.url);
      setDisclaimerChecked(true);
    } else {
      setName("");
      setUrl("");
      setDisclaimerChecked(false);
    }
  }, [list]);

  const onSubmit = () => {
    if (list) {
      // editing
      setCustomTokenLists(
        customTokenLists.map((x) =>
          x.id === list.id ? { ...x, name, url } : x
        )
      );
    } else {
      // adding
      setCustomTokenLists([
        ...customTokenLists,
        { id: Math.random().toString(), name, url, enabled: true },
      ]);
    }
    modal.close();
  };

  const onDelete = () => {
    if (!list) {
      // can't delete new tokenList
      return;
    }

    setCustomTokenLists(customTokenLists.filter((x) => x.id !== list.id));
    modal.close();
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
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

            {tokensImported.isFetching ? (
              <div className="py-2">
                <Skeleton className="h-4 w-[88px]" />
              </div>
            ) : debouncedUrl && tokensImported.isError ? (
              tokensImported.isError && (
                <span className="py-2 text-red-500 text-xs">
                  {t("customTokenLists.invalid")}
                </span>
              )
            ) : debouncedUrl ? (
              <span className="py-2 text-green-500 text-xs">
                {t("customTokenLists.loadedTokens", {
                  num: tokensImported.data,
                })}
              </span>
            ) : (
              <></>
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
              {t("customTokenLists.disclaimer", { app: metadata.head.name })}{" "}
              <a
                target="_blank"
                href="https://docs.superbridge.app/custom-tokens"
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

          {!!list && (
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
