import clsx from "clsx";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

import { useIsSuperbridge } from "@/hooks/apps/use-is-superbridge";
import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useMetadata } from "@/hooks/use-metadata";
import { useModal } from "@/hooks/use-modal";
import { useSettingsState } from "@/state/settings";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { DocumentIcon, QuestionMark } from "./icons";

export const TosModal = () => {
  const { t } = useTranslation();
  const dismiss = useSettingsState.useDismissTos();
  const hasViewedTos = useSettingsState.useHasViewedTos();
  const legalModal = useModal("Legal");
  const metadata = useMetadata();
  const deployment = useDeployment();
  const isSuperbridge = useIsSuperbridge();

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

  const ScrollArrow = () => (
    <div className="absolute inset-0 -top-12 grow flex justify-center">
      <div className="flex items-center justify-center bg-muted w-8 h-8 rounded-full animate-bounce ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="w-3 h-auto fill-foreground"
        >
          <path d="M0.677124 7.00012C0.677124 7.29289 0.769797 7.5846 0.984631 7.81523L5.98478 13.4767C6.23121 13.7537 6.55451 14.0001 6.99998 14.0001C7.44544 14.0001 7.76874 13.7537 8.01517 13.4767L13.0153 7.81523C13.2312 7.5846 13.3228 7.29183 13.3228 7.00012C13.3228 6.32297 12.7689 5.76904 12.0917 5.76904C11.7379 5.76904 11.4146 5.907 11.1692 6.18396L8.23106 9.50652V1.2312C8.23106 0.554056 7.67712 0.00012207 6.99998 0.00012207C6.32283 0.00012207 5.76889 0.554056 5.76889 1.2312L5.76889 9.50757L2.83073 6.18502C2.5843 5.90805 2.26205 5.77009 1.90821 5.77009C1.23106 5.77009 0.677124 6.32403 0.677124 7.00118L0.677124 7.00012Z" />
        </svg>
      </div>
    </div>
  );

  const tab1 = (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl  text-center text-foreground">
          {t("tos.welcome", { name: metadata.head.name })}
        </h1>

        {!isSuperbridge && (
          <p className="text-xs font-heading text-muted-foreground text-center">
            {t("tos.poweredBy")}
          </p>
        )}
      </div>

      {/* <div className="flex gap-3">
        <SparkleIcon />
        <p className="text-sm ">
          <Trans
            i18nKey={isSuperbridge ? "tos.superbridge1" : "tos.dedicated1"}
            components={[<span key="name" className="underline" />]}
            values={{ name: deployment?.l2.name }}
          />
        </p>
      </div> */}

      {/* <div className="flex gap-3">
        <NoFundsIcon />
        <p className="text-sm ">{t("tos.superbridge2")}</p>
      </div> */}

      <div className="flex gap-3">
        <QuestionMark />
        <p className="text-sm ">
          <Trans
            i18nKey={"tos.superbridge3"}
            components={[
              <a
                href="https://superbridge.app/support"
                key="name"
                className="underline"
              />,
              // isSuperbridge ? (
              // ) : (
              //   <a
              //     href={`https://superbridge.app/support/${deployment?.name}`}
              //     key="name"
              //     className="underline"
              //     target="_blank"
              //   />
              // ),
            ]}
            values={{ name: deployment?.l2.name }}
          />
        </p>
      </div>

      <div className="flex gap-3">
        <DocumentIcon />
        <p className="text-sm ">
          <Trans
            i18nKey={"tos.superbridge4"}
            components={[
              <button
                onClick={() => legalModal.open()}
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

  const ForceReadScroll = ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);

    const { scrollYProgress } = useScroll({
      container: scrollRef,
    });

    useMotionValueEvent(scrollYProgress, "change", (latest: any) => {
      if (latest >= 0.8) {
        setScrolled(true);
      }
    });

    const scaleX = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001,
    });

    return (
      <div className="flex flex-col">
        <div className="flex items-start justify-start bg-muted h-1">
          <motion.div
            className="w-full bg-muted-foreground h-1 origin-top-left"
            style={{ scaleX }}
          />
        </div>
        <div
          ref={scrollRef}
          className="max-h-[320px] prose prose-sm prose-headings:font-heading dark:prose-invert overflow-y-scroll p-6"
        >
          <h1 className="text-lg font-heading text-foreground">{title}</h1>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div className="border-t border-muted p-6 relative">
          {!scrolled && <ScrollArrow />}
          <Button disabled={!scrolled} className="w-full" onClick={onNext}>
            {t("tos.agreeAndContinue")}
          </Button>
        </div>
      </div>
    );
  };

  const tabs = [{ name: "tab1", component: tab1 }];
  if (deployment?.tos?.forceReadTermsOfService) {
    tabs.push({
      name: "terms",
      component: (
        <ForceReadScroll
          title={t("tos.forceReadTerms")}
          content={deployment?.tos?.customTermsOfService ?? ""}
        />
      ),
    });
  }
  if (deployment?.tos?.forceReadPrivacyPolicy) {
    tabs.push({
      name: "privacy",
      component: (
        <ForceReadScroll
          title={t("tos.forceReadPrivacy")}
          content={deployment?.tos?.customPrivacyPolicy ?? ""}
        />
      ),
    });
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
                  key={tab.name}
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
        {tabs[activeIndex].component}
      </DialogContent>
    </Dialog>
  );
};
