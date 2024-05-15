import Link from "next/link";
import { useTranslation } from "react-i18next";

import { useDeployment } from "@/hooks/use-deployment";
import { useConfigState } from "@/state/config";

import { Dialog, DialogContent } from "./ui/dialog";

const ArrowIcon = () => (
  <div className="flex items-center justify-center w-6 h-5 bg-card rounded-full shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="6"
      viewBox="0 0 6 6"
      fill="none"
      className="w-3 h-auto fill-foreground"
    >
      <path d="M1.21165 1.21175C1.29446 1.12895 1.40318 1.07265 1.52917 1.06818L4.54474 0.881123C4.69278 0.872485 4.85392 0.894229 4.97992 1.02023C5.10592 1.14622 5.12766 1.30737 5.11902 1.4554L4.93196 4.47097C4.92779 4.59727 4.8709 4.70599 4.78839 4.7885C4.59687 4.98002 4.28352 4.98002 4.09199 4.7885C3.99191 4.68841 3.93948 4.55795 3.94842 4.41021L4.05714 2.63941L1.71653 4.98002C1.525 5.17155 1.21165 5.17155 1.02012 4.98002C0.828597 4.7885 0.828597 4.47514 1.02012 4.28362L3.36103 1.94271L1.59023 2.05143C1.4422 2.06007 1.31203 2.00794 1.21195 1.90786C1.02042 1.71633 1.02042 1.40298 1.21195 1.21145L1.21165 1.21175Z" />
    </svg>
  </div>
);

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
          <div className="flex flex-col gap-2">
            {deployment?.tos?.customTermsOfService && (
              <div>
                <Link
                  href={"/client-terms"}
                  target="_blank"
                  prefetch={false}
                  className="flex justify-between p-4 rounded-lg bg-muted font-bold text-sm hover:scale-105 transition-all"
                >
                  {t("legal.dedicatedTerms", { name: deployment.displayName })}
                  <ArrowIcon />
                </Link>
              </div>
            )}

            {deployment?.tos?.customTermsOfService && (
              <div>
                <Link
                  href={"/client-privacy"}
                  target="_blank"
                  prefetch={false}
                  className="flex justify-between p-4 rounded-lg bg-muted font-bold text-sm hover:scale-105 transition-all"
                >
                  {t("legal.dedicatedPrivacy", {
                    name: deployment.displayName,
                  })}
                  <ArrowIcon />
                </Link>
              </div>
            )}

            <div>
              <a
                href="https://superbridge.app/terms"
                target="_blank"
                className="flex justify-between p-4 rounded-lg bg-muted font-bold text-sm hover:scale-105 transition-all"
              >
                {t("legal.superbridgeTerms")}
                <ArrowIcon />
              </a>
            </div>
            {/* <div>
              <a
                href="https://superbridge.app/privacy"
                target="_blank"
                className="flex justify-between p-4 rounded-lg bg-muted font-bold text-sm hover:scale-105 transition-all"
              >
                {t("legal.superbridgePrivacy")}
                <ArrowIcon />
              </a>
            </div> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
