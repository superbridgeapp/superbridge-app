import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { isAddressEqual, Address, erc721Abi } from "viem";
import { useReadContract } from "wagmi";

import { BridgeNftDto, NftDepositDto } from "@/codegen/model";

function ipfs(image: string) {
  return image
    .replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
    .replace("https://ipfs.moralis.io:2053", "https://cloudflare-ipfs.com");
}

// ethereum:0x3f228cbcec3ad130c45d21664f2c7f5b23130d23@5/tokenURI?uint256=14060
function parseBridgedNftMetadata(uri: string) {
  if (!uri.startsWith("ethereum:")) {
    return { uri };
  }

  const [_ethereum, address, originChain, _tokenURI, _uint256, tokenId] =
    uri.split(new RegExp("\\:|\\?|\\@|\\=|\\/"));

  if (
    _ethereum !== "ethereum" ||
    _tokenURI !== "tokenURI" ||
    _uint256 !== "uint256"
  ) {
    return { uri };
  }

  return {
    chainId: originChain,
    address,
    tokenId,
  };
}

interface NftRenderParams {
  address: string;
  tokenId: string;
  chainId: string;
  image?: string;
  tokenUri?: string;
}

const isNftDepositDto = (
  nft: NftDepositDto | NftRenderParams | BridgeNftDto
): nft is NftDepositDto => {
  return (nft as NftDepositDto).type === "nft-deposit";
};

const isBridgeNftDto = (
  nft: NftDepositDto | NftRenderParams | BridgeNftDto
): nft is BridgeNftDto => {
  return (
    !!(nft as BridgeNftDto).localConfig && !!(nft as BridgeNftDto).remoteConfig
  );
};

/**
 * We can render five types of NFTs with this component
 *
 * 1. Where we get the image, easy
 * 2. Where we the tokenURI, pull image
 * 3. Where we get just the tokenId, address and chainId
 *    Pull tokenURI
 *    Pull image
 * 4. 3 but where the tokenURI is prefixed with ethereum:
 * 5. 3 but where the token has been burned on the local chain.
 *    Here we need to fallback to the remote chain tokenURI
 */
export function NftImage({
  nft: injectedNft,
  className,
}: {
  nft:
    | NftRenderParams
    | BridgeNftDto
    | (NftDepositDto & { localChainId: string; remoteChainId: string });
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const nft: NftRenderParams = isNftDepositDto(injectedNft)
    ? {
        address: injectedNft.data.localTokenAddress,
        chainId: injectedNft.localChainId,
        tokenId: injectedNft.data.tokenId,
      }
    : isBridgeNftDto(injectedNft)
    ? {
        address: injectedNft.localConfig.address,
        chainId: injectedNft.localConfig.chainId,
        tokenId: injectedNft.tokenId,
        tokenUri: injectedNft.tokenUri,
        image: injectedNft.image,
      }
    : injectedNft;

  const localTokenUriRead = useReadContract({
    abi: erc721Abi,
    functionName: "tokenURI",
    address: nft.address as Address,
    args: [BigInt(nft.tokenId)],
    chainId: parseInt(nft.chainId),
    query: {
      enabled: !nft.image && !nft.tokenUri,
    },
  });

  /**
   * This is a little messy but handles the case where the local token
   * has been burned, as happens with OptimismMintable NFTs that have
   * been withdrawn
   */
  const dto = injectedNft as any;
  const remoteTokenUriRead = useReadContract({
    abi: erc721Abi,
    functionName: "tokenURI",
    address: dto.data?.remoteTokenAddress as Address,
    args: [BigInt(nft.tokenId)],
    chainId: dto.remoteChainId ? parseInt(dto.remoteChainId) : 0,
    query: {
      enabled: isNftDepositDto(injectedNft) && !!localTokenUriRead.error,
    },
  });

  let tokenUri =
    nft.tokenUri ?? localTokenUriRead.data ?? remoteTokenUriRead.data;

  // handle testnet MAYC
  if (
    isAddressEqual(
      nft.address as Address,
      "0x3f228cBceC3aD130c45D21664f2C7f5b23130d23"
    ) ||
    isAddressEqual(
      nft.address as Address,
      "0x18946D4284534a9D74a0B9fD7EC35C7C197d3Dda"
    )
  ) {
    const newTokenId = (parseInt(nft.tokenId) % 10_000).toString();
    if (tokenUri) {
      tokenUri = tokenUri.replace(nft.tokenId, newTokenId);
    }
  }

  const imageRead = useQuery({
    queryKey: ["nft", tokenUri],
    queryFn: async () => {
      if (!tokenUri) throw new Error("No token URI");

      const metadata = await fetch(tokenUri).then((x) => x.json());
      return ipfs(metadata.image);
    },
    enabled: !nft.image && !!tokenUri && !tokenUri.startsWith("ethereum:"),
  });

  let image = nft.image ?? imageRead.data;

  // handle testnet MAYC
  if (
    isAddressEqual(
      nft.address as Address,
      "0x3f228cBceC3aD130c45D21664f2C7f5b23130d23"
    ) ||
    isAddressEqual(
      nft.address as Address,
      "0x18946D4284534a9D74a0B9fD7EC35C7C197d3Dda"
    )
  ) {
    const newTokenId = (parseInt(nft.tokenId) % 10_000).toString();
    if (image) {
      image = image.replace(nft.tokenId, newTokenId);
    }
  }

  if (tokenUri?.startsWith("ethereum:")) {
    const { address, chainId, tokenId } = parseBridgedNftMetadata(tokenUri);
    if (address && chainId && tokenId) {
      return (
        <NftImage nft={{ address, chainId, tokenId }} className={className} />
      );
    }
  }

  return (
    <div className="transition">
      {!loaded && <Skeleton className={className} />}
      <img
        src={image}
        className={clsx(className, !loaded && "!h-0")}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
