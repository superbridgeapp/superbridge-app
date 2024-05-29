import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useConfigState } from "@/state/config";
import { CustomTokenList, useSettingsState } from "@/state/settings";

import { Checkbox } from "../ui/checkbox";

export interface SettingsModalProps {
  open: boolean;
  setOpen: (b: boolean) => void;
}

export const TokenLists = () => {
  const [expanded, setExpanded] = useState(false);

  const customTokenLists = useSettingsState.useCustomTokenLists();
  const setCustomTokenLists = useSettingsState.useSetCustomTokenLists();
  const setShowCustomTokenListModal =
    useConfigState.useSetShowCustomTokenListModal();

  const { t, i18n } = useTranslation();

  const toggleCustomList = (tokenList: CustomTokenList, enabled: boolean) => {
    setCustomTokenLists(
      customTokenLists.map((t) =>
        t.name === tokenList.name ? { ...t, enabled } : t
      )
    );
  };

  return (
    <div className="flex flex-col p-4 gap-3">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 18"
            fill="none"
            className="w-6 h-6"
          >
            <g clipPath="url(#clip0_1003_5967)">
              <path
                d="M0 0.992399V16.7759C0 17.3487 0.41958 17.7683 0.992399 17.7683H18.6768C19.2496 17.7683 19.4831 17.3816 19.6254 17.0058L23.9343 5.19915C24.1897 4.54606 23.6351 3.97324 22.9857 3.97324H19.5379V2.53572C19.5379 1.96291 19.1183 1.54333 18.5455 1.54333H9.59927V0.992399C9.59927 0.41958 9.17969 0 8.60687 0H0.992399C0.41958 0 0 0.41958 0 0.992399Z"
                fill="#CBCCBE"
              />
              <path
                d="M1.62359 16.4476L5.68805 5.30134H22.4895L18.4251 16.4476H1.62359ZM0 16.7796C0 17.3524 0.41958 17.772 0.992399 17.772H18.6768C19.2496 17.772 19.4831 17.3853 19.6254 17.0095L23.9343 5.20283C24.1897 4.54975 23.6351 3.97693 22.9857 3.97693H19.5379V2.53941C19.5379 1.96659 19.1183 1.54701 18.5455 1.54701H9.59927V0.996085C9.59927 0.423266 9.17969 0.00368572 8.60687 0.00368572H0.992399C0.41958 3.71953e-05 0 0.419618 0 0.992436V16.776V16.7796ZM4.48404 4.73947L1.32441 13.3974V1.32445H8.27121V2.09794C8.27121 2.52847 8.61417 2.87143 9.04469 2.87143H18.2134V3.97693H5.43265C4.85984 3.97693 4.62633 4.36367 4.48404 4.73947Z"
                fill="black"
              />
            </g>
            <defs>
              <clipPath id="clip0_1003_5967">
                <rect width="24" height="17.772" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <h3 className="font-bold text-sm">{t("settings.tokenLists")}</h3>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className={`h-4 w-4 opacity-50 mr-3 ${
            expanded ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </div>

      {expanded && (
        <div className="flex flex-col gap-2">
          {customTokenLists.map((tokenList) => (
            <div
              key={tokenList.id}
              className="flex items-center justify-between"
            >
              <div className="flex gap-2 items-center">
                <Checkbox
                  id={tokenList.name}
                  checked={tokenList.enabled}
                  onCheckedChange={(checked) =>
                    toggleCustomList(tokenList, checked as boolean)
                  }
                />
                <label
                  htmlFor={tokenList.name}
                  className="font-bold text-sm leading-4"
                >
                  {tokenList.name}
                </label>
              </div>

              <button
                onClick={() => setShowCustomTokenListModal(tokenList)}
                className={`text-xs  hover:opacity-50 text-muted-foreground`}
              >
                {t("manage")}
              </button>
            </div>
          ))}

          <button
            onClick={() => setShowCustomTokenListModal(true)}
            className={`mt-2 mr-auto text-xs   leading-3 rounded-full px-2 py-1 hover:scale-105 transition-all`}
          >
            {t("customTokenLists.add")}
          </button>
        </div>
      )}
    </div>
  );
};
