import { ModalNames } from "@/constants/modal-names";
import { useBridgeRoutes } from "@/hooks/use-bridge-routes";
import { useSelectedBridgeRoute } from "@/hooks/use-selected-bridge-route";
import { useConfigState } from "@/state/config";
import { isRouteQuote, isRouteQuoteError } from "@/utils/guards";

import { Route } from "./route";

export const RoutePreview = () => {
  const routes = useBridgeRoutes();
  const route = useSelectedBridgeRoute();

  const openModal = useConfigState.useAddModal();

  if (route.isLoading) {
    return <div>Loading</div>;
  }

  if (!route.data) {
    return <div></div>;
  }

  if (isRouteQuoteError(route.data.result)) {
    return <div>{JSON.stringify(route.data.result)}</div>;
  }

  const hasMore =
    !!routes.data &&
    routes.data.filter((x) => isRouteQuote(x.result)).length > 1;

  return (
    <div className={`flex flex-col gap-2 pt-1 relative`}>
      <Route provider={route.data.id} quote={route.data.result} />

      {hasMore && (
        <button
          className="text-xs bg-muted text-muted-foreground font-heading rounded-full leading-none px-2 py-1.5 absolute right-4 top-4"
          onClick={() => openModal(ModalNames.RouteSelector)}
        >
          More
        </button>
      )}
    </div>
  );
};
