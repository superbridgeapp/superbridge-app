import { useHyperlaneControllerGetWarpRouteYamlFile } from "@/codegen/index";
import { useHyperlaneState } from "@/state/hyperlane";

export const useHyperlaneCustomRoutes = () => {
  const customRoutesId = useHyperlaneState.useCustomRoutesId();
  return useHyperlaneControllerGetWarpRouteYamlFile(customRoutesId ?? "", {
    query: { enabled: !!customRoutesId },
  }).data?.data;
};
