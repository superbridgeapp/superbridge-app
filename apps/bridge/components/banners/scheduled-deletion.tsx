import clsx from "clsx";

import { useDeployment } from "@/hooks/use-deployment";

import { IconAlert } from "../icons";

export const ScheduledDeletion = () => {
  const deployment = useDeployment();

  const supportLink =
    deployment?.theme?.links.find((x) =>
      ["discord", "twitter", "x.com"].find((y) =>
        x.url.toLowerCase().includes(y)
      )
    )?.url ?? deployment?.theme?.links[0]?.url;

  return (
    <div className="flex relative items-start gap-3 w-full p-4 bg-red-500/80 bg-[url('/img/shutdown-grid.svg')] bg-repeat rounded-[18px] shadow-sm">
      <div className="animate-wiggle-waggle drop-shadow-lg">
        <IconAlert className="h-8 w-8 shrink-0" />
      </div>
      <div className="prose">
        <p className="text-white text-xs">
          {deployment?.l2.name} bridge will shut down on{" "}
          {new Date(deployment?.deletedAt ?? 0).toUTCString()}. Please finalize
          any withdrawals before the shut down date.
        </p>
        <p className="text-white text-xs">
          <a
            href={supportLink}
            className={clsx(
              "text-white",
              supportLink && "cursor-pointer hover:underline"
            )}
          >
            For support contact the {deployment?.l2.name} team.
          </a>
        </p>
      </div>
    </div>
  );
};
