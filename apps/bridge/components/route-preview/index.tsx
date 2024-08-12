import { AnimatePresence, motion } from "framer-motion";

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

  const routesCount = routes.data?.results.length ?? 0;
  const validRoutesCount =
    routes.data?.results.filter((x) => isRouteQuote(x.result)).length ?? 0;

  return (
    <AnimatePresence mode="wait">
      {route.isLoading && (
        <motion.div
          key={"loading route quote"}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`flex gap-2 justify-center w-full items-center py-4`}
        >
          <IconSpinner className="text-muted-foreground w-4 h-4" />
          <span className="text-xs text-muted-foreground">Loading</span>
        </motion.div>
      )}
      {!route.isLoading && !route.data && (
        <motion.div key={"empty route quote"} exit={{ opacity: 0 }} />
      )}

      {route.data &&
        isRouteQuoteError(route.data.result) &&
        routesCount > 1 && (
          <div className="bg-muted rounded-xl p-4 flex flex-col gap-3">
            <Button
              onClick={() => openModal(ModalNames.RouteSelector)}
              size={"xs"}
              variant={"secondary"}
              className="mx-auto text-xs h-6 gap-1"
            >
              <span>See other routes</span>
              <IconCaretRight className="w-3 w-3 fill-foreground" />
            </Button>
          </div>
        )}

      {route.data && !isRouteQuoteError(route.data.result) && (
        <motion.div
          key={"route quote"}
          exit={{ opacity: 0, scale: 0.98 }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`flex flex-col gap-2 relative`}
        >
          <div className="p-4 border rounded-xl">
            <Route provider={route.data.id} quote={route.data.result} />
          </div>
          {validRoutesCount > 1 && (
            <Button
              onClick={() => openModal(ModalNames.RouteSelector)}
              size={"xs"}
              variant={"secondary"}
              className="mx-auto absolute bottom-2.5 right-2 text-xs h-6 pr-2 gap-1"
            >
              <span>{validRoutesCount - 1} More</span>
              <IconCaretRight className="w-3 w-3 fill-foreground" />
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const RoutePreviewOld = () => {
  const routes = useBridgeRoutes();
  const route = useSelectedBridgeRoute();

  const openModal = useConfigState.useAddModal();

  // TODO: Put animate apprearance here
  if (route.isLoading) {
    return (
      <motion.div
        key={"loading route quote"}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`flex flex-col gap-2 justify-center`}
      >
        <IconSpinner className="text-muted-foreground w-4 h-4" />
        <span className="text-xs text-muted-foreground">Loading</span>
      </motion.div>
    );
  }

  if (!route.data) {
    return (
      <motion.div
        key={"empty route quote"}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`flex flex-col gap-2 justify-center`}
      ></motion.div>
    );
  }

  const routesCount = routes.data?.results.length ?? 0;
  const validRoutesCount =
    routes.data?.results.filter((x) => isRouteQuote(x.result)).length ?? 0;

  if (isRouteQuoteError(route.data.result)) {
    return (
      <div className="bg-muted rounded-xl p-4 flex flex-col gap-3">
        <span className="text-xs text-center leading-4 text-muted-foreground">
          {/* TODO: Perhaps we can bring the error text that's currently output to the button and display it here? Leave button only with the action text, disabled if needed */}
          {JSON.stringify(route.data.result)}
        </span>

        {routesCount > 1 && (
          <Button
            onClick={() => openModal(ModalNames.RouteSelector)}
            size={"xs"}
            variant={"secondary"}
            className="mx-auto text-xs h-6 gap-1"
          >
            <span>See other routes</span>
            <IconCaretRight className="w-3 w-3 fill-foreground" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      key={"route quote"}
      exit={{ opacity: 0.1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={`flex flex-col gap-2 relative`}
    >
      <div className="p-4 border rounded-xl">
        <Route provider={route.data.id} quote={route.data.result} />
      </div>
      {validRoutesCount > 1 && (
        <Button
          onClick={() => openModal(ModalNames.RouteSelector)}
          size={"xs"}
          variant={"secondary"}
          className="mx-auto absolute bottom-2.5 right-2 text-xs h-6 pr-2 gap-1"
        >
          <span>{validRoutesCount - 1} More</span>
          <IconCaretRight className="w-3 w-3 fill-foreground" />
        </Button>
      )}
    </motion.div>
  );
};
