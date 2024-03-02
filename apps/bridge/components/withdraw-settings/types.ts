import { Chain } from "wagmi";

import { ChainDto } from "@/codegen/model";

export interface SettingsModalProps {
  open: boolean;
  setOpen: (b: boolean) => void;

  from: ChainDto | Chain | undefined;

  gasEstimate: number;
}
