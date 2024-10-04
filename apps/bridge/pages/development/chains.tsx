import { mainnet, optimism } from "viem/chains";

import { useBridgeControllerGetHyperlaneMailboxes } from "@/codegen/index";
import { ChainDto } from "@/codegen/model";
import { Providers } from "@/components/Providers";
import { ChainCard } from "@/components/chain-card";
import { NetworkIcon } from "@/components/network-icon";
import { InjectedStoreProvider } from "@/state/injected";

function Page() {
  const mailboxes = useBridgeControllerGetHyperlaneMailboxes();

  if (process.env["NODE_ENV"] !== "development") {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full px-4 max-w-3xl overflow-scroll h-screen">
      {mailboxes.data?.data.map((x) => (
        <div key={x.id}>
          <ChainCard chain={x.chain} onSelect={() => {}} />
          <NetworkIcon chain={x.chain} />
        </div>
      ))}
    </div>
  );
}

export default function ChainsPage() {
  return (
    <InjectedStoreProvider
      initialValues={{
        acrossDomains: [],
        cctpDomains: [],
        chains: [
          mainnet as unknown as ChainDto,
          optimism as unknown as ChainDto,
        ],
        deployments: [],
        fromChainId: 1,
        toChainId: 1,
        lzDomains: [],
        hyperlaneMailboxes: [],
        app: {
          head: {
            description: "",
            favicon: "",
            name: "",
            og: "",
          },
          images: {
            logoDark: "",
            logoDarkSmall: "",
            logoLight: "",
            logoLightSmall: "",
          },
          links: [],
          theme: {},
          metadata: {},
        },
        host: "",
        superbridgeTestnets: false,
        widget: false,
        superbridgeConfig: null,
      }}
    >
      <Providers>
        <Page />
      </Providers>
    </InjectedStoreProvider>
  );
}
