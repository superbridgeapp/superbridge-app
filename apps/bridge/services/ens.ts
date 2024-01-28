import {
  Address,
  createPublicClient,
  http,
  fallback,
  isAddressEqual,
} from "viem";
import { mainnet } from "wagmi";

interface ProfileProps {
  name: string | null;
  address: Address;
  avatar: string | null;
}

const urls = [
  // "https://eth.merkle.io",
  // "https://eth.drpc.org",
  "https://eth.llamarpc.com",
  "https://cloudflare-eth.com",
];

const getEnsClient = () =>
  createPublicClient({
    chain: mainnet,
    transport: fallback(urls.map((url) => http(url))),
  });

export const resolveName = async (
  name: string
): Promise<ProfileProps | null> => {
  const client = getEnsClient();

  const result = await Promise.all([
    client.getEnsAddress({ name }),
    client.getEnsAvatar({ name }),
  ]).catch(() => null);

  if (result?.[0]) {
    const [address, avatar] = result;
    return {
      name,
      address,
      avatar,
    };
  }

  return null;
};

export const resolveAddress = async (address: Address) => {
  const client = getEnsClient();

  const name = await client
    .getEnsName({
      address,
    })
    .catch(() => null);

  if (name) {
    const result = await Promise.all([
      client.getEnsAddress({ name }),
      client.getEnsAvatar({ name }),
    ]).catch(() => null);
    if (result) {
      const [resolvedAddress, avatar] = result;
      // anyone can claim reverse resolution. This is a safety check
      if (resolvedAddress && !isAddressEqual(address, resolvedAddress)) {
        return null;
      }
      return {
        name,
        address,
        avatar,
      };
    }
  }

  return null;
};
