import { Period } from "@/hooks/use-finalization-period";

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

export const getRemainingTimeMs = (initiatedTime: number, duration: Period) => {
  const endTime =
    duration?.period === "days"
      ? initiatedTime + duration.value * ONE_DAY
      : duration?.period === "hours"
        ? initiatedTime + duration.value * ONE_HOUR
        : initiatedTime + (duration?.value ?? 1) * ONE_MINUTE;

  const currentTime = Math.floor(new Date().getTime());
  return endTime - currentTime;
};

export const getRemainingTimePeriod = (
  initiatedTime: number,
  duration: Period
): Period => {
  const remainingTime = getRemainingTimeMs(initiatedTime, duration);
  if (remainingTime < 0) {
    return null;
  }

  if (remainingTime > ONE_DAY) {
    return {
      period: "days",
      value: Math.floor(remainingTime / ONE_DAY),
    };
  }
  if (remainingTime > ONE_HOUR) {
    return {
      period: "hours",
      value: Math.floor(remainingTime / ONE_HOUR),
    };
  }
  return {
    period: "mins",
    value: Math.max(Math.floor(remainingTime / ONE_MINUTE), 1),
  };
};
