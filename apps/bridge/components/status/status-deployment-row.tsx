import { DeploymentDto } from "@/codegen/model";
import { useDeploymentStatusChecks } from "@/hooks/status/use-deployment-status-checks";

import { SupportCheckStatus } from "./types";

export function StatusDeploymentRow({
  deployment,
  onClick,
}: {
  deployment: DeploymentDto;
  onClick: () => void;
}) {
  const statusChecks = useDeploymentStatusChecks(deployment);

  const theme = deployment.theme?.theme;

  const statusLoading = statusChecks.find(
    (x) => x.status === SupportCheckStatus.Loading
  );
  const statusWarning = statusChecks.find(
    (x) => x.status === SupportCheckStatus.Warning
  );
  const statusError = statusChecks.find(
    (x) => x.status === SupportCheckStatus.Error
  );

  return (
    <div
      onClick={onClick}
      className="flex gap-2 items-center p-6 w-full cursor-pointer"
    >
      <img
        src={theme?.imageNetwork}
        alt={deployment.l2.name}
        className="w-10 h-10 rounded-full"
      />
      <h3 className="font-heading text-xl">{deployment.l2.name}</h3>

      <div className="bg-card ml-auto">
        {statusLoading ? (
          <span className="flex items-center justify-center px-2 py-1 font-heading rounded-lg text-white bg-gray-400">
            Loading
          </span>
        ) : statusWarning ? (
          <span className="flex items-center justify-center px-2 py-1 font-heading rounded-lg text-white bg-orange-400">
            Warning
          </span>
        ) : statusError ? (
          <span className="flex items-center justify-center px-2 py-1 font-heading rounded-lg text-white bg-red-400">
            Error
          </span>
        ) : (
          <span className="flex items-center justify-center px-2 py-1 font-heading rounded-lg text-white bg-green-400">
            OK
          </span>
        )}
      </div>
    </div>
  );
}
