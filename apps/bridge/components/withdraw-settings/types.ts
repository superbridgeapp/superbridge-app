import { UseQueryResult } from "@tanstack/react-query";
import { Chain } from "viem";

import { ChainDto } from "@/codegen/model";

export interface SettingsModalProps {
  open: boolean;
  setOpen: (b: boolean) => void;

  from: ChainDto | Chain | undefined;

  bridgeFee: UseQueryResult<bigint, Error>;
  gasEstimate: number;
}
