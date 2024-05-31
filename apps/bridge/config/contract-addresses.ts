import { Address } from "viem";

export interface NetworkConfig {
  contracts: {
    l1Bridge: Address;
    l2Bridge: Address;
  };
}

export const configurations: { [name: string]: NetworkConfig | undefined } = {
  // Superchain
  // ["base"]: {
  //   contracts: {
  //     l1Bridge: "0xB54047FA231b05Bfe3AA96322D54cC583d40E925",
  //     l2Bridge: "0xAFf88cf3ffC600bAFC528cD182bA462deF6f3df3",
  //   },
  // },
  // ["optimism-testnet"]: {
  //   contracts: {
  //     l1Bridge: "0x0d6bB51CcA24F454bEd237f31368BABa3aA6949e",
  //     l2Bridge: "0x676E20B8dD26Ef024FE8330B948418B3B42BA91B",
  //   },
  // },
  // ["optimism"]: {
  //   contracts: {
  //     l1Bridge: "0xB54047FA231b05Bfe3AA96322D54cC583d40E925",
  //     l2Bridge: "0x48320667485FA16b43dfB44d8F337762854D9979",
  //   },
  // },
  // ["zora"]: {
  //   contracts: {
  //     l1Bridge: "0xB54047FA231b05Bfe3AA96322D54cC583d40E925",
  //     l2Bridge: "0x89E425726AC6a791Bb17c5D77d69C41033eb5aEb",
  //   },
  // },
  // ["pgn"]: {
  //   contracts: {
  //     l1Bridge: "0xB54047FA231b05Bfe3AA96322D54cC583d40E925",
  //     l2Bridge: "0x3D50EE8FAd8eb2299645CA86237022B82487cEaC",
  //   },
  // },
  // ["kroma"]: {
  //   contracts: {
  //     l1Bridge: "0xB54047FA231b05Bfe3AA96322D54cC583d40E925",
  //     l2Bridge: "0x3A88F50e7B7b039eB67BE5f9E8d15714d9be4b04",
  //   },
  // },
  // ["arbitrum-one"]: {
  //   contracts: {
  //     l1Bridge: "0xFdFb87Be3c5b32e6fe470A6f78f2aA4632398cEf",
  //     l2Bridge: "0x3A88F50e7B7b039eB67BE5f9E8d15714d9be4b04",
  //   },
  // },
  // ["arbitrum-nova"]: {
  //   contracts: {
  //     l1Bridge: "0xFdFb87Be3c5b32e6fe470A6f78f2aA4632398cEf",
  //     l2Bridge: "0x3A88F50e7B7b039eB67BE5f9E8d15714d9be4b04",
  //   },
  // },
  // rollux: {
  //   contracts: {
  //     l1Bridge: "0x3A88F50e7B7b039eB67BE5f9E8d15714d9be4b04",
  //     l2Bridge: "0x3A88F50e7B7b039eB67BE5f9E8d15714d9be4b04",
  //   },
  // },
};
