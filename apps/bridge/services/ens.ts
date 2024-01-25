import { Address, createPublicClient, http, isAddressEqual } from "viem";
import { mainnet } from "wagmi";

import { withTimeout } from "@/utils/with-timeout";

interface ProfileProps {
  name: string | null;
  address: Address;
  avatar: string | null;
}

const urls = [
  "https://eth.drpc.org",
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com",
  "https://cloudflare-eth.com",
];

export const resolveName = async (
  name: string
): Promise<ProfileProps | null> => {
  for (const url of urls) {
    const client = createPublicClient({ chain: mainnet, transport: http(url) });
    const result = await withTimeout(() =>
      Promise.all([
        client.getEnsAddress({ name }),
        client.getEnsAvatar({ name }),
      ])
    ).catch(() => null);
    if (result?.[0]) {
      const [address, avatar] = result;
      return {
        name,
        address,
        avatar,
      };
    }
  }

  return null;
};

export const resolveAddress = async (address: Address) => {
  for (const url of urls) {
    const client = createPublicClient({ chain: mainnet, transport: http(url) });

    const name = await withTimeout(
      () =>
        client.getEnsName({
          address,
        }),
      2_000
    ).catch((e) => {
      return null;
    });

    if (name) {
      const result = await withTimeout(
        () =>
          Promise.all([
            client.getEnsAddress({ name }),
            client.getEnsAvatar({ name }),
          ]),
        2_000
      ).catch(() => null);
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
  }

  return null;
};
