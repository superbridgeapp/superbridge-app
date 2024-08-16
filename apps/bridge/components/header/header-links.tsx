import Link from "next/link";
import { useTranslation } from "react-i18next";

import { LinkDto } from "@/codegen/model";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsSuperbridge } from "@/hooks/apps/use-is-superbridge";
import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useModal } from "@/hooks/use-modal";

import { IconArrowUpRight, IconSB } from "../icons";

export function HeaderLinks() {
  const { t } = useTranslation();
  const legalModal = useModal("Legal");
  const deployment = useDeployment();
  const isSuperbridge = useIsSuperbridge();

  const defaultLinks = [
    // {
    //   url: isSuperbridge
    //     ? "https://superbridge.app/support"
    //     : `https://superbridge.app/support/${deployment?.name}`,
    //   label: t("support"),
    // },
    {
      onClick: () => legalModal.open(),
      label: t("legal.footerButton"),
    },
    { url: "https://twitter.com/superbridgeapp", label: "x.com" },
  ];
  const links: (LinkDto | { onClick: () => void; label: string })[] =
    isSuperbridge
      ? defaultLinks
      : deployment?.theme?.links.length
        ? deployment.theme.links
        : defaultLinks;

  return (
    <div className="flex gap-3 items-center">
      <div className="bg-card h-10 pl-2.5 pr-3 gap-1 inline-flex items-center rounded-full transition-all border-black/[0.0125] dark:border-white/[0.0125]">
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
                      className=" text-sm w-full"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={(link as any).onClick}
                      className=" text-sm w-full text-left"
                    >
                      {link.label}
                    </button>
                  )}
                </DropdownMenuItem>
              );
            })}

            {/* if not Superbridge and deployment has custom links */}
            {!isSuperbridge &&
              deployment?.theme?.links &&
              deployment?.theme?.links.length > 0 && (
                <div className="bg-muted p-3 rounded-lg flex flex-col gap-3 mt-3">
                  <a
                    href="https://superbridge.app"
                    className=" text-xs  leading-none w-full flex gap-2 items-center"
                  >
                    <IconSB className="h-6 w-auto fill-foreground" />
                    <span>Powered by Superbridge</span>
                  </a>
                  <Link
                    href={`https://superbridge.app/support/${deployment.name}`}
                    className=" text-xs  leading-none w-full flex gap-2 items-center"
                  >
                    <IconArrowUpRight className="h-4 mx-1 w-auto fill-muted-foreground" />
                    <span>Support & FAQs</span>
                  </Link>
                  <button
                    className=" text-xs  leading-none w-full flex gap-2 items-center"
                    onClick={() => legalModal.open()}
                  >
                    <IconArrowUpRight className="h-4 mx-1 w-auto fill-muted-foreground" />
                    <span>Legal</span>
                  </button>
                </div>
              )}

            {/* if not Superbridge and deployment does not have custom links - just show powered by SB and links */}
            {!isSuperbridge && !deployment?.theme?.links.length && (
              <div className="bg-muted p-3 rounded-lg flex flex-col gap-3 mt-3">
                <a
                  href="https://superbridge.app"
                  className=" text-xs  leading-none w-full flex gap-2 items-center"
                >
                  <IconSB className="h-6 w-auto fill-foreground" />
                  <span>Powered by Superbridge</span>
                </a>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
