import {
  SUPERBRIDGE_HOST,
  SUPERBRIDGE_TESTNET_HOST,
  V3_SUPERBRIDGE_HOST,
} from "@/constants/hosts";

const mainnets = [SUPERBRIDGE_HOST, V3_SUPERBRIDGE_HOST];
const testnets = [SUPERBRIDGE_TESTNET_HOST];
const all = [...testnets, ...mainnets];

export const isSuperbridge = (host: string) => all.includes(host);

export const isSuperbridgeMainnet = (host: string) => mainnets.includes(host);
