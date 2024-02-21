import { useTranslation } from "react-i18next";

import { useBridgeControllerFiatPrices } from "@/codegen/index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { flagSymbolMap } from "@/constants/currency-symbol-map";
import { DefaultTokenList, useSettingsState } from "@/state/settings";

import { Dialog, DialogContent } from "../ui/dialog";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useConfigState } from "@/state/config";

export interface SettingsModalProps {
  open: boolean;
  setOpen: (b: boolean) => void;
}

export const TokenLists = () => {
  const [expanded, setExpanded] = useState(false);

  const defaultTokenLists = useSettingsState.useDefaultTokenLists();
  const setDefaultTokenLists = useSettingsState.useSetDefaultTokenLists();
  const customTokenLists = useSettingsState.useCustomTokenLists();
  const setShowCustomTokenListModal =
    useConfigState.useSetShowCustomTokenListModal();

  const { t, i18n } = useTranslation();

  const toggleDefaultList = (tokenList: DefaultTokenList, enabled: boolean) => {
    setDefaultTokenLists(
      defaultTokenLists.map((t) =>
        t.name === tokenList.name ? { ...t, enabled } : t
      )
    );
  };

  return (
    <div className="flex flex-col p-4 gap-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="38"
            height="38"
            fill="none"
            viewBox="0 0 38 38"
            className="w-6 h-6"
          >
            <g clipPath="url(#clip0_841_5033)">
              <path
                fill="#CBCCBE"
                d="M12.944 16.772v-.074l.018-.472a7.656 7.656 0 012.234-4.995l7.236-7.192c1.464-1.465 3.4-2.253 5.485-2.253 4.263 0 7.72 3.42 7.72 7.682 0 2.085-.788 4.021-2.253 5.486l-7.459 7.459a9.53 9.53 0 00.168-1.787l-.019-.472 6.069-6.069c1.166-1.185 1.843-2.761 1.843-4.43 0-3.457-2.799-6.218-6.255-6.218-1.67 0-3.252.676-4.412 1.843l-6.876 6.8c-1.185 1.168-1.824 2.78-1.824 4.432 0 3.437 2.724 6.199 6.162 6.255a4.573 4.573 0 01-.918 1.352l-.242.242a7.712 7.712 0 01-6.634-6.857c-.019-.279-.037-.49-.037-.732h-.006zM1.78 27.874c0-2.067.788-4.021 2.253-5.486l7.235-7.236a2.21 2.21 0 00.223-.204 9.285 9.285 0 00-.167 1.75v.316l.018.15-6.068 6.086a6.304 6.304 0 00-1.843 4.413c0 3.475 2.798 6.236 6.273 6.236a6.27 6.27 0 004.43-1.843l6.84-6.82c1.147-1.148 1.824-2.817 1.824-4.474 0-3.382-2.706-6.143-6.2-6.162.224-.527.547-.993.956-1.408l.186-.187.056-.037c3.798.51 6.67 3.773 6.67 7.645 0 2.085-.787 4.021-2.252 5.486L14.98 33.29a7.713 7.713 0 01-5.486 2.252c-4.263 0-7.72-3.419-7.72-7.682l.007.012z"
              ></path>
              <path
                fill="#AFAFAF"
                d="M19.143 11.628l5.3-5.225A4.576 4.576 0 0127.73 5.05c2.575 0 4.642 2.03 4.642 4.605 0 1.26-.49 2.382-1.353 3.27l-5.244 5.262a9.293 9.293 0 00-6.633-6.56zm-2.91 4.884v-.261c.186-.019.36-.019.49-.019 2.463 0 4.474 2.048 4.474 4.549 0 .13 0 .242-.019.378h-.298a4.627 4.627 0 01-4.641-4.641l-.007-.006zm-3.29.26v-.074c0-.15 0-.317.02-.472a7.656 7.656 0 012.233-4.995l7.236-7.192c1.464-1.465 3.4-2.253 5.485-2.253 4.263 0 7.72 3.42 7.72 7.682 0 2.085-.788 4.021-2.253 5.486l-7.236 7.235-.223.224a9.53 9.53 0 00.168-1.787c0-.15 0-.298-.019-.472l6.069-6.069c1.166-1.185 1.843-2.761 1.843-4.43 0-3.457-2.799-6.218-6.255-6.218-1.67 0-3.252.676-4.412 1.843l-6.876 6.8c-1.185 1.167-1.824 2.78-1.824 4.432 0 3.437 2.724 6.199 6.162 6.255a4.576 4.576 0 01-.918 1.352l-.242.242a7.712 7.712 0 01-6.634-6.857c-.019-.279-.037-.49-.037-.732h-.006zM5.057 27.67c0-1.241.472-2.427 1.353-3.29l5.244-5.224a9.371 9.371 0 006.577 6.578l-5.243 5.206a4.655 4.655 0 01-3.27 1.353c-2.576 0-4.66-2.048-4.66-4.623zm-3.27.204c0-2.066.788-4.02 2.253-5.485l7.235-7.236c.075-.055.15-.13.224-.204a9.285 9.285 0 00-.168 1.75v.316l.019.149-6.07 6.087a6.304 6.304 0 00-1.842 4.413c0 3.474 2.798 6.236 6.274 6.236a6.27 6.27 0 004.43-1.843l6.839-6.82c1.148-1.148 1.824-2.817 1.824-4.474 0-3.382-2.706-6.143-6.2-6.162.224-.527.547-.993.956-1.408l.187-.187.055-.037c3.798.509 6.671 3.773 6.671 7.645 0 2.085-.788 4.021-2.252 5.486l-7.236 7.192A7.714 7.714 0 019.5 35.543c-4.264 0-7.72-3.419-7.72-7.682l.006.012zm14.335 6.56l7.235-7.192a9.243 9.243 0 001.67-2.272 8.772 8.772 0 002.252-1.65l7.235-7.236a9.29 9.29 0 002.743-6.615c0-5.169-4.17-9.301-9.339-9.301a9.29 9.29 0 00-6.615 2.742l-7.235 7.192a9.189 9.189 0 00-1.632 2.197c-.863.509-1.632 1.073-2.29 1.731l-7.236 7.236A9.367 9.367 0 00.167 27.88c0 5.169 4.17 9.302 9.339 9.302 2.5 0 4.865-.993 6.615-2.743v-.006z"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_841_5033">
                <path
                  fill="#fff"
                  d="M0 0H37.083V37.009H0z"
                  transform="translate(.167 .167)"
                ></path>
              </clipPath>
            </defs>
          </svg>
          <h3 className="font-bold text-sm">{t("settings.tokenLists")}</h3>
        </div>

        <button onClick={() => setExpanded((e) => !e)}>
          {expanded ? "Down" : "Up"}
        </button>
      </div>

      {expanded && (
        <div>
          {defaultTokenLists.map((tokenList) => (
            <div className="flex items-center gap-3">
              <Checkbox
                checked={tokenList.enabled}
                onCheckedChange={(checked) =>
                  toggleDefaultList(tokenList, checked as boolean)
                }
              />
              <div>{tokenList.name}</div>
            </div>
          ))}

          {customTokenLists.map((tokenList) => (
            <div className="flex items-center justify-between">
              <div>{tokenList.name}</div>

              <button onClick={() => setShowCustomTokenListModal(tokenList)}>
                Manage
              </button>
            </div>
          ))}

          <button onClick={() => setShowCustomTokenListModal(true)}>
            Add custom token lists
          </button>
        </div>
      )}
    </div>
  );
};
