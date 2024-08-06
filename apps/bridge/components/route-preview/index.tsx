import { ModalNames } from "@/constants/modal-names";
import { useBridgeRoutes } from "@/hooks/routes/use-bridge-routes";
import { useSelectedBridgeRoute } from "@/hooks/routes/use-selected-bridge-route";
import { useConfigState } from "@/state/config";
import { isRouteQuote, isRouteQuoteError } from "@/utils/guards";

import { IconCaretRight, IconSpinner } from "../icons";
import { Button } from "../ui/button";
import { Route } from "./route";

export const RoutePreview = () => {
  const routes = useBridgeRoutes();
  const route = useSelectedBridgeRoute();

  const openModal = useConfigState.useAddModal();

  // TODO: Put animate apprearance here
  if (route.isLoading) {
    return (
      <div className="p-4 flex gap-2 justify-center">
        <IconSpinner className="text-muted-foreground w-4 h-4" />
        <span className="text-xs text-muted-foreground">Loading</span>
      </div>
    );
  }

  if (!route.data) {
    return <></>;
  }

  if (isRouteQuoteError(route.data.result)) {
    return (
      <div className="bg-muted rounded-xl p-4">
        <span className="text-xs text-center leading-4 text-muted-foreground">
          {/* TODO: Perhaps we can bring the error text that's currently output to the button and display it here? Leave button only with the action text, disabled if needed */}
          {JSON.stringify(route.data.result)}
        </span>
      </div>
    );
  }

  const routeCount =
    routes.data?.results.filter((x) => isRouteQuote(x.result)).length ?? 0;

  return (
    <div className={`flex flex-col gap-2 pt-1 relative`}>
      <div className="p-4 border rounded-xl">
        <Route provider={route.data.id} quote={route.data.result} />
      </div>
      {routeCount > 1 && (
        <Button
          onClick={() => openModal(ModalNames.RouteSelector)}
          size={"xs"}
          variant={"secondary"}
          className="mx-auto absolute bottom-2.5 right-2 text-xs h-6 pr-2 gap-1"
        >
          <span>{routeCount} More</span>
          <IconCaretRight className="w-3 w-3 fill-foreground" />
        </Button>
      )}
    </div>
  );
};
