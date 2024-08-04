const ONE_MINUTE = 60;
const ONE_HOUR = 60 * 60;
const ONE_DAY = 60 * 60 * 24;

export type Period =
  | { period: "days"; value: number }
  | { period: "hours"; value: number }
  | { period: "mins"; value: number }
  | null;

export const getPeriod = (seconds: number): Period => {
  if (seconds >= ONE_DAY) {
    return {
      period: "days",
      value: Math.round(seconds / ONE_DAY),
    };
  }
  if (seconds >= ONE_HOUR) {
    return {
      period: "hours",
      value: Math.round(seconds / ONE_HOUR),
    };
  }
  return {
    period: "mins",
    value: Math.round(Math.max(seconds / ONE_MINUTE, 1)),
  };
};
