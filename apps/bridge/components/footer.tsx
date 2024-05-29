import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { LinkDto } from "@/codegen/model";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isSuperbridge } from "@/config/superbridge";
import { useDeployments } from "@/hooks/use-deployments";
import { useDarkModeEnabled } from "@/hooks/use-theme";
import { useConfigState } from "@/state/config";
import { Button } from "./ui/button";

export function Footer() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const deployments = useDeployments();
  const { t } = useTranslation();
  const setSettingsModal = useConfigState.useSetSettingsModal();
  const setLegalModal = useConfigState.useSetLegalModal();
  const darkModeEnabled = useDarkModeEnabled();

  useEffect(() => {
    setMounted(true);
  }, []);

  const links: (LinkDto | { onClick: () => void; label: string })[] =
    isSuperbridge
      ? [
          { url: "https://superbridge.app/support", label: t("support") },
          {
            onClick: () => setLegalModal(true),
            label: t("legal.footerButton"),
          },
          { url: "https://twitter.com/superbridgeapp", label: "x.com" },
        ]
      : [
          ...(deployments.deployments[0]?.theme?.links ?? []),
          {
            url:
              deployments.deployments[0].name === "gravity-mainnet"
                ? "https://discord.gg/GravityChain"
                : `https://superbridge.app/support/${deployments.deployments[0].name}`,
            label: t("support"),
          },
          {
            onClick: () => setLegalModal(true),
            label: t("legal.footerButton"),
          },
          { url: "https://rollbridge.app", label: "Powered by Superbridge" },
        ];

  return (
    <footer className="flex flex-row justify-between px-1.5 md:px-6 py-3 md:py-4 fixed bottom-0 left-0 w-screen z-50 bg-gradient-to-t from-zinc-950/40 md:from-transparent">
      {mounted && darkModeEnabled ? (
        <button
          onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
          className="bg-card rounded-full shadow-sm flex items-center py-2 px-3 border-black/[0.0125] dark:border-white/[0.0125]"
        >
          {/* light */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={
              resolvedTheme === "light"
                ? "fill-foreground transition-colors"
                : "fill-muted-foreground transition-colors"
            }
          >
            <g clipPath="url(#clip0_348_4866)">
              <path d="M17.33 11.993c0-.505.31-.824.804-.824h1.043c.496 0 .823.327.823.824 0 .496-.327.84-.823.84h-1.043c-.497 0-.803-.318-.803-.84zm-1.813-4.34c0-.24.062-.406.24-.584l.75-.733c.158-.178.327-.24.567-.24.24 0 .397.062.575.249.196.187.257.345.257.584 0 .24-.061.406-.24.584l-.732.724a.741.741 0 01-.584.24.75.75 0 01-.593-.248.718.718 0 01-.24-.576zm0 8.7c0-.24.07-.415.257-.593a.712.712 0 01.576-.24c.24 0 .406.062.584.24l.733.733c.178.178.24.344.24.584s-.062.397-.24.575c-.196.187-.362.257-.602.257s-.397-.061-.558-.24l-.75-.732a.741.741 0 01-.24-.584zM11.17 5.866V4.824c0-.497.327-.824.824-.824.496 0 .832.318.832.824v1.042c0 .496-.318.815-.832.815s-.824-.319-.824-.815zm0 13.313v-1.042c0-.497.319-.803.824-.803.505 0 .832.31.832.803v1.042c0 .506-.318.824-.832.824s-.824-.327-.824-.824zm-1.705-7.178A2.534 2.534 0 0012 14.54a2.534 2.534 0 002.538-2.538 2.534 2.534 0 00-2.538-2.537A2.534 2.534 0 009.464 12zm-1.16 0c0-2.093 1.6-3.694 3.694-3.694s3.703 1.6 3.703 3.694-1.6 3.694-3.703 3.694c-2.102 0-3.694-1.6-3.694-3.694zm-2.21-5.075c0-.24.061-.397.257-.584a.716.716 0 01.575-.248c.23 0 .397.07.575.248l.742.724c.178.178.24.345.24.584 0 .24-.062.397-.24.576a.75.75 0 01-.593.248.764.764 0 01-.584-.23l-.733-.734a.741.741 0 01-.24-.584zm0 10.148c0-.24.061-.406.24-.584l.732-.733a.741.741 0 01.584-.24c.24 0 .406.062.576.24a.747.747 0 01.257.593c0 .24-.062.406-.24.584l-.742.724c-.178.178-.344.248-.566.248-.24 0-.406-.07-.602-.257a.735.735 0 01-.24-.575zM4 11.993c0-.497.327-.824.824-.824h1.042c.496 0 .803.319.803.824 0 .505-.31.84-.803.84H4.824c-.497 0-.824-.326-.824-.84z"></path>
            </g>
            <defs>
              <clipPath id="clip0_348_4866">
                <path
                  fill="#fff"
                  d="M0 0H16V16H0z"
                  transform="translate(4 4)"
                ></path>
              </clipPath>
            </defs>
          </svg>
          {/* dark */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={
              resolvedTheme === "dark"
                ? "fill-foreground transition-colors"
                : "fill-muted-foreground transition-colors"
            }
          >
            <g clipPath="url(#clip0_348_4870)">
              <path d="M14.59 17.165a5.744 5.744 0 01-7.355-3.43 5.747 5.747 0 018.114-7.023.467.467 0 01-.114.866 3.07 3.07 0 00-.36.103 3.08 3.08 0 00-1.84 3.943 3.08 3.08 0 003.944 1.84c.105-.04.216-.089.343-.153a.468.468 0 01.644.59 5.764 5.764 0 01-3.376 3.264z"></path>
            </g>
            <defs>
              <clipPath id="clip0_348_4870">
                <path
                  fill="#fff"
                  d="M0 0H11.669V13H0z"
                  transform="rotate(-20 24.513 -8.232)"
                ></path>
              </clipPath>
            </defs>
          </svg>
        </button>
      ) : (
        <div />
      )}

      <div className="flex gap-3 items-center">
        {!mounted || deployments.isLoading ? (
          <></>
        ) : (
          <div className="bg-card h-10 pl-2.5 pr-3 gap-1 inline-flex items-center rounded-full transition-all border-black/[0.0125] dark:border-white/[0.0125]">
            <button
              className={`text-xs font-medium  transition-all hover:scale-105 inline-flex`}
              onClick={() => setSettingsModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-foreground"
              >
                <g clipPath="url(#clip0_905_121)">
                  <path d="M3 11.023c0-.3.094-.544.278-.737.187-.193.443-.308.772-.353l1.564-.184c.078-.208.175-.435.283-.685L4.92 7.82c-.215-.268-.32-.534-.32-.794 0-.244.087-.452.265-.63l1.452-1.452c.22-.22.474-.329.766-.329.245 0 .492.1.749.302l1.243.987c.3-.14.526-.239.677-.293l.184-1.572c.036-.335.148-.592.332-.773.187-.181.437-.269.754-.269h1.956c.317 0 .567.09.754.269.188.181.296.438.332.773l.184 1.572c.151.054.378.15.677.293l1.243-.987c.256-.202.504-.302.748-.302.293 0 .55.109.767.329l1.452 1.452a.87.87 0 01.265.63c0 .263-.105.529-.32.794l-.977 1.244c.108.25.205.477.283.685l1.564.184c.329.042.585.16.772.353.188.193.278.438.278.737v1.955c0 .299-.094.543-.278.737-.187.193-.443.308-.772.353l-1.555.184c-.042.12-.139.35-.292.685l.977 1.243c.215.269.32.535.32.794a.858.858 0 01-.265.631l-1.452 1.452c-.22.22-.474.329-.767.329-.244 0-.492-.1-.748-.302l-1.243-.987a9.389 9.389 0 01-.677.293l-.184 1.572c-.036.335-.148.592-.338.773-.19.18-.437.268-.748.268h-1.956c-.31 0-.561-.09-.748-.268-.19-.181-.302-.438-.338-.773l-.184-1.572a8.16 8.16 0 01-.677-.293l-1.243.987c-.257.202-.507.302-.748.302-.293 0-.55-.109-.767-.33l-1.452-1.451a.853.853 0 01-.265-.63c0-.263.105-.529.32-.795l.977-1.243c-.15-.335-.25-.564-.292-.685l-1.555-.184c-.329-.043-.585-.16-.772-.353C3.09 13.52 3 13.277 3 12.978v-1.955zm1.207 1.973l1.865.22a.508.508 0 01.287.127.566.566 0 01.17.266c.09.329.25.703.473 1.123a.53.53 0 01.063.256c0 .127-.039.242-.117.338l-1.141 1.461a.195.195 0 00-.054.127c0 .036.018.072.054.108l1.198 1.199a.113.113 0 00.082.036c.036 0 .069-.012.1-.036l1.496-1.18a.563.563 0 01.33-.118c.09 0 .18.024.265.072.317.184.688.338 1.113.465.109.024.2.079.269.16.07.081.112.178.124.287l.22 1.892c.018.085.07.127.154.127h1.681c.085 0 .136-.042.154-.127l.22-1.892a.524.524 0 01.124-.287.483.483 0 01.269-.16 5.282 5.282 0 001.113-.465.533.533 0 01.266-.072c.109 0 .22.04.329.118l1.497 1.18c.03.024.063.036.1.036.036 0 .063-.012.081-.036l1.198-1.198c.036-.037.054-.073.054-.11a.195.195 0 00-.054-.126l-1.14-1.46a.547.547 0 01-.054-.595c.225-.42.382-.794.473-1.123a.566.566 0 01.169-.266.508.508 0 01.286-.126l1.866-.22c.09-.019.136-.067.136-.146v-1.699c0-.084-.043-.136-.127-.154l-1.883-.22a.535.535 0 01-.456-.383 5.224 5.224 0 00-.465-1.123.53.53 0 01-.063-.257c0-.126.039-.241.117-.338l1.141-1.46c.036-.049.054-.09.054-.127 0-.036-.018-.073-.054-.109l-1.198-1.198c-.03-.03-.057-.045-.082-.045-.024 0-.057.015-.1.045l-1.496 1.18a.563.563 0 01-.33.118.533.533 0 01-.265-.073 5.128 5.128 0 00-1.113-.464.534.534 0 01-.393-.447l-.22-1.892c-.018-.085-.07-.127-.154-.127h-1.681c-.085 0-.136.042-.154.127l-.22 1.892a.534.534 0 01-.392.447 5.282 5.282 0 00-1.114.464.533.533 0 01-.266.073.563.563 0 01-.329-.118l-1.497-1.18c-.042-.03-.075-.045-.1-.045-.024 0-.05.015-.081.045L5.807 6.981c-.036.036-.054.073-.054.109 0 .036.018.078.054.127l1.14 1.46a.524.524 0 01.118.338c0 .091-.02.178-.063.257-.208.39-.362.764-.465 1.123a.535.535 0 01-.456.383l-1.883.22c-.084.018-.127.07-.127.154v1.7c0 .078.046.126.136.144zm5.88-2.106a2.201 2.201 0 013.009-.803c.34.199.61.465.808.803.2.338.296.706.296 1.101a2.212 2.212 0 01-2.21 2.21 2.196 2.196 0 01-1.904-1.105 2.15 2.15 0 01-.295-1.105c0-.395.1-.763.295-1.101zm.926 1.672c.103.175.242.31.417.416.175.103.362.154.56.154.318 0 .586-.111.81-.332.223-.22.332-.492.332-.809 0-.202-.051-.39-.154-.561a1.172 1.172 0 00-.417-.417 1.109 1.109 0 00-.57-.153c-.205 0-.39.05-.561.153-.175.103-.311.242-.417.417a1.116 1.116 0 000 1.132z"></path>
                </g>
                <defs>
                  <clipPath id="clip0_905_121">
                    <path d="M0 0H18V18H0z" transform="translate(3 3)"></path>
                  </clipPath>
                </defs>
              </svg>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 fill-foreground"
                >
                  <circle cx="6" cy="12" r="2"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                  <circle cx="18" cy="12" r="2"></circle>
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom">
                {links.map((link) => {
                  return (
                    <DropdownMenuItem key={link.label}>
                      {(link as any).url ? (
                        <Link
                          href={(link as any).url}
                          target="_blank"
                          className="font-medium text-sm w-full"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <button
                          onClick={(link as any).onClick}
                          className="font-medium text-sm w-full text-left"
                        >
                          {link.label}
                        </button>
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </footer>
  );
}
