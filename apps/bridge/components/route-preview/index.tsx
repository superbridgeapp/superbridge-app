import { AnimatePresence, motion } from "framer-motion";

import { useBridgeRoutes } from "@/hooks/routes/use-bridge-routes";
import { useSelectedBridgeRoute } from "@/hooks/routes/use-selected-bridge-route";
import { useModal } from "@/hooks/use-modal";
import { isRouteQuote, isRouteQuoteError } from "@/utils/guards";

import { IconCaretRight, IconSpinner } from "../icons";
import { Button } from "../ui/button";
import { Route } from "./route";

export const RoutePreview = () => {
  const routes = useBridgeRoutes();
  const route = useSelectedBridgeRoute();

  const routeSelectorModal = useModal("RouteSelector");

  const validRoutesCount =
    routes.data?.results.filter((x) => isRouteQuote(x.result)).length ?? 0;

  const seeOtherRoutes =
    (!route.data || isRouteQuoteError(route.data.result)) &&
    validRoutesCount >= 1;

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

      {!route.isLoading && seeOtherRoutes && (
        <div className="bg-muted rounded-xl p-4 flex flex-col gap-3">
          <Button
            onClick={() => routeSelectorModal.open()}
            size={"xs"}
            variant={"secondary"}
            className="mx-auto text-xs h-6 gap-1"
          >
            <span>See other routes</span>
            <IconCaretRight className="w-3 w-3 fill-foreground" />
          </Button>
        </div>
      )}

      {!route.isLoading &&
        route.data &&
        !isRouteQuoteError(route.data.result) && (
          <motion.div
            key={"route quote"}
            exit={{ opacity: 0, scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`flex flex-col gap-2 relative`}
          >
            <div className="p-4 border rounded-xl">
              <Route
                provider={route.data!.id}
                quote={route.data!.result}
                allowDetailClicks
                onRoutesClick={
                  validRoutesCount > 1
                    ? () => routeSelectorModal.open()
                    : undefined
                }
              />
            </div>
          </motion.div>
        )}
    </AnimatePresence>
  );
};
