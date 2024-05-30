import { Address, encodeFunctionData } from "viem";

import { L1ERC721BridgeAbi } from "@/abis/L1ERC721Bridge";
import { BridgeNftDto, DeploymentDto } from "@/codegen/model";
import { GRAFFITI } from "@/constants/extra-data";

import { TransactionArgs } from "../types";

export type NftDepositArgs = {
  deployment: DeploymentDto;
  nft: BridgeNftDto;
  recipient: Address;
};

export type NftDepositTxResolver = (
  args: NftDepositArgs
) => TransactionArgs | undefined;

export const optimismBridgeNftArgs: NftDepositTxResolver = ({
  nft,
  recipient,
}) => {
  return {
    approvalAddress: nft.localConfig.bridgeAddress as Address,
    tx: {
      to: nft.localConfig.bridgeAddress as Address,
      data: encodeFunctionData({
        abi: L1ERC721BridgeAbi,
        functionName: "bridgeERC721To",
        args: [
          nft.localConfig.address as Address, // _localToken
          nft.remoteConfig.address as Address, // _remoteToken
          recipient, // _to
          BigInt(nft.tokenId), // _amount
          300_000, // _minGasLimit
          GRAFFITI, // _extraData
        ],
      }),
      value: BigInt(0),
      chainId: parseInt(nft.localConfig.chainId),
    },
  };
};
