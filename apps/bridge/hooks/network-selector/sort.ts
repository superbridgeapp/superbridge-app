import { useMemo } from "react";
import {
  base,
  fraxtal,
  lisk,
  metalL2,
  mode,
  pgn,
  redstone,
  zora,
} from "viem/chains";

import { ChainDto } from "@/codegen/model";

const order = [
  1,
  base.id,
  10,
  mode.id,
  metalL2.id,
  lisk.id,
  fraxtal.id,
  redstone.id,
  zora.id,
  pgn.id,
];

export const useSortedChains = (chains: ChainDto[]) => {
  return useMemo(() => {
    return chains.sort((a, b) => {
      let aPriority = order.indexOf(a.id);
      let bPriority = order.indexOf(b.id);

      if (aPriority === -1) {
        aPriority = 100;
      }
      if (bPriority === -1) {
        bPriority = 100;
      }

      console.log(a.name, b.name, aPriority, bPriority, bPriority - aPriority);
      return aPriority < bPriority ? -1 : 1;
    });
  }, [chains]);
};
