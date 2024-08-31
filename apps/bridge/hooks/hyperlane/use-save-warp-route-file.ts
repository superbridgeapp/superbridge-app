import { useMutation } from "@tanstack/react-query";

import { useHyperlaneControllerResolveWarpRouteYamlFile } from "@/codegen/index";
import { useHyperlaneState } from "@/state/hyperlane";

export const useSaveWarpRouteFile = () => {
  const setSaved = useHyperlaneState.useSetCustomWarpRoutesFile();
  const setMailboxes = useHyperlaneState.useSetCustomMailboxes();
  const setTokens = useHyperlaneState.useSetCustomTokens();

  const resolveWarpRoutes = useHyperlaneControllerResolveWarpRouteYamlFile();

  return useMutation({
    mutationFn: async (file: string) => {
      setSaved(file);

      const result = await resolveWarpRoutes
        .mutateAsync({
          data: { file },
        })
        .catch(() => null);

      if (result) {
        setMailboxes(result.data.mailboxes);
        setTokens(result.data.tokens);
        return true;
      }

      return false;
    },
  });
};
