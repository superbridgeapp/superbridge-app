import { ModalNames } from "@/constants/modal-names";
import { useBridgeRoutes } from "@/hooks/use-bridge-routes";
import { useSelectedBridgeRoute } from "@/hooks/use-selected-bridge-route";
import { useConfigState } from "@/state/config";

export const RouteLineItem = () => {
  const routes = useBridgeRoutes();
  const openModal = useConfigState.useAddModal();
  const route = useSelectedBridgeRoute();

  return (
    <div
      className="flex items-center justify-between px-3 py-2 -mr-0.5"
      onClick={
        routes?.length && routes.length > 1
          ? () => openModal(ModalNames.RouteSelector)
          : () => {}
      }
    >
      <span>Bridge</span>
      <span>{route?.id ?? "…"}</span>
    </div>
  );
};
