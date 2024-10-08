export const formatDecimals = (x: number | undefined | null) => {
  if (typeof x === "undefined" || x === null) {
    return "";
  }

  let maximumFractionDigits = 0;
  if (x > 1) {
    maximumFractionDigits = 4;
  } else {
    let leadingZeroDecimals = Math.floor(Math.abs(Math.log10(x)));
    if (leadingZeroDecimals === Infinity) {
      maximumFractionDigits = 0;
    } else {
      maximumFractionDigits = leadingZeroDecimals + 4;
    }
  }

  return x.toLocaleString("en-US", {
    maximumFractionDigits,
  });
};
