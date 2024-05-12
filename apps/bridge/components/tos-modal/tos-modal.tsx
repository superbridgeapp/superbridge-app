import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";

import { isSuperbridge } from "@/config/superbridge";
import { useDeployment } from "@/hooks/use-deployment";
import { useMetadata } from "@/hooks/use-metadata";
import { useSettingsState } from "@/state/settings";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { DocumentIcon, QuestionMark } from "./icons";
import { useConfigState } from "@/state/config";

export const TosModal = () => {
  const { t } = useTranslation();
  const dismiss = useSettingsState.useDismissTos();
  const hasViewedTos = useSettingsState.useHasViewedTos();
  const setLegalModal = useConfigState.useSetLegalModal();
  const metadata = useMetadata();
  const deployment = useDeployment();

  return (
    <Dialog open={!hasViewedTos} onOpenChange={() => {}}>
      <DialogContent hideCloseButton>
        <div className="flex flex-col gap-6 p-6 pt-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl tracking-tight">
              {t("tos.welcome", { name: metadata.title })}
            </h1>

            <div>{!isSuperbridge && <div>{t("tos.poweredBy")}</div>}</div>
          </div>
          <div className="flex gap-3">
            <DocumentIcon />
            <p className="text-sm font-bold">
              <Trans
                i18nKey={isSuperbridge ? "tos.superbridge1" : "tos.dedicated1"}
                components={[<span key="name" className="font-bold" />]}
                values={{ name: deployment?.l2.name }}
              />
            </p>
          </div>

          <div className="flex gap-3">
            <DocumentIcon />
            <p className="text-sm font-bold">{t("tos.superbridge2")}</p>
          </div>

          <div className="flex gap-3">
            <QuestionMark />
            <p className="text-sm font-bold">
              <Trans
                i18nKey={"tos.superbridge3"}
                components={[
                  <Link href={"/support"} key="name" className="underline" />,
                ]}
                values={{ name: deployment?.l2.name }}
              />
            </p>
          </div>

          <div className="flex gap-3">
            <DocumentIcon />
            <p className="text-sm font-bold">
              <Trans
                i18nKey={"tos.superbridge4"}
                components={[
                  <button
                    onClick={() => setLegalModal(true)}
                    key="name"
                    className="underline"
                  />,
                ]}
                values={{ name: deployment?.l2.name }}
              />
            </p>
          </div>

          <Button onClick={dismiss}>{t("tos.agreeAndContinue")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
