import { useQuery } from "@tanstack/react-query";
import { EstimateContractGasParameters } from "viem";
import { usePublicClient, useFeeData } from "wagmi";

export const useEstimateGas = (
  args: EstimateContractGasParameters & { enabled?: boolean }
) => {
  const client = usePublicClient();

  return useQuery(
    [`estimate-contract-gas-${args.value}`],
    () => client.estimateContractGas(args),
    { enabled: args.enabled }
  );
};
