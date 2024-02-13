import { P, match } from "ts-pattern";
import { parseUnits } from "viem";

import { DeploymentDto } from "@/codegen/model";
import {
  EASY_MODE_GAS_FEES,
  FINALIZE_GAS,
  PROVE_GAS,
} from "@/constants/gas-limits";
import { Token } from "@/types/token";
import { isEth } from "@/utils/is-eth";

import { isArbitrum, isOptimism } from "./is-mainnet";

export const withdrawValue = (
  wei: bigint,
  deployment: DeploymentDto,
  token: Token,
  easyMode: boolean
) => {
  const EASY_MODE_GWEI_THRESHOLD = (
    EASY_MODE_GAS_FEES[deployment?.l1.id ?? 0] ?? 1
  ).toString();

  let relayCost = BigInt(0);
  if (isOptimism(deployment)) {
    relayCost += PROVE_GAS * parseUnits(EASY_MODE_GWEI_THRESHOLD, 9);
    relayCost += FINALIZE_GAS * parseUnits(EASY_MODE_GWEI_THRESHOLD, 9);
  }

  if (isArbitrum(deployment)) {
    relayCost += FINALIZE_GAS * parseUnits(EASY_MODE_GWEI_THRESHOLD, 9);
  }

  return match({
    isEth: isEth(token),
    easyMode,
    wei,
  })
    .with(
      { isEth: true, easyMode: true, wei: P.select() },
      (wei) => relayCost + wei
    )
    .with({ isEth: true, easyMode: false, wei: P.select() }, (wei) => wei)
    .with({ isEth: false, easyMode: true }, () => relayCost)
    .with({ isEth: false, easyMode: false }, () => BigInt(0))
    .exhaustive();
};
