import { RouteProvider } from "@/codegen/model";
import { nativeRoutes } from "@/constants/routes";

export const useProviderName = (provider: RouteProvider | null) => {
  if (!provider) return "";

  if (provider === RouteProvider.Lz) return "Layer Zero";
  if (nativeRoutes.includes(provider)) return "Native Bridge";
  return provider.toString();
};
