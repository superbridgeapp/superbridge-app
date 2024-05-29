import { base } from "viem/chains";

import { useDeployments } from "./use-deployments";
import { getChain } from "./use-chain";

export const useAcrossDomains = () => {
  const { deployments } = useDeployments();

  return [
    {
      chain: getChain(1, deployments),
      spokePool: "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5",
    },
    {
      chain: getChain(10, deployments),
      spokePool: "0x6f26Bf09B1C792e3228e5467807a900A503c0281",
    },
    {
      chain: getChain(base.id, deployments),
      spokePool: "0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64",
    },
  ];
};
