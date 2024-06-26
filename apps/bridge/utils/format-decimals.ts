export const formatDecimals = (x: number | undefined | null) => {
  if (typeof x === "undefined" || x === null) {
    return "";
  }

  const maximumFractionDigits = x <= 1 ? 6 : 3;
  return x.toLocaleString("en-US", {
    maximumFractionDigits,
  });
};
