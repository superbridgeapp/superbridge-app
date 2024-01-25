const DEDICATED_DEPLOYMENT = process.env["NEXT_PUBLIC_DEDICATED_DEPLOYMENT"];

interface DedicatedDeployment {
  name: string;
  footerLink: string;
  og: {
    title: string;
    description: string;
  };
}

const mapping: { [name: string]: DedicatedDeployment | undefined } = {
  "orb3-mainnet": {
    name: "orb3-mainnet",
    footerLink: "https://orb3.tech",
    og: {
      title: "Orb3 Bridge",
      description: "Bridge ETH and ERC20 tokens into and out of Orb3 Mainnet",
    },
  },
  parallel: {
    name: "parallel",
    footerLink: "https://parallel.fi",
    og: {
      title: "Parallel Bridge",
      description:
        "Bridge ETH and ERC20 tokens into and out of Parallel Mainnet Network",
    },
  },
};

export const dedicatedDeployment = mapping[DEDICATED_DEPLOYMENT ?? ""] ?? null;
