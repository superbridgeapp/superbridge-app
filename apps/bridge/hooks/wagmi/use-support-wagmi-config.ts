import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { fallback, http } from "wagmi";

import { DeploymentDto } from "@/codegen/model";

export function useSupportWagmiConfig(deployment: DeploymentDto) {
  const transports = [deployment.l1, deployment.l2].reduce(
    (accum, chain) => ({
      ...accum,
      [chain.id]: fallback(chain.rpcUrls.default.http.map((url) => http(url))),
    }),
    {}
  );

  return getDefaultConfig({
    appName: "",
    projectId: "50c3481ab766b0e9c611c9356a42987b",
    // @ts-expect-error
    chains,
    transports,
    ssr: true,
  });
}
