import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";

import { useFromChain } from "./use-chain";

export const useIsContractAccount = () => {
  const from = useFromChain();
  const account = useAccount();
  const client = usePublicClient({ chainId: from?.id });

  return useQuery({
    queryKey: [
      `is-contract-${account.address}-${client?.chain.id}-${from?.id}`,
    ],
    queryFn: () => {
      if (!from?.id) {
        throw new Error("From chain not initialised");
      }

      if (!account.address) {
        throw new Error("No account connected");
      }

      return client?.getBytecode({ address: account.address }).then((x) => !!x);
    },
    enabled: !!account.address,
  });
};
