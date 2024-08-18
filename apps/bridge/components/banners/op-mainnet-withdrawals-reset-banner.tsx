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
        <p className="text-xs">
          Pending withdrawals on OP Mainnet were reset on Aug 16 following
          activation of the permissioned proving fallback. Recently proved
          withdrawals will need to be reproven.
        </p>
        <p className="text-xs">
          <a
            href="https://gov.optimism.io/t/upgrade-proposal-10-granite-network-upgrade/8733"
            target="_blank"
            className="cursor-pointer hover:underline"
          >
            More info
          </a>
        </p>
      </div>
    </Alert>
  );
};
