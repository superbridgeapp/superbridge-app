import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { isSuperbridge } from "@/config/superbridge";
import { useDeployment } from "@/hooks/use-deployment";
import { useMetadata } from "@/hooks/use-metadata";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { DocumentIcon, QuestionMark } from "./icons";

export const TosModal = () => {
  const { t } = useTranslation();
  const dismiss = useSettingsState.useDismissTos();
  const hasViewedTos = useSettingsState.useHasViewedTos();
  const setLegalModal = useConfigState.useSetLegalModal();
  const metadata = useMetadata();
  const deployment = useDeployment();

  const [activeIndex, setActiveIndex] = useState(0);

  const onNext = () => {
    let doneIndex = 0;
    if (deployment?.tos?.forceReadPrivacyPolicy) {
      doneIndex++;
    }
    if (deployment?.tos?.forceReadTermsOfService) {
      doneIndex++;
    }

    if (activeIndex === doneIndex) {
      dismiss();
    } else {
      setActiveIndex((a) => a + 1);
    }
  };

  const tab1 = (
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
            components={[<span key="name" className="underline" />]}
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

      <Button onClick={onNext}>{t("tos.agreeAndContinue")}</Button>
    </div>
  );

  const terms = (
    <div>
      <div>{t("tos.forceReadTerms")}</div>
      <div>{deployment?.tos?.customTermsOfService}</div>
      <Button onClick={onNext}>{t("tos.agreeAndContinue")}</Button>
    </div>
  );
  const privacy = (
    <div>
      <div>{t("tos.forceReadPrivacy")}</div>
      <div>{deployment?.tos?.customPrivacyPolicy}</div>
      <Button onClick={onNext}>{t("tos.agreeAndContinue")}</Button>
    </div>
  );

  const tabs = [tab1];
  if (deployment?.tos?.forceReadTermsOfService) {
    tabs.push(terms);
  }
  if (deployment?.tos?.forceReadPrivacyPolicy) {
    tabs.push(privacy);
  }

  return (
    <Dialog open={!hasViewedTos} onOpenChange={() => {}}>
      <DialogContent hideCloseButton>
        {tabs.length > 1 && (
          <>
            {/* back button */}
            {activeIndex !== 0 && (
              <button
                className="absolute"
                onClick={() => setActiveIndex((a) => a - 1)}
              >
                Back button
              </button>
            )}

            {/* tabs */}
            <div className="flex items-center gap-2 mx-auto pt-10">
              {tabs.map((tab, index) => (
                <div
                  className={clsx(
                    "w-20 h-2",
                    index === activeIndex ? "bg-blue-500" : "bg-zinc-400"
                  )}
                ></div>
              ))}
            </div>
          </>
        )}

        {tabs[activeIndex]}
      </DialogContent>
    </Dialog>
  );
};
