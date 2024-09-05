import { useTranslation } from "react-i18next";

import { useModal } from "@/hooks/use-modal";

import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { TokenList } from "./token-list";

export const TokensModal = () => {
  const { t } = useTranslation();

  const modal = useModal("TokenSelector");

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent onOpenAutoFocus={(event: Event) => event.preventDefault()}>
        <DialogHeader className="flex flex-col space-y-1.5 text-left px-6 py-6">
          <h1 className="text-lg font-heading">{t("tokens.selectToken")}</h1>
        </DialogHeader>

        <TokenList />
      </DialogContent>
    </Dialog>
  );
};
