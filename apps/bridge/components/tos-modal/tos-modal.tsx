import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

import { isSuperbridge } from "@/config/superbridge";
import { useDeployment } from "@/hooks/use-deployment";
import { useMetadata } from "@/hooks/use-metadata";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { DocumentIcon, QuestionMark, NoFundsIcon, SparkleIcon } from "./icons";

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
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl tracking-tighter text-center text-foreground">
          {t("tos.welcome", { name: metadata.title })}
        </h1>

        {!isSuperbridge && (
          <p className="text-xs font-bold text-muted-foreground text-center">
            {t("tos.poweredBy")}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <SparkleIcon />
        <p className="text-sm font-medium">
          <Trans
            i18nKey={isSuperbridge ? "tos.superbridge1" : "tos.dedicated1"}
            components={[<span key="name" className="underline" />]}
            values={{ name: deployment?.l2.name }}
          />
        </p>
      </div>

      <div className="flex gap-3">
        <NoFundsIcon />
        <p className="text-sm font-medium">{t("tos.superbridge2")}</p>
      </div>

      <div className="flex gap-3">
        <QuestionMark />
        <p className="text-sm font-medium">
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
        <p className="text-sm font-medium">
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

  const Terms = () => {
    const [scrolled, setScrolled] = useState(false);
    const handleScroll = (e: any) => {
      const bottom =
        Math.abs(
          e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
        ) < 1;
      if (bottom) {
        setScrolled(true);
      }
    };

    const onClick = () => {
      if (!scrolled) return;
      onNext();
    };
    return (
      <div className="flex flex-col">
        <div
          className="max-h-[320px] prose prose-sm prose-headings:font-bold dark:prose-invert overflow-y-scroll p-6"
          onScroll={handleScroll}
        >
          <h1 className="text-lg font-bold text-foreground">
            {t("tos.forceReadTerms")}
          </h1>
          <ReactMarkdown>{deployment?.tos?.customTermsOfService}</ReactMarkdown>
        </div>
        <div className="border-t border-muted p-6">
          <Button disabled={!scrolled} className="w-full" onClick={onClick}>
            {t("tos.agreeAndContinue")}
          </Button>
        </div>
      </div>
    );
  };
  const Privacy = () => {
    const [scrolled, setScrolled] = useState(false);
    const handleScroll = (e: any) => {
      const bottom =
        Math.abs(
          e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
        ) < 1;
      if (bottom) {
        setScrolled(true);
      }
    };

    const onClick = () => {
      if (!scrolled) return;
      onNext();
    };
    return (
      <div className="flex flex-col">
        <div
          onScroll={handleScroll}
          className="max-h-[320px] prose prose-sm prose-headings:font-bold dark:prose-invert overflow-y-scroll p-6"
        >
          <h1 className="text-lg font-bold text-foreground">
            {t("tos.forceReadPrivacy")}
          </h1>
          <ReactMarkdown>{deployment?.tos?.customPrivacyPolicy}</ReactMarkdown>
        </div>
        <div className="border-t border-muted p-6">
          <Button disabled={!scrolled} className="w-full" onClick={onClick}>
            {t("tos.agreeAndContinue")}
          </Button>
        </div>
      </div>
    );
  };

  const tabs = [tab1];
  if (deployment?.tos?.forceReadTermsOfService) {
    tabs.push(<Terms />);
  }
  if (deployment?.tos?.forceReadPrivacyPolicy) {
    tabs.push(<Privacy />);
  }

  return (
    <Dialog open={!hasViewedTos} onOpenChange={() => {}}>
      <DialogContent
        hideCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {tabs.length > 1 && (
          <div className="flex justify-between items center p-4 border-b border-muted">
            <div className="w-10 h-10 shrink-0">
              {/* back button */}
              {activeIndex !== 0 && (
                <button
                  onClick={() => setActiveIndex((a) => a - 1)}
                  className="w-10 h-10 shrink-0 flex items-center justify-center bg-muted rounded-full hover:scale-105 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="w-3.5 h-3.5 fill-foreground"
                  >
                    <path d="M7 0.677246C6.70724 0.677246 6.41553 0.769919 6.1849 0.984753L0.523395 5.9849C0.246428 6.23133 0 6.55463 0 7.0001C0 7.44556 0.246428 7.76887 0.523395 8.01529L6.1849 13.0154C6.41553 13.2313 6.70829 13.323 7 13.323C7.67715 13.323 8.23108 12.769 8.23108 12.0919C8.23108 11.738 8.09312 11.4147 7.81616 11.1693L4.49361 8.23118H12.7689C13.4461 8.23118 14 7.67725 14 7.0001C14 6.32295 13.4461 5.76902 12.7689 5.76902H4.49255L7.8151 2.83085C8.09207 2.58442 8.23003 2.26217 8.23003 1.90833C8.23003 1.23118 7.67609 0.677246 6.99895 0.677246L7 0.677246Z" />
                  </svg>
                </button>
              )}
            </div>

            {/* tabs */}
            <div className="flex items-center gap-1 justify-center w-full">
              {tabs.map((tab, index) => (
                <div
                  className={clsx(
                    "w-10 h-1 rounded-full",
                    index === activeIndex ? "bg-primary" : "bg-muted"
                  )}
                ></div>
              ))}
            </div>
            <div className="w-10 h-10 shrink-0" />
          </div>
        )}
        {tabs[activeIndex]}
      </DialogContent>
    </Dialog>
  );
};
