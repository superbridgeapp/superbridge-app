const DEDICATED_DEPLOYMENT = process.env["NEXT_PUBLIC_DEDICATED_DEPLOYMENT"];

interface DedicatedDeployment {
  name: string;
  network: string;
  footerLink?: string;
  og: {
    title: string;
    description: string;
  };
  additionalLinks?: { text: string; link: string }[];
}

const mapping: { [name: string]: DedicatedDeployment | undefined } = {
  "orb3-mainnet": {
    name: "orb3-mainnet",
    footerLink: "https://orb3.tech",
    og: {
      title: "Orb3 Bridge",
      description: "Bridge ETH and ERC20 tokens into and out of Orb3 Mainnet",
    },
    network: "Orb3 Mainnet",
  },
  parallel: {
    name: "parallel",
    footerLink: "https://parallel.fi",
    og: {
      title: "Parallel Bridge",
      description:
        "Bridge ETH and ERC20 tokens into and out of Parallel Mainnet Network",
    },
    additionalLinks: [
      {
        text: "Parallel App",
        link: "https://app.parallel.fi",
      },
    ],
    network: "Parallel Mainnet",
  },
  base: {
    name: "base",
    footerLink: "https://base.org",
    og: {
      title: "Base Bridge",
      description: "Bridge ETH and ERC20 tokens into and out of Base",
    },
    network: "Base",
  },
  optimism: {
    name: "optimism",
    footerLink: "https://optimism.io",
    og: {
      title: "OP Mainnet Bridge",
      description: "Bridge ETH and ERC20 tokens into and out of OP Mainnet",
    },
    network: "OP Mainnet",
  },
  "lumio-mainnet": {
    name: "lumio-mainnet",
    footerLink: "https://lumio.io",
    og: {
      title: "Lumio Bridge",
      description: "Bridge ETH and ERC20 tokens into and out of Lumio Mainnet",
    },
    network: "Lumio Mainnet",
  },
  "stack-mainnet": {
    name: "stack-mainnet",
    footerLink: "https://www.stack.so",
    og: {
      title: "Stack Bridge",
      description: "Bridge ETH and ERC20 tokens into and out of Stack Mainnet",
    },
    network: "Stack Mainnet",
  },
  ["metal-mainnet"]: {
    name: "metal-mainnet",
    footerLink: "https://metall2.com",
    og: {
      title: "Metal L2 Bridge",
      description: "Bridge ETH and ERC20 tokens into and out of Metal L2",
    },
    network: "Metal L2",
  },
  ["metal-l2-testnet-3bbzi9kufn"]: {
    name: "metal-l2-testnet-3bbzi9kufn",
    footerLink: "https://metall2.com",
    og: {
      title: "Metal L2 Testnet Bridge",
      description:
        "Bridge ETH and ERC20 tokens into and out of Metal L2 Testnet",
    },
    network: "Metal L2 Testnet",
  },
  ["camp-network-4xje7wy105"]: {
    name: "camp-network-4xje7wy105",
    footerLink: "https://www.campnetwork.xyz/",
    og: {
      title: "Camp Testnet Bridge",
      description: "Bridge ETH and ERC20 tokens into and out of Camp Testnet",
    },
    network: "Camp Testnet",
  },
  ["clique-mainnet"]: {
    name: "clique-mainnet",
    footerLink: "https://www.myclique.io/",
    og: {
      title: "Clique Mainnet Bridge",
      description: "Bridge ETH and ERC20 tokens into and out of Clique Mainnet",
    },
    network: "Clique Mainnet",
  },
  ["grubby-red-rodent-a6u9rz8x70"]: {
    name: "grubby-red-rodent-a6u9rz8x70",
    og: {
      title: "Ebi Testnet Bridge",
      description: "Bridge ETH and ERC20 tokens into and out of Ebi Testnet",
    },
    network: "Ebi Testnet",
  },
  ["ebi-mainnet"]: {
    name: "ebi-mainnet",
    og: {
      title: "Ebi Mainnet Bridge",
      description: "Bridge ETH and ERC20 tokens into and out of Ebi Mainnet",
    },
    network: "Ebi Mainnet",
  },
  ["mint-sepolia-testnet-ijtsrc4ffq"]: {
    name: "mint-sepolia-testnet-ijtsrc4ffq",
    og: {
      title: "Mint Testnet Bridge",
      description: "Bridge ETH and ERC20 tokens into and out of Mint Testnet",
    },
    network: "Mint Testnet",
  },
};

export const dedicatedDeployment = mapping[DEDICATED_DEPLOYMENT ?? ""] ?? null;
