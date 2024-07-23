import clsx from "clsx";

import { ModalNames } from "@/constants/modal-names";
import { useBridgeRoutes } from "@/hooks/use-bridge-routes";
import { useSelectedBridgeRoute } from "@/hooks/use-selected-bridge-route";
import { useConfigState } from "@/state/config";

import { RouteProviderIcon } from "../route-provider-icon";
import { Skeleton } from "../ui/skeleton";

export const RouteLineItem = () => {
  const routes = useBridgeRoutes();
  const openModal = useConfigState.useAddModal();
  const route = useSelectedBridgeRoute();

  const hasMultipleRoutes = routes.data?.length && routes.data.length > 1;

  return (
    <div
      className={clsx(
        "flex items-center justify-between px-3 py-2 -mr-0.5",
        hasMultipleRoutes && "cursor-pointer"
      )}
      onClick={
        hasMultipleRoutes ? () => openModal(ModalNames.RouteSelector) : () => {}
      }
    >
      <span>Bridge via</span>

      {route.isLoading ? (
        <Skeleton className="h-4 w-[88px]" />
      ) : !route.data ? (
        "…"
      ) : (
        <div>
          <RouteProviderIcon provider={route.data.id} />
        </div>
      )}
    </div>
  );
};
