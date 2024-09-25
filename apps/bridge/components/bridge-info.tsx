import { Address } from "viem";
import { useEnsName } from "wagmi";

import { ChainDto, RouteProvider } from "@/codegen/model";
import { IconSimpleTime, IconVia } from "@/components/icons";
import { NetworkIcon } from "@/components/network-icon";
import {
  RouteProviderIcon,
  RouteProviderName,
} from "@/components/route-provider-icon";
import { TokenIcon } from "@/components/token-icon";
import { useModal } from "@/hooks/use-modal";
import { MultiChainToken } from "@/types/token";

export const Ens = ({ address }: { address: string }) => {
  const a = useEnsName({ address: address as Address });

  return (
    a.data ?? address.slice(0, 6) + "..." + address.slice(address.length - 6)
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
  amount,
}: {
  from: ChainDto | null;
  to: ChainDto | null;
  provider: RouteProvider | null;

  sender: string;
  recipient: string;

  transferTime: string;

  token: MultiChainToken | null;

  amount: string;
}) => {
  const feeBreakdownModal = useModal("FeeBreakdown");
  const gasInfoModal = useModal("GasInfo");

  // const fees = useFeesForRoute(route);

  return (
    <div>
      <div className="flex flex-col gap-2 px-6">
        <div className="flex flex-col divide-y divide-border rounded-lg border py-0.5 text-xs">
          {/* Send */}
          <div className="flex items-start gap-4 p-3 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <NetworkIcon chain={from} className="h-4 w-4" />
                <span>From {from?.name}</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center justify-between ">
              {amount} {token?.[from?.id ?? 0]?.symbol}
              <TokenIcon token={token?.[from?.id ?? 0]} className="h-4 w-4" />
            </div>
          </div>

          {/* Receive */}
          <div className="flex items-start gap-4 p-3 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <NetworkIcon chain={to} className="h-4 w-4" />
                <span>To {to?.name}</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center justify-between ">
              {amount} {token?.[to?.id ?? 0]?.symbol}
              <TokenIcon token={token?.[to?.id ?? 0]} className="h-4 w-4" />
            </div>
          </div>

          {/* Via */}
          <div className="flex items-start gap-4 p-3 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconVia className="w-4 h-auto fill-muted-foreground" />
                <span>Via</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center justify-between ">
              <RouteProviderName provider={provider} />
              <RouteProviderIcon
                provider={provider}
                fromChainId={from?.id ?? 0}
                toChainId={to?.id ?? 0}
                className="h-4 w-4 rounded-2xs"
              />
            </div>
          </div>

          {/* Sender */}
          <div className="flex items-start gap-4 p-3 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconVia className="w-4 h-auto fill-muted-foreground" />
                <span>From address</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center justify-between ">
              <Ens address={sender} />
            </div>
          </div>

          {/* Recipient */}
          <div className="flex items-start gap-4 p-3 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconVia className="w-4 h-auto fill-muted-foreground" />
                <span>To address</span>
              </div>
            </div>
            <div className="flex gap-1.5 items-center justify-between ">
              <Ens address={recipient} />
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-start gap-4 p-3 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconSimpleTime className="w-4 h-auto fill-muted-foreground" />
                <span>Transfer time</span>
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
