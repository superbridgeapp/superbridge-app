import {
  SUPERBRIDGE_HOST,
  SUPERBRIDGE_TESTNET_HOST,
  V3_SUPERBRIDGE_HOST,
} from "@/constants/hosts";

export const isSuperbridge = (host: string) =>
  host === SUPERBRIDGE_HOST ||
  host === SUPERBRIDGE_TESTNET_HOST ||
  host === V3_SUPERBRIDGE_HOST;
