import { useMemo } from "react";
import { isPresent } from "ts-is-present";

import { useBridgeControllerGetDeploymentSyncStatus } from "@/codegen/index";
import { DeploymentDto } from "@/codegen/model";
import { SupportCheckStatus } from "@/components/status/types";

export const useIndexingStatuses = (deployment: DeploymentDto) => {
  const status = useBridgeControllerGetDeploymentSyncStatus(deployment.id);

  return useMemo(() => {
    if (status.isLoading) {
      return [
        {
          title: `${deployment.l2.name} indexing status`,
          status: SupportCheckStatus.Loading,
          description: "Loading…",
        },
      ];
    }

    if (!status.data?.data) {
      return [
        {
          title: `${deployment.l2.name} indexing status`,
          description: `Unable to load…`,
          status: SupportCheckStatus.Error,
        },
      ];
    }

    return status.data.data
      .filter((d) => d.type === "tip")
      .map((d) => {
        let title;
        let description;

        const error = d.diff > 100;

        if (d.name.includes("deposit")) {
          title = "Deposit indexing";
          description = "Deposit operations";
        }

        if (d.name.includes("withdrawals")) {
          title = "Withdrawal indexing";
          description = "Withdrawal operations";
        }

        if (d.name.includes("proveFinalize")) {
          title = "Prove & finalize indexing";
          description = "Prove & finalize operations";
        }

        if (!title) {
          return null;
        }

        return {
          title,
          description: `${description}
              ${
                error
                  ? "may be delayed as our indexing pipeline catches up"
                  : "operating normally"
              }`,
          status: error ? SupportCheckStatus.Error : SupportCheckStatus.Ok,
        };
      })
      .filter(isPresent);
  }, [status.data?.data, status.isLoading]);
};
