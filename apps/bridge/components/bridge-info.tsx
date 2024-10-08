import { useTranslation } from "react-i18next";
import { Address } from "viem";
import { useEnsName } from "wagmi";

import { ChainDto, RouteProvider } from "@/codegen/model";
import {
  IconArrowDownRightCircle,
  IconArrowUpRightCircle,
  IconTime,
  IconVia,
} from "@/components/icons";
import { NetworkIcon } from "@/components/network-icon";
import {
  RouteProviderIcon,
  RouteProviderName,
} from "@/components/route-provider-icon";
import { TokenIcon } from "@/components/token-icon";
import { useModal } from "@/hooks/use-modal";
import { MultiChainToken } from "@/types/token";

export const Ens = ({ address }: { address: string | null }) => {
  const a = useEnsName({ address: address as Address });

  return (
    a.data ?? address?.slice(0, 6) + "..." + address?.slice(address.length - 6)
  );
};

export const BridgeInfo = ({
  from,
  to,

  provider,
  transferTime,
  recipient,
  sender,
  token,
  sentAmount,
  receivedAmount,
}: {
  from: ChainDto | null;
  to: ChainDto | null;
  provider: RouteProvider | null;

  sender: string | null;
  recipient: string | null;

  transferTime: string;

  token: MultiChainToken | null;

  sentAmount: string | null;
  receivedAmount: string | null;
}) => {
  const { t } = useTranslation();
  const feeBreakdownModal = useModal("FeeBreakdown");
  const gasInfoModal = useModal("GasInfo");

  // const fees = useFeesForRoute(route);

  return (
    <div>
      <div className="flex flex-col gap-2 px-6">
        <div className="flex flex-col divide-y divide-border rounded-xl border py-0.5 text-xs">
          {/* Send */}
          <div className="flex items-start gap-4 py-3 px-3.5 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <NetworkIcon chain={from} className="h-4 w-4 rounded-xs" />
                <span>{t("transaction.fromChain", { from: from?.name })}</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center justify-between ">
              {sentAmount} {token?.[from?.id ?? 0]?.symbol}
              <TokenIcon token={token?.[from?.id ?? 0]} className="h-4 w-4" />
            </div>
          </div>

          {/* Receive */}
          <div className="flex items-start gap-4 py-3 px-3.5 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <NetworkIcon chain={to} className="h-4 w-4 rounded-xs" />
                <span>{t("transaction.toChain", { to: to?.name })}</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center justify-between ">
              {receivedAmount} {token?.[to?.id ?? 0]?.symbol}
              <TokenIcon token={token?.[to?.id ?? 0]} className="h-4 w-4" />
            </div>
          </div>

          {/* Via */}
          <div className="flex items-start gap-4 py-3 px-3.5 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconVia className="w-4 h-auto fill-foreground" />
                <span>{t("transaction.via")}</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center justify-between ">
              <RouteProviderName provider={provider} />
              <RouteProviderIcon
                provider={provider}
                fromChainId={from?.id ?? 0}
                toChainId={to?.id ?? 0}
                className="h-4 w-4 rounded-xs"
              />
            </div>
          </div>

          {/* Sender */}
          <div className="flex items-start gap-4 py-3 px-3.5 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconArrowDownRightCircle className="w-4 h-auto fill-foreground" />
                <span>{t("transaction.fromAddress")}</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center justify-between ">
              <Ens address={sender} />
            </div>
          </div>

          {/* Recipient */}
          <div className="flex items-start gap-4 py-3 px-3.5 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconArrowUpRightCircle className="w-4 h-auto fill-foreground" />
                <span>{t("transaction.toAddress")}</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center justify-between ">
              <Ens address={recipient} />
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-start gap-4 py-3 px-3.5 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconTime className="w-4 h-auto fill-foreground" />
                <span>{t("transaction.transferTime")}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>{transferTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
