import { DeploymentDto } from "@/codegen/model";
import { useSupportStatusChecks } from "@/hooks/support/use-support-status-checks";

import { SupportCheckStatus } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const StatusLineItem = ({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: SupportCheckStatus;
}) => {
  if (status === SupportCheckStatus.Loading) {
    return (
      <div className="bg-muted rounded-lg p-4 flex justify-between">
        <div>
          <h3 className="text-sm font-heading tracking-tight">{title}</h3>
          <p className="font-body text-xs text-muted-foreground tracking-tight">
            Loading...
          </p>
        </div>
        <div>
          <svg
            fill="none"
            viewBox="0 0 66 66"
            className="w-3.5 h-3.5 block text-primary-foreground"
          >
            <circle
              cx="33"
              cy="33"
              fill="none"
              r="28"
              stroke="currentColor"
              opacity="0.2"
              stroke-width="12"
            ></circle>
            <circle
              cx="33"
              cy="33"
              fill="none"
              r="28"
              stroke="currentColor"
              stroke-dasharray="1, 174"
              stroke-dashoffset="306"
              stroke-linecap="round"
              stroke-width="12"
              className="animate-spinner"
            ></circle>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted rounded-lg p-4 flex gap-8 justify-between items-start">
      <div>
        <h3 className="text-sm font-heading tracking-tight">{title}</h3>
        <p className="font-body text-xs text-muted-foreground tracking-tight">
          {description}
        </p>
      </div>
      {status === SupportCheckStatus.Ok && (
        <span className="flex items-center justify-center px-2 py-1 font-heading text-sm rounded-md text-white bg-green-400">
          OK
        </span>
      )}
      {status === SupportCheckStatus.Warning && (
        <span className="flex items-center justify-center px-2 py-1 font-heading text-sm rounded-md text-white bg-amber-400">
          Warning
        </span>
      )}
      {status === SupportCheckStatus.Error && (
        <span className="flex items-center justify-center px-2 py-1 font-heading text-sm rounded-md text-white bg-red-400">
          Error
        </span>
      )}
    </div>
  );
};

export const SupportStatusModal = ({
  deployment,
  open,
  setOpen,
}: {
  deployment: DeploymentDto;
  open: boolean;
  setOpen: (b: boolean) => void;
}) => {
  const statusChecks = useSupportStatusChecks(deployment);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl tracking-tight">
            {deployment.l2.name} bridge status
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0 grid gap-2">
          {statusChecks.map((check) => (
            <StatusLineItem key={check.title} {...check} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
