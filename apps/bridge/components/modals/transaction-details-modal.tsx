import Link from "next/link";
import { useTranslation } from "react-i18next";

import { useFinalisingTx } from "@/hooks/activity/use-finalising-tx";
import { useTxAmount } from "@/hooks/activity/use-tx-amount";
import { useTxDuration } from "@/hooks/activity/use-tx-duration";
import { useTxFromTo } from "@/hooks/activity/use-tx-from-to";
import { useTxProvider } from "@/hooks/activity/use-tx-provider";
import { useTxProviderExplorerLink } from "@/hooks/activity/use-tx-provider-explorer-link";
import { useTxRecipient } from "@/hooks/activity/use-tx-recipient";
import { useTxSender } from "@/hooks/activity/use-tx-sender";
import {
  useTxMultichainToken,
  useTxToken,
} from "@/hooks/activity/use-tx-token";
import { useHelpCenterLinkByProvider } from "@/hooks/help/use-help-center-link";
import { useModal } from "@/hooks/use-modal";
import { usePeriodText } from "@/hooks/use-period-text";
import { useTransactions } from "@/hooks/use-transactions";
import { usePendingTransactions } from "@/state/pending-txs";
import { getPeriod } from "@/utils/get-period";
import { getInitiatingHash } from "@/utils/initiating-tx-hash";
import { useProgressRows } from "@/utils/progress-rows";
import { isWaitStep } from "@/utils/progress-rows/common";

import { BridgeInfo } from "../bridge-info";
import { LineItem } from "../transaction-line-item";
import { Dialog, DialogContent } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const useTransactionByInitiatingHash = (hash: string | null) => {
  const { transactions } = useTransactions();
  const pendingTransactions = usePendingTransactions.useTransactions();
  return (
    transactions.find((x) => getInitiatingHash(x) === hash) ||
    pendingTransactions.find((x) => getInitiatingHash(x) === hash)
  );
};

const Content = () => {
  const { t } = useTranslation();
  const modal = useModal("TransactionDetails");
  const tx = useTransactionByInitiatingHash(modal.data);

  const multichainToken = useTxMultichainToken(tx);
  const token = useTxToken(tx);

  const amount = useTxAmount(tx, token);
  const provider = useTxProvider(tx);
  const chains = useTxFromTo(tx);

  const recipient = useTxRecipient(tx);
  const sender = useTxSender(tx);
  const finalisingTx = useFinalisingTx(tx);

  const duration = useTxDuration(tx);

  const transformPeriodIntoText = usePeriodText();

  const transferTime = transformPeriodIntoText(
    "transferTime",
    {},
    getPeriod((duration ?? 1) / 1000)
  );

  const rows = useProgressRows(tx ?? null);

  const helpCenterLink = useHelpCenterLinkByProvider(provider);
  const providerExplorerLink = useTxProviderExplorerLink(tx);

  return (
    <Tabs defaultValue="steps" className="flex flex-col">
      <div className="mx-auto">
        <TabsList className="bg-blue-400">
          <TabsTrigger value="steps">{t("transaction.steps")}</TabsTrigger>
          <TabsTrigger value="info">{t("transaction.bridgeInfo")}</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="steps">
        <div className="flex flex-col p-6 pt-0 gap-1">
          {rows?.map((item) => (
            <LineItem
              key={isWaitStep(item) ? item.duration.toString() : item.label}
              step={item}
              tx={tx!}
            />
          ))}

          {helpCenterLink && (
            <div className="flex items-center justify-center pt-3">
              <Link
                href={helpCenterLink}
                target="_blank"
                className="text-xs font-heading text-center hover:underline"
              >
                {t("general.needHelp")}
              </Link>
            </div>
          )}

          {providerExplorerLink && (
            <div className="flex items-center justify-center pt-3">
              <Link
                href={providerExplorerLink}
                target="_blank"
                className="text-xs font-heading text-center hover:underline"
              >
                View on the {provider} explorer
              </Link>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="info">
        <BridgeInfo
          recipient={recipient}
          sender={sender}
          sentAmount={amount?.formatted ?? null}
          // todo: make this handle Across fees
          receivedAmount={amount?.formatted ?? null}
          from={chains?.from ?? null}
          to={chains?.to ?? null}
          provider={provider}
          token={multichainToken ?? null}
          transferTime={transferTime}
        />
      </TabsContent>
    </Tabs>
  );
};

export const TransactionDetailsModal = () => {
  const modal = useModal("TransactionDetails");

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <Content />
      </DialogContent>
    </Dialog>
  );
};
