import { useTranslation } from "react-i18next";

import { Period } from "@/hooks/use-finalization-period";

export const usePeriodText = () => {
  const { t } = useTranslation();

  return (str: string, args: any, period: Period) => {
    const value =
      period?.period === "mins"
        ? t(`${str}Minutes`, {
            ...args,
            count: period.value,
          }).toString()
        : period?.period === "hours"
        ? t(`${str}Hours`, {
            ...args,
            count: period.value,
          }).toString()
        : t(`${str}Days`, {
            ...args,
            count: period?.value,
          }).toString();
    return value ?? "";
  };
};
