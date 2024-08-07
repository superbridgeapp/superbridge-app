import { MultiChainToken } from "@/types/token";

// TODO: filter these

export const isCctp = (token: MultiChainToken | null) => {
  return false;
};

export const isBridgedUsdc = (token: MultiChainToken) => {
  return false;
};
