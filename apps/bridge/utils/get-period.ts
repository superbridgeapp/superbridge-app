const ONE_SECOND = 1;
const ONE_MINUTE = 60;
const ONE_HOUR = 60 * 60;
const ONE_DAY = 60 * 60 * 24;

export type Period =
  | { period: "days"; value: number }
  | { period: "hours"; value: number }
  | { period: "mins"; value: number }
  | { period: "secs"; value: number }
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
  if (seconds >= ONE_MINUTE) {
    return {
      period: "mins",
      value: Math.round(Math.max(seconds / ONE_MINUTE, 1)),
    };
  }

  return {
    period: "secs",
    value: Math.round(seconds),
  };
};

export const formatDuration = (start: number, end: number): string | null => {
  const durationInSeconds = Math.ceil((end - start) / 1000);

  if (durationInSeconds < 0) {
    return null;
  }

  if (durationInSeconds >= ONE_DAY) {
    const days = Math.ceil(durationInSeconds / ONE_DAY);
    return `${days} day${days > 1 ? "s" : ""}`;
  }

  if (durationInSeconds >= ONE_HOUR) {
    const hours = Math.ceil(durationInSeconds / ONE_HOUR);
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  if (durationInSeconds >= ONE_MINUTE) {
    const minutes = Math.ceil(durationInSeconds / ONE_MINUTE);
    return `${minutes} min${minutes > 1 ? "s" : ""}`;
  }

  return `${durationInSeconds} sec${durationInSeconds !== 1 ? "s" : ""}`;
};

export const formatDurationToNow = (end: number): string | null => {
  return formatDuration(Date.now(), end);
};
