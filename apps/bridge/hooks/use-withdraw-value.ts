import { P, match } from "ts-pattern";
import { parseUnits } from "viem";

import { DeploymentType } from "@/codegen/model";
import { FINALIZE_GAS, PROVE_GAS } from "@/constants/gas-limits";
import { useConfigState } from "@/state/config";
import { isEth } from "@/utils/is-eth";

import { useWeiAmount } from "./use-wei-amount";
import { useSelectedToken } from "./use-selected-token";

export const useWithdrawValue = () => {
  const weiAmount = useWeiAmount();
  const deployment = useConfigState.useDeployment();
  const easyMode = useConfigState.useEasyMode();
  const token = useSelectedToken();

  const EASY_MODE_GWEI_THRESHOLD =
    deployment?.type === DeploymentType.mainnet ? "50" : "1";
  const PROVE_COST = PROVE_GAS * parseUnits(EASY_MODE_GWEI_THRESHOLD, 9);
  const FINALIZE_COST = FINALIZE_GAS * parseUnits(EASY_MODE_GWEI_THRESHOLD, 9);

  return match({
    isEth: isEth(token),
    easyMode,
    weiAmount,
  })
    .with(
      { isEth: true, easyMode: true, weiAmount: P.select() },
      (wei) => PROVE_COST + FINALIZE_COST + wei
    )
    .with({ isEth: true, easyMode: false, weiAmount: P.select() }, (wei) => wei)
    .with({ isEth: false, easyMode: true }, () => PROVE_COST + FINALIZE_COST)
    .with({ isEth: false, easyMode: false }, () => BigInt(0))
    .exhaustive();
};
