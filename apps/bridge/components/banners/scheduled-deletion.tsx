import Link from "next/link";

import { IconAlert } from "../icons";

export const ScheduledDeletion = () => {
  return (
    <div className="flex relative items-start gap-3 w-full p-4 bg-red-500/80 bg-[url('/img/shutdown-grid.svg')] bg-repeat rounded-[18px] shadow-sm">
      <div className="animate-wiggle-waggle drop-shadow-lg">
        <IconAlert className="h-8 w-8 shrink-0" />
      </div>
      <div className="prose">
        <p className="text-white text-xs">
          Parallel bridge will shut down on 8 August 2024 12:00 AM UTC. New
          withdrawals will be paused 1 August 2024 12:00 AM UTC. Please finalize
          any withdrawals before the shut down date.
        </p>
        <p className="text-white text-xs">
          <Link
            href={"#"}
            target="_blank"
            className="text-white cursor-pointer hover:underline"
          >
            For support contact the Parallel Team.
          </Link>
        </p>
      </div>
    </div>
  );
};
