import { DeploymentType } from "@/codegen/model";
import { useConfigState } from "@/state/config";
import { isArbitrum } from "@/utils/is-mainnet";
import { isCctpBridgeOperation } from "@/utils/transaction-args/cctp-args/common";

const QUICK_NETWORKS: DeploymentType[] = [
  DeploymentType.devnet,
  DeploymentType.testnet,
];

export const useTransferTime = () => {
  const deployment = useConfigState.useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  const token = useConfigState.useToken();

  if (
    !!deployment &&
    !!token &&
    isCctpBridgeOperation(deployment, token, withdrawing)
  ) {
    return QUICK_NETWORKS.includes(deployment.type)
      ? "~ 3 minutes"
      : "~ 15 minutes";
  }

  if (deployment && withdrawing) {
    return QUICK_NETWORKS.includes(deployment.type) ? "~ 1 hour" : "~ 7 days";
  } else {
    if (
      deployment &&
      isArbitrum(deployment) &&
      deployment.type === DeploymentType.mainnet
    ) {
      return "~ 10 minutes";
    }

    // https://stack.optimism.io/docs/releases/bedrock/explainer/#shorter-deposit-times
    return "~ 3 minutes";
  }
};
