import { Chain } from "viem";

import { ChainDto } from "@/codegen/model";

export interface SettingsModalProps {
  open: boolean;
  setOpen: (b: boolean) => void;

  from: ChainDto | Chain | undefined;

  gasEstimate: bigint | undefined;
}
