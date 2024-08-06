import { useMemo } from "react";
import { bsc, bscTestnet, syscoin, syscoinTestnet } from "viem/chains";

import { useConfigState } from "@/state/config";
import { MultiChainToken } from "@/types/token";
import { getNativeTokenForDeployment } from "@/utils/get-native-token";

import { useDeployments } from "../deployments/use-deployments";
import { useConfigTokens } from "./use-config-tokens";

function useNativeTokens(): (MultiChainToken | null)[] {
  const deployments = useDeployments();

  return useMemo(
    () => deployments.map((d) => getNativeTokenForDeployment(d)),
    [deployments]
  );
}

const BNB_TESTNET_CHAINS: number[] = [bscTestnet.id];
const BNB_MAINNET_CHAINS: number[] = [bsc.id];
const BNB_CHAINS: number[] = [...BNB_TESTNET_CHAINS, ...BNB_MAINNET_CHAINS];
const SYS_CHAINS: number[] = [syscoinTestnet.id, syscoin.id];

export function useAllTokens() {
  const appTokens = useConfigTokens();
  const tokens = useConfigState.useTokens();

  return useMemo(() => [...appTokens, ...tokens], [tokens, appTokens]);

  // const deployment = useDeployment();
  // // const tokens = useConfigState.useTokens();
  // // const customTokens = useSettingsState.useCustomTokens();
  // // const deploymentTokens = useDeploymentTokens();
  // // const nativeTokens = useNativeTokens();
  // const configTokens = useConfigTokens();

  // const deployments = useDeployments();

  // return useMemo(() => {
  //   return [
  //     // ...tokens
  //     //   .map((t) => {
  //     //     if (isNativeToken(t)) {
  //     //       const copy = { ...t };
  //     //       deployments.forEach((d, deploymentIndex) => {
  //     //         let l1Ether = copy[1]!;
  //     //         let l2Ether = copy[10]!;

  //     //         if (BNB_CHAINS.includes(d.l1.id)) {
  //     //           l1Ether.logoURI = "/img/bsc/network.png";
  //     //           l2Ether.logoURI = "/img/bsc/network.png";

  //     //           // TODO: temp fix. Move name/symbol to backend
  //     //           if (BNB_MAINNET_CHAINS.includes(d.l1.id)) {
  //     //             l1Ether.name = bsc.nativeCurrency.name;
  //     //             l1Ether.symbol = bsc.nativeCurrency.symbol;
  //     //             l1Ether.coinGeckoId = "binancecoin";
  //     //             l2Ether.name = bsc.nativeCurrency.name;
  //     //             l2Ether.symbol = bsc.nativeCurrency.symbol;
  //     //             l2Ether.coinGeckoId = "binancecoin";
  //     //           }
  //     //           if (BNB_TESTNET_CHAINS.includes(d.l1.id)) {
  //     //             l1Ether.name = bscTestnet.nativeCurrency.name;
  //     //             l1Ether.symbol = bscTestnet.nativeCurrency.symbol;
  //     //             l1Ether.coinGeckoId = "binancecoin";
  //     //             l2Ether.name = bscTestnet.nativeCurrency.name;
  //     //             l2Ether.symbol = bscTestnet.nativeCurrency.symbol;
  //     //             l2Ether.coinGeckoId = "binancecoin";
  //     //           }
  //     //         }

  //     //         if (SYS_CHAINS.includes(d.l1.id)) {
  //     //           l1Ether.logoURI = "https://bridge.rollux.com/syscoin-logo.svg";
  //     //           l2Ether.logoURI = "https://bridge.rollux.com/syscoin-logo.svg";
  //     //           l1Ether.coinGeckoId = "syscoin";
  //     //           l2Ether.coinGeckoId = "syscoin";
  //     //         }

  //     //         // ensure every deployment has a native token registered
  //     //         if (!copy[d.l1.id]) {
  //     //           copy[d.l1.id] = {
  //     //             ...l1Ether,
  //     //             name: d.l1.nativeCurrency.name,
  //     //             symbol: d.l1.nativeCurrency.symbol,
  //     //             chainId: d.l1.id,
  //     //           };
  //     //         }

  //     //         if (nativeTokens[deploymentIndex]) {
  //     //           return;
  //     //         }

  //     //         if (!copy[d.l2.id]) {
  //     //           copy[d.l2.id] = {
  //     //             ...l2Ether,
  //     //             name: d.l2.nativeCurrency.name,
  //     //             symbol: d.l2.nativeCurrency.symbol,
  //     //             chainId: d.l2.id,
  //     //           };
  //     //         }
  //     //       });
  //     //       return copy;
  //     //     }
  //     //     return t;
  //     //   })
  //     //   .filter(isPresent),
  //     // ...customTokens,
  //     // ...nativeTokens.filter(isPresent),
  //     // ...deploymentTokens,
  //     ...configTokens,
  //   ];
  // }, [
  //   deployment,
  //   //  tokens, customTokens, nativeTokens, deploymentTokens
  // ]);
}
