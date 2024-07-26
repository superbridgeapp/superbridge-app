import { ModalNames } from "@/constants/modal-names";
import { useBridgeRoutes } from "@/hooks/use-bridge-routes";
import { useFees } from "@/hooks/use-fees";
import { useNetworkFee } from "@/hooks/use-network-fee";
import { useReceiveAmount } from "@/hooks/use-receive-amount";
import { useSelectedBridgeRoute } from "@/hooks/use-selected-bridge-route";
import { useApproxTotalBridgeTimeText } from "@/hooks/use-transfer-time";
import { useConfigState } from "@/state/config";
import { isRouteQuote, isRouteQuoteError } from "@/utils/guards";

import { RouteProviderIcon } from "../route-provider-icon";

export const RoutePreview = () => {
  const routes = useBridgeRoutes();
  const route = useSelectedBridgeRoute();
  const fees = useFees();
  const receive = useReceiveAmount();
  const transferTime = useApproxTotalBridgeTimeText();

  const openModal = useConfigState.useAddModal();

  const networkFee = useNetworkFee();

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
    <div className={`flex flex-col gap-2 pt-1`}>
      <RouteProviderIcon provider={route.data.id} />
      <div>
        Receive: {receive.data?.token.formatted} (
        {receive.data?.fiat?.formatted ?? "$0"})
      </div>
      <div>
        Fees: {fees.data?.totals.tokenFormatted} (
        {fees.data?.totals.fiatFormatted ?? "$0"})
      </div>
      <div>
        Gas fee: {networkFee.data?.token.formatted} (
        {networkFee.data?.fiat?.formatted ?? "$0"})
      </div>
      <div>Bridge time: {transferTime.data}</div>

      {hasMore && (
        <button onClick={() => openModal(ModalNames.RouteSelector)}>
          More routes
        </button>
      )}
    </div>
  );
};
