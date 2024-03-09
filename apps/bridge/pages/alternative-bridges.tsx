import Image from "next/image";

import { PageTransition } from "@/components/PageTransition";
import { useTheme } from "next-themes";
import PageNav from "@/components/page-nav";
import PageFooter from "@/components/page-footer";

const BridgeCard = ({
  title,
  src,
  alt,
  desc,
  url,
}: {
  title: string;
  src: string;
  alt: string;
  desc: string;
  url: string;
}) => {
  return (
    <article className="rounded-[24px] p-6 border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all hover:scale-105">
      <a href={url} target="_blank" rel="noreferrer">
        <div className="flex gap-2 items-center mb-3">
          <figure>
            <Image
              height={48}
              width={48}
              className="rounded-full"
              src={src}
              alt={alt}
            />
          </figure>
          <h4 className="text-xl font-bold tracking-tight">{title}</h4>
        </div>
        <p className="text-sm">{desc}</p>
      </a>
    </article>
  );
};

const AlternativeBridges = () => {
  return (
    <div className="w-screen h-screen overflow-y-auto">
      <PageNav />
      <div className="bg-zinc-50 dark:bg-zinc-950 w-full">
        <div className="p-8 md:p-24">
          <div className="flex flex-col gap-3 items-center md:px-8 pt-16 pb-10">
            <h3 className="text-5xl md:text-6xl font-bold tracking-tighter text-center">
              Alternative Bridges
            </h3>
            <p className="text-base md:text-xl text-pretty font-medium tracking-tighter text-center max-w-xl">
              Sometimes you need something a little different to the{" "}
              <span className="underline">Superchain Native Bridge.</span>{" "}
              {"Here's"} some great alternatives depending on your needs…
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
            <BridgeCard
              title="Hop Exchange"
              desc="Hop allows you to quickly bridge assets between L1 and various
                  L2 solutions."
              src="/img/alt-bridges/Hop Exchange-icon.png"
              alt="Hop Exchange"
              url={`https://app.hop.exchange/send?sourceNetwork=ethereum&amp;destNetwork=optimism&amp;token=USDC`}
            />
            <BridgeCard
              title="Stargate"
              desc="Stargate is a fully composable liquidity transport protocol
                  that lives at the heart of Omnichain DeFi."
              src="/img/alt-bridges/Stargate-icon.png"
              alt="Stargate"
              url="https://stargate.finance/"
            />
            <BridgeCard
              title="Synapse Protocol"
              desc="Synapse Protocol allows you to transfer and swap assets across
                  Ethereum, Layer 2 chains, BSC, Avalanche and more."
              src="/img/alt-bridges/Stargate-icon.png"
              alt="Synapse Protocol"
              url={`https://synapseprotocol.com/?inputCurrency=USDC&amp;outputCurrency=USDC&amp;outputChain=10`}
            />
            <BridgeCard
              title="Across"
              desc="Instantly send assets between layer 2 rollups, as well as to
                  and from Ethereum."
              src="/img/alt-bridges/Across-icon.png"
              alt="Across"
              url={`https://synapseprotocol.com/?inputCurrency=USDC&amp;outputCurrency=USDC&amp;outputChain=10`}
            />
            <BridgeCard
              title="Celer"
              desc="Celer Network is a blockchain interoperability protocol
                  enabling a one-click UX accessing tokens, DeFi, GameFi, NFTs,
                  etc., across multiple chains."
              src="/img/alt-bridges/Celer-icon.png"
              alt="Celer"
              url="https://www.celer.network/"
            />
            <BridgeCard
              title="Altitude"
              desc="Altitude is a composable Blue-chip asset bridge built on
                  LayerZero, offering enhanced security via SGF (Secured
                  Guaranteed Finality)."
              src="/img/alt-bridges/Altitude-icon.png"
              alt="Altitude"
              url="https://www.altitudedefi.com/"
            />
            <BridgeCard
              title="Beamer"
              desc="Beamer allows consolidation of assets across rollups, make P2P
                  payments to recipients on other rollups, and access dApps on
                  other rollups."
              src="/img/alt-bridges/Beamer-icon.png"
              alt="Beamer"
              url="https://app.beamerbridge.com"
            />
            <BridgeCard
              title="Biconomy Hyphen"
              desc="Biconomy, a web3 infra project solving transaction layer
                  problems, built Hyphen, the fastest &amp; cheapest cross-chain
                  liquidity bridge in the market."
              src="/img/alt-bridges/Biconomy Hyphen-icon.png"
              alt="Biconomy Hyphen"
              url="https://hyphen.biconomy.io/"
            />
            <BridgeCard
              title="Bungee"
              desc="Bungee is the Google Maps for the multi-chain world. A bridge
                  aggregator that helps users discover the best bridges to move
                  their assets across chains."
              src="/img/alt-bridges/Bungee-icon.png"
              alt="Bungee"
              url="https://www.bungee.exchange/"
            />
            <BridgeCard
              title="Celer cBridge"
              desc="Celer cBridge is a decentralized and non-custodial asset
                  bridge that supports 130+ different tokens across 30+
                  blockchains and layer-2 rollups."
              src="/img/alt-bridges/Celer cBridge-icon.png"
              alt="Celer cBridge"
              url="https://cbridge.celer.network/"
            />
            <BridgeCard
              title="ChainPort"
              desc="ChainPort.io allows users to port their tokens between
                  different blockchains."
              src="/img/alt-bridges/chainport.svg"
              alt="ChainPort"
              url="https://www.chainport.io/"
            />
            <BridgeCard
              title="Chainge Finance"
              desc="Chainge Finance is a leading DeFi app that currently stands as
                  one of the most liquid cross-chain aggregated DEXs on the
                  market and a main bridge infrastructure provider supporting
                  thousands of assets."
              src="/img/alt-bridges/Chainge-icon.svg"
              alt="Chainge Finance"
              url="https://dapp.chainge.finance/"
            />
            <BridgeCard
              title="Connext"
              desc="Connext is a leading protocol for fast, fully noncustodial
                  transfers and contract calls between EVM-compatible systems."
              src="/img/alt-bridges/Connext-icon.png"
              alt="Connext"
              url="https://dapp.chainge.finance/"
            />
            <BridgeCard
              title="Elk Finance"
              desc="Elk Finance is a peer-to-peer network for cross-chain value
                  transfers. ElkNet makes it easy for anyone to move value and
                  exchange crypto cross-chain."
              src="/img/alt-bridges/Elk Finance-icon.png"
              alt="Elk Finance"
              url="https://elk.finance/"
            />
            <BridgeCard
              title="Hashport"
              desc="Interoperability solution enabling fast &amp; secure token
                  porting."
              src="/img/alt-bridges/Hashport-icon.png"
              alt="Hashport"
              url="https://www.hashport.network/"
            />
            <BridgeCard
              title="Holograph"
              desc="Multichain digital asset composability protocol."
              src="/img/alt-bridges/Holograph-icon.png"
              alt="Holograph"
              url="https://www.holograph.xyz/"
            />
            <BridgeCard
              title="LI.FI"
              desc="Provides bridge aggregation with DEX-connectivity."
              src="/img/alt-bridges/lifi.svg"
              alt="LI.FI"
              url="https://li.fi/"
            />
            <BridgeCard
              title="LayerSwap"
              desc="Save 10x on fees when moving crypto from Coinbase, Binance,
                  Huobi or FTX US to Optimism"
              src="/img/alt-bridges/LayerSwap-icon.png"
              alt="LayerSwap"
              url="https://www.layerswap.io/"
            />
            <BridgeCard
              title="LayerSync"
              desc="Comprehensive solution for minting ONFTs and seamlessly
                  bridging them across a selection of EVM (Ethereum Virtual
                  Machine)-compatible chains"
              src="/img/alt-bridges/LayerSync-icon.png"
              alt="LayerSync"
              url="https://layersync.org/"
            />
            <BridgeCard
              title="Meson"
              desc="Meson is the faster and safer way to execute low-cost,
                  zero-slippage stablecoin cross-chain swaps between Optimism,
                  leading blockchains and L2s."
              src="/img/alt-bridges/Meson-icon.png"
              alt="Meson"
              url="https://meson.fi/"
            />
            <BridgeCard
              title="O3 Swap"
              desc="Cross-chain aggregation protocol."
              src="/img/alt-bridges/O3 Swap-icon.png"
              alt="O3 Swap"
              url="https://o3swap.com/"
            />
            <BridgeCard
              title="Omnihub"
              desc="OmniHub is a universal omnichain platform allowing users to
                  interact with various networks via LayerZero. OmniHub users
                  engage by minting ONFTs and NFTs on various networks."
              src="/img/alt-bridges/Omnihub-icon.png"
              alt="Omnihub"
              url="https://omnihub.xyz/"
            />
            <BridgeCard
              title="Optimism Bridge"
              desc="The Optimism Bridge allows you to transfer assets between L1
                  and Optimism."
              src="/img/alt-bridges/Optimism Bridge-icon.png"
              alt="Optimism Bridge"
              url="https://app.optimism.io/bridge"
            />
            <BridgeCard
              title="Orbiter"
              desc="A decentralized cross-rollup Layer 2 bridge with a contract
                  only on the destination side."
              src="/img/alt-bridges/Orbiter-icon.png"
              alt="Orbiter"
              url="https://www.orbiter.finance/"
            />
            <BridgeCard
              title="Owlto Finance"
              desc="A decentralized cross-rollup Layer 2 bridge with a contract
                  only on the destination sideOwlto Finance is a cross-rollup module developed based on the
                  Ethereum L2 rollup solution, providing a low-cost, secure, and
                  fast asset transfer."
              src="/img/alt-bridges/Owlto Finance-icon.png"
              alt="Owlto Finance"
              url="https://owlto.finance/"
            />
            <BridgeCard
              title="Poly Network"
              desc="A groundbreaking interoperability protocol for heterogeneous
                  blockchains."
              src="/img/alt-bridges/Poly Network-icon.png"
              alt="Poly Network"
              url="https://www.poly.network/"
            />
            <BridgeCard
              title="Router Protocol"
              desc="Router Protocol is a cross-chain messaging protocol to send
                  assets and messages between different chains."
              src="/img/alt-bridges/Router Protocol-icon.png"
              alt="Router Protocol"
              url="https://app.routerprotocol.com/"
            />
            <BridgeCard
              title="Rubic"
              desc="Rubic is a Cross-Chain Tech Aggregator for users + tools for
                  dApps."
              src="/img/alt-bridges/Rubic-icon.png"
              alt="Rubic"
              url="https://rubic.exchange/"
            />
            <BridgeCard
              title="Symbiosis"
              desc="Symbiosis is a cross-chain liquidity protocol. Our know-how: a
                  single click any-to-any token swaps regardless of the network."
              src="/img/alt-bridges/Symbiosis-icon.png"
              alt="Symbiosis"
              url="https://symbiosis.finance/"
            />
            <BridgeCard
              title="Umbria Network"
              desc="Cheap and fast Optimism bridge powered by a multi-chain
                  liquidity protocol. LPs earn fees on their crypto assets with
                  no impermanent loss."
              src="/img/alt-bridges/Umbria Network-icon.png"
              alt="Umbria Network"
              url="https://umbria.network/"
            />
            <BridgeCard
              title="Via Protocol"
              desc="Cross‑chain bridge and DEX aggregator on EVM and non-EVM
                  blockchains that finds the fastest and cheapest swap paths."
              src="/img/alt-bridges/Via Protocol-icon.png"
              alt="Via Protocol"
              url="https://via.exchange/"
            />
            <BridgeCard
              title="Wormhole"
              desc="Wormhole enables builders to expand to 20+ blockchains — with
                  just one integration."
              src="/img/alt-bridges/Wormhole-icon.png"
              alt="Wormhole"
              url="https://wormhole.com/"
            />
            <BridgeCard
              title="zkLink"
              desc="A multi-chain ZK-Rollup trading layer empowering DeFi, RWA,
                  and NFT super dApps."
              src="/img/alt-bridges/zkLink-icon.png"
              alt="zkLink"
              url="https://zk.link/"
            />
            <BridgeCard
              title="XY Finance"
              desc="XY Finance is a cross-chain interoperability protocol
                  aggregating DEXs &amp; bridges."
              src="/img/alt-bridges/XY Finance-icon.png"
              alt="XY Finance"
              url="https://xy.finance/"
            />
            <BridgeCard
              title="gas.zip"
              desc="gas.zip is the fastest one-stop gas refuel bridge for over
                  140+ chains."
              src="/img/alt-bridges/gas-icon.png"
              alt="gas.zip"
              url="https://www.gas.zip/"
            />
          </div>
        </div>
        <PageFooter />
      </div>
    </div>
  );
};

export default AlternativeBridges;
