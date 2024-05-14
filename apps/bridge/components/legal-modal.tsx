import Link from "next/link";
import { useTranslation } from "react-i18next";

import { useDeployment } from "@/hooks/use-deployment";
import { useConfigState } from "@/state/config";

import { Dialog, DialogContent } from "./ui/dialog";

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
              <Link href={"/client-terms"} target="_blank" prefetch={false}>
                {t("legal.dedicatedTerms", { name: deployment.displayName })}
              </Link>
            </div>
          )}

          {deployment?.tos?.customTermsOfService && (
            <div>
              <Link href={"/client-privacy"} target="_blank" prefetch={false}>
                {t("legal.dedicatedPrivacy", { name: deployment.displayName })}
              </Link>
            </div>
          )}

          <div>
            <a href="https://superbridge.app/terms" target="_blank">
              {t("legal.superbridgeTerms")}
            </a>
          </div>
          <div>
            <a href="https://superbridge.app/privacy" target="_blank">
              {t("legal.superbridgePrivacy")}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
