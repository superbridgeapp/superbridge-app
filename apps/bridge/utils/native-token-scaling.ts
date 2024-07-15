export function scaleToNativeTokenDecimals({
  amount,
  decimals,
}: {
  amount: bigint;
  decimals: number;
}) {
  // do nothing for 18 decimals
  if (decimals === 18) {
    return BigInt(amount.toString());
  }

  if (decimals < 18) {
    const scaledAmount = amount / BigInt(10) ** BigInt(18 - decimals);
    // round up if necessary
    if (scaledAmount * BigInt(10) ** BigInt(18 - decimals) < amount) {
      return scaledAmount + BigInt(1);
    }
    return scaledAmount;
  }

  // decimals > 18
  return amount * BigInt(10) ** BigInt(decimals - 18);
}

export function nativeTokenDecimalsTo18Decimals({
  amount,
  decimals,
}: {
  amount: bigint;
  decimals: number;
}) {
  if (decimals < 18) {
    return amount * BigInt(10) ** BigInt(18 - decimals);
  } else if (decimals > 18) {
    return amount / BigInt(10) ** BigInt(decimals - 18);
  }

  return amount;
}
