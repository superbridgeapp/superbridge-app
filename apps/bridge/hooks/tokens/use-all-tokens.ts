import { useMemo } from "react";
import { isPresent } from "ts-is-present";
import { Address } from "viem";
import { bsc, bscTestnet, syscoin, syscoinTestnet } from "viem/chains";

import { DeploymentFamily } from "@/codegen/model";
import { isRenzo } from "@/config/app";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { MultiChainToken } from "@/types/token";
import { getNativeTokenForDeployment } from "@/utils/get-native-token";
import { isNativeToken } from "@/utils/is-eth";
import { renzo } from "@/utils/token-list/json/renzo";

import { useDeployment } from "../use-deployment";
import { useDeployments } from "../use-deployments";

function useDeploymentTokens(): MultiChainToken[] {
  const deployments = useDeployments();

  return useMemo(
    () =>
      deployments
        .map((d) =>
          d.tokens.map((t) => {
            const opTokenId = `custom-${t.l1.symbol}`;

            if (d.family === DeploymentFamily.optimism) {
              const tok: MultiChainToken = {
                [t.l1.chainId]: {
                  chainId: t.l1.chainId,
                  address: t.l1.address as Address,
                  decimals: t.l1.decimals,
                  name: t.l1.name,
                  symbol: t.l1.symbol,
                  opTokenId,
                  logoURI: t.l1.logoURI,
                  standardBridgeAddresses: {
                    [t.l2.chainId]: t.l1.bridge as Address,
                  },
                },
                [t.l2.chainId]: {
                  chainId: t.l2.chainId,
                  address: t.l2.address as Address,
                  decimals: t.l2.decimals,
                  name: t.l2.name,
                  symbol: t.l2.symbol,
                  logoURI: t.l2.logoURI,
                  opTokenId,
                  standardBridgeAddresses: {
                    [t.l1.chainId]: t.l2.bridge as Address,
                  },
                },
              };

              return tok;
            } else {
              const tok: MultiChainToken = {
                [t.l1.chainId]: {
                  chainId: t.l1.chainId,
                  address: t.l1.address as Address,
                  decimals: t.l1.decimals,
                  name: t.l1.name,
                  symbol: t.l1.symbol,
                  logoURI: t.l1.logoURI,
                  arbitrumBridgeInfo: {
                    [t.l2.chainId]: t.l1.bridge as Address,
                  },
                },
                [t.l2.chainId]: {
                  chainId: t.l2.chainId,
                  address: t.l2.address as Address,
                  decimals: t.l2.decimals,
                  name: t.l2.name,
                  symbol: t.l2.symbol,
                  logoURI: t.l2.logoURI,
                  arbitrumBridgeInfo: {
                    [t.l1.chainId]: t.l2.bridge as Address,
                  },
                },
              };

              return tok;
            }
          })
        )
        .flat(),
    [deployments]
  );
}

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
  const deployment = useDeployment();
  const tokens = useConfigState.useTokens();
  const customTokens = useSettingsState.useCustomTokens();
  const deploymentTokens = useDeploymentTokens();
  const nativeTokens = useNativeTokens();

  const deployments = useDeployments();

  return useMemo(() => {
    if (isRenzo) {
      return renzo;
    }

    return [
      ...tokens
        .map((t) => {
          if (isNativeToken(t)) {
            const copy = { ...t };
            deployments.forEach((d, deploymentIndex) => {
              let l1Ether = copy[1]!;
              let l2Ether = copy[10]!;

              if (BNB_CHAINS.includes(d.l1.id)) {
                l1Ether.logoURI = "/img/bsc/network.png";
                l2Ether.logoURI = "/img/bsc/network.png";

                // TODO: temp fix. Move name/symbol to backend
                if (BNB_MAINNET_CHAINS.includes(d.l1.id)) {
                  l1Ether.name = bsc.nativeCurrency.name;
                  l1Ether.symbol = bsc.nativeCurrency.symbol;
                  l1Ether.coinGeckoId = "binancecoin";
                  l2Ether.name = bsc.nativeCurrency.name;
                  l2Ether.symbol = bsc.nativeCurrency.symbol;
                  l2Ether.coinGeckoId = "binancecoin";
                }
                if (BNB_TESTNET_CHAINS.includes(d.l1.id)) {
                  l1Ether.name = bscTestnet.nativeCurrency.name;
                  l1Ether.symbol = bscTestnet.nativeCurrency.symbol;
                  l1Ether.coinGeckoId = "binancecoin";
                  l2Ether.name = bscTestnet.nativeCurrency.name;
                  l2Ether.symbol = bscTestnet.nativeCurrency.symbol;
                  l2Ether.coinGeckoId = "binancecoin";
                }
              }

              if (SYS_CHAINS.includes(d.l1.id)) {
                l1Ether.logoURI = "https://bridge.rollux.com/syscoin-logo.svg";
                l2Ether.logoURI = "https://bridge.rollux.com/syscoin-logo.svg";
                l1Ether.coinGeckoId = "syscoin";
                l2Ether.coinGeckoId = "syscoin";
              }

              // ensure every deployment has a native token registered
              if (!copy[d.l1.id]) {
                copy[d.l1.id] = {
                  ...l1Ether,
                  name: d.l1.nativeCurrency.name,
                  symbol: d.l1.nativeCurrency.symbol,
                  chainId: d.l1.id,
                };
              }

              if (nativeTokens[deploymentIndex]) {
                return;
              }

              if (!copy[d.l2.id]) {
                copy[d.l2.id] = {
                  ...l2Ether,
                  name: d.l2.nativeCurrency.name,
                  symbol: d.l2.nativeCurrency.symbol,
                  chainId: d.l2.id,
                };
              }
            });
            return copy;
          }
          return t;
        })
        .filter(isPresent),
      ...customTokens,
      ...nativeTokens.filter(isPresent),
      ...deploymentTokens,
    ];
  }, [deployment, tokens, customTokens, nativeTokens, deploymentTokens]);
}