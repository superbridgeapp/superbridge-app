import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";

import { isSuperbridge } from "@/config/superbridge";
import { useDeployment } from "@/hooks/use-deployment";
import { useMetadata } from "@/hooks/use-metadata";
import { useSettingsState } from "@/state/settings";

import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { useConfigState } from "@/state/config";

export const LegalModal = () => {
  const { t } = useTranslation();
  const open = useConfigState.useLegalModal();
  const setOpen = useConfigState.useSetLegalModal();
  const deployment = useDeployment();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex flex-col gap-6 p-6 pt-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl tracking-tight">
              {t("legal.title")}
            </h1>
          </div>

          {deployment?.tos?.customTermsOfService && (
            <div>
              <a href={deployment.tos.customTermsOfService} target="_blank">
                {t("legal.dedicatedTerms", { name: deployment.displayName })}
              </a>
            </div>
          )}

          {deployment?.tos?.customTermsOfService && (
            <div>
              <a href={deployment.tos.customTermsOfService} target="_blank">
                {t("legal.dedicatedPrivacy", { name: deployment.displayName })}
              </a>
            </div>
          )}

          <div>
            <Link href={"/terms"} target="_blank">
              {t("legal.superbridgeTerms")}
            </Link>
          </div>
          <div>
            <Link href={"/privacy"} target="_blank">
              {t("legal.superbridgePrivacy")}
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
