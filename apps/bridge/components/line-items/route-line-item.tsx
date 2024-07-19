import { ModalNames } from "@/constants/modal-names";
import { useBridgeRoutes } from "@/hooks/use-bridge-routes";
import { useConfigState } from "@/state/config";

export const RouteLineItem = () => {
  const routes = useBridgeRoutes();
  const routeIndex = useConfigState.useRouteIndex();
  const openModal = useConfigState.useAddModal();

  return (
    <div
      className="flex items-center justify-between px-3 py-2 -mr-0.5"
      onClick={
        routes?.length && routes.length > 1
          ? () => {}
          : () => openModal(ModalNames.RouteSelector)
      }
    >
      {routes?.[routeIndex]?.id}
    </div>
  );
};
