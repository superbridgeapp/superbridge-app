import { describe, expect, test } from "vitest";

import { withdrawValue } from "@/utils/withdraw-value";

import { ether, mainnetDeployment, usdc } from "./constants";
import { OptimismToken } from "@/types/token";

describe("withdraw value", () => {
  test("eth + no easy mode", () => {
    expect(
      withdrawValue(BigInt("1"), mainnetDeployment, ether(1), false)
    ).toStrictEqual(BigInt("1"));
  });
  test("eth + easy mode", () => {
    expect(
      withdrawValue(BigInt("1"), mainnetDeployment, ether(1), true)
    ).toStrictEqual(BigInt("40000000000000001"));
  });
  test("token + no easy mode", () => {
    expect(
      withdrawValue(BigInt("1"), mainnetDeployment, usdc(1, 2), false)
    ).toStrictEqual(BigInt("0"));
  });
  test("token + easy mode", () => {
    expect(
      withdrawValue(BigInt("1"), mainnetDeployment, usdc(1, 2), true)
    ).toStrictEqual(BigInt("40000000000000000"));
  });
});
