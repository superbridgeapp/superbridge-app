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
import { useSettingsState } from "@/state/settings";

import { Dialog, DialogContent } from "../ui/dialog";
import { TokenLists } from "./token-lists";

export interface SettingsModalProps {
  open: boolean;
  setOpen: (b: boolean) => void;
}

export const SettingsModal = ({ open, setOpen }: SettingsModalProps) => {
  const { t, i18n } = useTranslation();

  const currency = useSettingsState.useCurrency();
  const setCurrency = useSettingsState.useSetCurrency();

  const fiat = useBridgeControllerFiatPrices();

  const preferredExplorer = useSettingsState.usePreferredExplorer();
  const setPreferredExplorer = useSettingsState.useSetPreferredExplorer();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="">
          <h2 className="font-bold p-6 pb-0">{t("settings.settings")}</h2>

          <div className="px-6 py-8">
            <div className="border border-zinc-100 dark:border-zinc-800 rounded-[16px] divide-y divide-zinc-100 dark:divide-zinc-800">
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="38"
                    height="38"
                    fill="none"
                    viewBox="0 0 38 38"
                    className="w-6 h-6"
                  >
                    <g clipPath="url(#clip0_841_5031)">
                      <path
                        fill="#00BF3A"
                        d="M22.568 15.884l-4.327-.957c-2.239-.491-2.86-.864-2.86-2.108 0-1.057.976-1.772 3.332-1.772 2.711 0 4.29 1.131 5.366 2.313.94 1.013 2.052 1.753 3.184 1.753 1.616 0 3.165-1.43 3.165-3.538 0-1.672-1.281-3.743-3.221-4.986-1.132-.715-2.506-1.393-4.272-1.791V3.554c0-1.846-1.467-3.22-3.333-3.22-1.865 0-3.332 1.355-3.332 3.22v1.057c-4.944.84-7.972 4.08-7.972 8.618 0 4.894 2.88 7.362 7.947 8.413l4.383.902c2.201.454 2.73.827 2.73 2.07 0 1.43-.976 2.108-3.687 2.108-3.11 0-4.95-1.013-5.833-2.543-.715-1.206-1.598-2.015-3.065-2.015-1.635 0-3.184 1.45-3.184 3.352 0 1.903 1.076 3.954 2.88 5.329 1.541 1.113 3.444 1.94 5.794 2.313v.77c0 2.146 1.374 3.483 3.333 3.483s3.333-1.337 3.333-3.482v-.902c4.614-1.057 7.455-4.253 7.455-8.773 0-4.95-2.99-7.306-7.81-8.376l-.006.006z"
                      ></path>
                      <path
                        fill="#00AB34"
                        d="M9.84 25.522c0-.584.336-1.094.92-1.094.417 0 .753.28 1.114.883 1.262 2.145 3.992 3.668 7.79 3.668 3.576 0 5.951-1.58 5.951-4.365 0-2.524-1.772-3.706-4.539-4.29l-4.384-.902c-4.346-.883-6.137-2.45-6.137-6.193 0-4.029 2.749-6.38 7.965-6.59V3.964c0-.79.318-1.374 1.076-1.374.759 0 1.076.584 1.076 1.374v2.73c2.387.26 3.973.938 5.329 1.809 1.374.883 2.22 2.033 2.22 3.165 0 .79-.38 1.187-.958 1.187-.436 0-.902-.379-1.524-1.038-1.262-1.393-3.519-3.028-7.02-3.028-3.258 0-5.59 1.654-5.59 4.029 0 2.599 1.903 3.706 4.633 4.328l4.328.957c4.178.92 6.043 2.413 6.043 6.156 0 4.029-2.561 6.38-7.455 6.852v2.58c0 .92-.298 1.468-1.076 1.468-.777 0-1.075-.529-1.075-1.468V31.15c-3.01-.168-5.006-.901-6.74-2.108-1.3-1.013-1.94-2.275-1.94-3.519H9.84zm12.722-9.638l-4.328-.957c-2.238-.491-2.86-.864-2.86-2.108 0-1.057.976-1.772 3.333-1.772 2.711 0 4.29 1.131 5.366 2.313.939 1.013 2.052 1.753 3.184 1.753 1.616 0 3.165-1.43 3.165-3.538 0-1.672-1.281-3.743-3.221-4.986-1.132-.715-2.506-1.393-4.272-1.791V3.554c0-1.846-1.467-3.22-3.333-3.22-1.865 0-3.333 1.355-3.333 3.22v1.057c-4.937.84-7.965 4.08-7.965 8.618 0 4.894 2.88 7.362 7.947 8.413l4.383.902c2.201.454 2.73.827 2.73 2.07 0 1.43-.976 2.108-3.687 2.108-3.11 0-4.95-1.013-5.833-2.543-.715-1.206-1.598-2.015-3.065-2.015-1.635 0-3.184 1.45-3.184 3.352 0 1.903 1.076 3.954 2.88 5.329 1.541 1.113 3.444 1.94 5.794 2.313v.77c0 2.146 1.374 3.483 3.333 3.483s3.333-1.337 3.333-3.482v-.902c4.614-1.057 7.455-4.253 7.455-8.773 0-4.95-2.99-7.306-7.81-8.376l-.012.006z"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_841_5031">
                        <path
                          fill="#fff"
                          d="M0 0H22.832V37.083H0z"
                          transform="translate(7.583 .333)"
                        ></path>
                      </clipPath>
                    </defs>
                  </svg>
                  <h3 className="font-bold text-sm">
                    {t("settings.currency")}
                  </h3>
                </div>

                <Select onValueChange={setCurrency} value={currency}>
                  <SelectTrigger className="max-w-[166px]">
                    <SelectValue placeholder={currency} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(fiat.data?.data ?? {}).map((symbol) => (
                      <SelectItem key={symbol} value={symbol}>
                        {flagSymbolMap[symbol]} {symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="38"
                    height="38"
                    fill="none"
                    viewBox="0 0 38 38"
                    className="w-6 h-6"
                  >
                    <g fill="#00C7FF" clipPath="url(#clip0_841_5032)">
                      <path
                        fillOpacity="0.15"
                        d="M18.708 36.496c9.502 0 17.205-7.702 17.205-17.204S28.21 2.087 18.708 2.087c-9.502 0-17.204 7.703-17.204 17.205 0 9.502 7.702 17.204 17.204 17.204z"
                      ></path>
                      <path d="M27.706 11.687h5.44a16.136 16.136 0 011.847 6.492H28.52c-.075-2.257-.336-4.458-.808-6.492h-.006zm0 15.21c.472-2.034.733-4.235.808-6.492h6.473a16.01 16.01 0 01-1.847 6.491H27.7h.006zM24.297 3.951a16.306 16.306 0 017.437 5.515h-4.651c-.36-1.075-.753-2.07-1.225-2.99-.454-.902-.976-1.772-1.56-2.525zm0 30.685a15.633 15.633 0 001.56-2.524c.473-.92.865-1.921 1.226-2.99h4.65a16.272 16.272 0 01-7.436 5.514zm-4.483-25.17v-6.33c1.691.585 3.146 2.413 4.067 4.31.317.64.603 1.318.864 2.014h-4.93v.006zm0 8.718v-6.492h5.59c.528 2.071.808 4.29.883 6.492h-6.473zm0 8.717v-6.491h6.473c-.075 2.182-.36 4.402-.883 6.491h-5.59zm0 8.544v-6.324h4.912a17.606 17.606 0 01-.845 2.015c-.92 1.846-2.35 3.724-4.067 4.309zM12.683 9.467c.243-.696.529-1.374.846-2.014.92-1.847 2.35-3.725 4.066-4.31v6.324h-4.912zm-.018 19.655h4.93v6.324c-1.691-.585-3.146-2.413-4.066-4.31a21.82 21.82 0 01-.864-2.014zm-1.542-10.937c.074-2.183.36-4.402.882-6.492h5.59v6.492h-6.472zm0 2.22h6.472v6.491h-5.59c-.528-2.07-.808-4.29-.883-6.491zM5.682 9.467a16.273 16.273 0 017.436-5.515 14.162 14.162 0 00-1.56 2.525c-.473.92-.864 1.921-1.225 2.99H5.682zm0 19.655h4.65c.361 1.076.753 2.07 1.226 2.99.454.902.976 1.773 1.56 2.525a16.305 16.305 0 01-7.436-5.515zM2.424 18.18a16.01 16.01 0 011.846-6.492h5.441c-.473 2.034-.734 4.235-.808 6.492h-6.48zm0 2.22h6.473c.074 2.256.335 4.458.808 6.49H4.27a16.136 16.136 0 01-1.846-6.49zm16.284 17.428c10.223 0 18.542-8.32 18.542-18.542C37.25 9.063 28.93.75 18.708.75 8.486.75.167 9.07.167 19.292c0 10.222 8.32 18.541 18.541 18.541v-.006z"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_841_5032">
                        <path
                          fill="#fff"
                          d="M0 0H37.083V37.083H0z"
                          transform="translate(.167 .75)"
                        ></path>
                      </clipPath>
                    </defs>
                  </svg>
                  <h3 className="font-bold text-sm">
                    {t("settings.language")}
                  </h3>
                </div>

                <Select
                  onValueChange={i18n.changeLanguage}
                  value={i18n.resolvedLanguage}
                >
                  <SelectTrigger className="max-w-[166px]">
                    <SelectValue placeholder={i18n.resolvedLanguage} />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { code: "en", label: "English" },
                      { code: "es", label: "Español" },
                      { code: "de", label: "Deutsch" },
                      { code: "fr", label: "Français" },
                      { code: "hi", label: "हिन्दी" },
                      { code: "vi", label: "Tiếng Việt" },
                      { code: "ja", label: "日本語" },
                      { code: "ar", label: "العربية" },
                      { code: "pl", label: "Polski" },
                      { code: "kr", label: "한국어" },
                      { code: "pt", label: "Português" },
                      { code: "id", label: "Bahasa Indonesia" },
                      { code: "th", label: "ไทย" },
                      { code: "zh-CN", label: "中文简体" },
                      { code: "zh-TW", label: "中文繁體" },
                    ].map(({ code, label }) => (
                      <SelectItem key={code} value={code}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4">
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
                  <h3 className="font-bold text-sm">
                    {t("settings.explorer")}
                  </h3>
                </div>

                <Select
                  onValueChange={setPreferredExplorer}
                  value={preferredExplorer}
                >
                  <SelectTrigger className="max-w-[166px] capitalize">
                    <SelectValue placeholder={preferredExplorer} />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { label: "Etherscan", value: "etherscan" },
                      { label: "Blockscout", value: "blockscout" },
                      { label: "Once Upon", value: "onceupon" },
                    ].map(({ label, value }) => (
                      <SelectItem key={label} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <TokenLists />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
