import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useApp } from "@/hooks/use-metadata";

import { IconAlert } from "./icons";

export const BridgeDeleted = () => {
  const app = useApp();

  const supportLink =
    app.links.find((x) =>
      ["discord", "twitter", "x.com"].find((y) =>
        x.url.toLowerCase().includes(y)
      )
    )?.url ?? app?.links[0].url;

  return (
    <div className="min-h-[480px] p-10 flex flex-col gap-2 items-center justify-center">
      <div className="animate-wiggle-waggle  drop-shadow-lg mb-4">
        <IconAlert className="h-16 w-16 shrink-0" />
      </div>
      <h1 className="text-2xl font-heading text-center max-w-[320px]">
        {app.head.title} no longer available
      </h1>
      <p className="text-center text-sm text-muted-foreground">
        Please contact the{" "}
        <a className="underline" href={supportLink}>
          {app.head.title} team
        </a>{" "}
        for support or more information.
      </p>
    </div>
  );
};
