import { base, mainnet, optimism, zora } from "viem/chains";

export const baseTokens = [
  // kibshi
  {
    chainId: mainnet.id,
    address: "0x02e7F808990638E9e67E1f00313037EDe2362361",
    name: "KiboShib",
    symbol: "KIBSHI",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/29335/large/foto_no_exif_%2811%29%282%29_%281%29.png",
    opTokenId: "KIBSHI",
    coinGeckoId: "kiboshib",
    standardBridgeAddresses: {
      [base.id]: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
    },
  },
  {
    chainId: base.id,
    address: "0xC7DcCA0a3e69bD762C8DB257f868f76Be36c8514",
    name: "KiboShib",
    symbol: "KIBSHI",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/29335/large/foto_no_exif_%2811%29%282%29_%281%29.png",
    opTokenId: "KIBSHI",
    coinGeckoId: "kiboshib",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
  },

  // EPOCH
  {
    chainId: mainnet.id,
    address: "0x97D0CfEB4FdE54B430307c9482d6f79C761Fe9B6",
    name: "Epoch",
    symbol: "EPOCH",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/33684/standard/EpochLogo_200x200.png",
    standardBridgeAddresses: {
      [base.id]: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
    },
    opTokenId: "EPOCH",
    coinGeckoId: "epoch-island",
  },
  {
    chainId: base.id,
    address: "0x287f0D88e29a3D7AEb4d0c10BAE5B902dB69B17D",
    name: "Epoch",
    symbol: "EPOCH",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/33684/standard/EpochLogo_200x200.png",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "EPOCH",
    coinGeckoId: "epoch-island",
  },

  // RAC
  {
    chainId: mainnet.id,
    address: "0xc22B30E4cce6b78aaaADae91E44E73593929a3e9",
    name: "RAC",
    symbol: "RAC",
    decimals: 18,
    logoURI: "https://etherscan.io/token/images/RAC1_32.png",
    standardBridgeAddresses: {
      [base.id]: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
      [zora.id]: "0x3e2ea9b92b7e48a52296fd261dc26fd995284631",
    },
    opTokenId: "RAC",
  },
  {
    chainId: base.id,
    address: "0x197D38DC562DfB2490eC1A1d5C4CC4319d178Bb4",
    name: "RAC",
    symbol: "RAC",
    decimals: 18,
    logoURI: "https://etherscan.io/token/images/RAC1_32.png",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "RAC",
  },
  {
    chainId: zora.id,
    address: "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2",
    name: "RAC",
    symbol: "RAC",
    decimals: 18,
    logoURI: "https://etherscan.io/token/images/RAC1_32.png",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "RAC",
  },

  // FORTH
  {
    chainId: mainnet.id,
    address: "0x77FbA179C79De5B7653F68b5039Af940AdA60ce0",
    name: "Ampleforth Governance",
    symbol: "FORTH",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/14917/standard/photo_2021-04-22_00.00.03.jpeg",
    standardBridgeAddresses: {
      [base.id]: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
    },
    opTokenId: "FORTH",
  },
  {
    chainId: base.id,
    address: "0x968B2323d4b005C7D39c67D31774FE83c9943A60",
    name: "Ampleforth Governance",
    symbol: "FORTH",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/14917/standard/photo_2021-04-22_00.00.03.jpeg",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "FORTH",
  },

  // BITCOIN https://github.com/ethereum-optimism/ethereum-optimism.github.io/pull/725/files
  {
    chainId: mainnet.id,
    address: "0x72e4f9F808C49A2a61dE9C5896298920Dc4EEEa9",
    name: "HarryPotterObamaSonic10Inu",
    symbol: "BITCOIN",
    decimals: 8,
    logoURI: "https://ethereum-optimism.github.io/data/BITCOIN/logo.svg",
    standardBridgeAddresses: {
      [optimism.id]: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1",
      [base.id]: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
    },
    opTokenId: "BITCOIN",
  },
  {
    chainId: optimism.id,
    address: "0x8a6039fc7a479928b1d73f88040362e9c50db275",
    name: "HarryPotterObamaSonic10Inu",
    symbol: "BITCOIN",
    decimals: 8,
    logoURI: "https://ethereum-optimism.github.io/data/BITCOIN/logo.svg",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "BITCOIN",
  },
  {
    chainId: base.id,
    address: "0x2a06A17CBC6d0032Cac2c6696DA90f29D39a1a29",
    name: "HarryPotterObamaSonic10Inu",
    symbol: "BITCOIN",
    decimals: 8,
    logoURI: "https://ethereum-optimism.github.io/data/BITCOIN/logo.svg",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "BITCOIN",
  },

  // STPT
  {
    chainId: mainnet.id,
    address: "0xDe7D85157d9714EADf595045CC12Ca4A5f3E2aDb",
    name: "STPT Network",
    symbol: "STPT",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/8713/standard/STP.png",
    standardBridgeAddresses: {
      [base.id]: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
    },
    opTokenId: "STPT",
  },
  {
    chainId: base.id,
    address: "0x4489d0a0345eCB216A3994De780d453c7fA6312C",
    name: "STPT Network",
    symbol: "STPT",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/8713/standard/STP.png",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "STPT",
  },
] as const;
