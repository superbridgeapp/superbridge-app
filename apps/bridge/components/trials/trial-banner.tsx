import { differenceInDays } from "date-fns";

import { useTrialEndsTime } from "@/hooks/trials/use-trial-ends-time";

export const TrialBanner = () => {
  const trialEndsTime = useTrialEndsTime();

  if (!trialEndsTime) {
    return null;
  }

  const days = Math.max(differenceInDays(Date.now(), trialEndsTime), 0);

  return (
    <div>
      <div>
        This is a free trial bridge made with{" "}
        <a href="https://superbridge.app/rollies">SUPERBRIDGE ROLLIES</a>
      </div>
      <div>{days} DAYS LEFT</div>
    </div>
  );
};
