import { useTranslation } from "react-i18next";

import { ModalNames } from "@/constants/modal-names";
import { useConfigState } from "@/state/config";

import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { TokenList } from "./token-list";

export const TokensModal = () => {
  const { t } = useTranslation();

  const open = useConfigState.useModals()[ModalNames.TokenSelector];
  const removeModal = useConfigState.useRemoveModal();

  return (
    <Dialog
      open={open}
      onOpenChange={() => removeModal(ModalNames.TokenSelector)}
    >
      <DialogContent>
        <DialogHeader className="flex flex-col space-y-1.5 text-left px-6 py-6">
          <h1 className="text-lg font-heading">{t("tokens.selectToken")}</h1>
        </DialogHeader>

        <TokenList />
      </DialogContent>
    </Dialog>
  );
};
