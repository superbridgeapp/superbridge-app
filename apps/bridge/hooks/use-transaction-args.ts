import { useAccount, useFeeData } from "wagmi";

import { useBridgeControllerGetCctpDomains } from "@/codegen";
import { configurations } from "@/config/contract-addresses";
import { useConfigState } from "@/state/config";
import { isArbitrum } from "@/utils/is-mainnet";
import { depositArgs } from "@/utils/transaction-args/deposit-args";
import { optimismBridgeNftArgs } from "@/utils/transaction-args/nft-args/optimism-bridge-nft-args";
import { withdrawArgs } from "@/utils/transaction-args/withdraw-args";

import { useL2TokenIsLegacy } from "./use-l2-token-is-legacy";
import { useWeiAmount } from "./use-wei-amount";

export const useTransactionArgs = () => {
  const account = useAccount();
  const recipient = useConfigState.useRecipientAddress();
  const deployment = useConfigState.useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  const stateToken = useConfigState.useToken();
  const nft = useConfigState.useNft();
  const forceViaL1 = useConfigState.useForceViaL1();
  const easyMode = useConfigState.useEasyMode();
  const weiAmount = useWeiAmount();
  const l2TokenIsLegacy = useL2TokenIsLegacy(
    stateToken?.[deployment?.l2.id ?? 0],
    deployment
  );
  const l1FeeData = useFeeData({
    chainId: deployment?.l1.id,
    enabled: !!deployment && isArbitrum(deployment),
  });
  const l2FeeData = useFeeData({
    chainId: deployment?.l2.id,
    enabled: !!deployment && isArbitrum(deployment),
  });
  const cctpDomains = useBridgeControllerGetCctpDomains();

  if (!deployment || !account.address || !recipient || !weiAmount) {
    return;
  }

  if (nft) {
    return optimismBridgeNftArgs({
      deployment,
      nft,
      recipient,
    });
  }

  if (!stateToken) {
    return;
  }

  const l1Cctp = cctpDomains.data?.data.find(
    (x) => x.chainId === deployment.l1.id
  );
  const l2Cctp = cctpDomains.data?.data.find(
    (x) => x.chainId === deployment.l2.id
  );

  if (withdrawing) {
    return withdrawArgs({
      deployment,
      stateToken,
      proxyBridge: configurations[deployment.name]?.contracts.l2Bridge,
      cctp: { from: l2Cctp, to: l1Cctp },
      l2TokenIsLegacy,
      recipient,
      weiAmount,
      options: { forceViaL1, easyMode },
      l1FeeData: l1FeeData.data,
      l2FeeData: l2FeeData.data,
    });
  } else {
    return depositArgs({
      deployment,
      stateToken,
      proxyBridge: configurations[deployment.name]?.contracts.l1Bridge,
      cctp: { from: l1Cctp, to: l2Cctp },
      recipient,
      weiAmount,
      l1FeeData: l1FeeData.data,
      l2FeeData: l2FeeData.data,
    });
  }
};
