import clsx from "clsx";

import { useDeployments } from "@/hooks/use-deployments";

import { IconAlert } from "../icons";
import { Alert } from "../ui/alert";

export const OpMainnetWithdrawalsResetBanner = ({ className }: any) => {
  const deployments = useDeployments();

  const hasOptimism = !!deployments.find((x) => x.name === "optimism");

  if (!hasOptimism) {
    return null;
  }

  return (
    <Alert
      variant={"horizontal"}
      className={clsx("flex items-start gap-4", className)}
    >
      <div className="animate-wiggle-waggle drop-shadow-lg">
        <IconAlert className="h-8 w-8 shrink-0" />
      </div>
      <div className="prose">
        <p className="text-xs text-foreground">
          Pending withdrawals from OP Mainnet were reset on Sep 11 following
          reactivation of permissionless fault proofs. Recently proved
          withdrawals will need to be reproven.
        </p>
        <p className="text-xs">
          <a
            href="https://x.com/Optimism/status/1833903320945041685"
            target="_blank"
            className="cursor-pointer hover:underline text-muted-foreground"
          >
            More info
          </a>
        </p>
      </div>
    </Alert>
  );
};
