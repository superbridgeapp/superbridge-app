import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useMemo } from "react";
import { fallback, http } from "wagmi";

import { DeploymentDto } from "@/codegen/model";

export function useStatusWagmiConfig(deployments: DeploymentDto[]) {
  return useMemo(() => {
    const chains = deployments.flatMap((d) => [d.l1, d.l2]);
    const transports = chains.reduce(
      (accum, chain) => ({
        ...accum,
        [chain.id]: fallback(
          chain.rpcUrls.default.http.map((url) => http(url))
        ),
      }),
      {}
    );

    return getDefaultConfig({
      appName: "Superbridge",
      projectId: "50c3481ab766b0e9c611c9356a42987b",
      // @ts-expect-error
      chains,
      transports,
      ssr: true,
    });
  }, [deployments]);
}
