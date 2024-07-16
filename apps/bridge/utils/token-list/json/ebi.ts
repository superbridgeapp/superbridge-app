import { sepolia } from "viem/chains";

import { ArbitrumToken } from "@/types/token";

export const ebi: ArbitrumToken[] = [
  // MUSDT
  {
    chainId: sepolia.id,
    address: "0x5a5297A52b1faCa0958084D4D424E774b0EDE7d2",
    name: "MockUSDT",
    symbol: "MUSDT",
    decimals: 6,
    logoURI: "",
    arbitrumBridgeInfo: {
      [98882]: "0x13886D513e91E08381462961d1a42E92e8478884",
    },
  },
  {
    chainId: 98882,
    address: "0x10cc404C211e2CcdB879c06EAA3Ee1412f9Dd64B",
    name: "MockUSDT",
    symbol: "MUSDT",
    decimals: 6,
    logoURI: "",
    arbitrumBridgeInfo: {
      [sepolia.id]: "0x10dD388dAe915f697AD980Ef3424A916fB52Fc83",
    },
  },
] as const;
