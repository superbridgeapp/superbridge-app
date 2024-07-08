import { sendGAEvent } from "@next/third-parties/google";

import { isSuperbridge } from "@/config/superbridge";

type FromChainSelect = {
  event: "from-chain-select";
  name: string;
};
type ToChainSelect = {
  event: "to-chain-select";
  name: string;
};
type TokenSelect = {
  event: "token-select";
  symbol: string;
  network: string;
};
type TokenBannerClick = {
  event: "token-banner-click";
  symbol: string;
};
type Bridge = {
  event: "bridge";
  from: string;
  to: string;
  amount: number;
  token: string;
  type: string;
  transactionHash: string;
};
type OpenActivity = {
  event: "open-activity";
};
type CloseActivity = {
  event: "close-activity";
};
type ClickDeposit = {
  event: "click-deposit";
  name: string;
};
type ClickWithdraw = {
  event: "click-withdraw";
  name: string;
};
type SelectLanguage = {
  event: "select-language";
  name: string;
};
type SelectExplorer = {
  event: "select-explorer";
  name: string;
};
type SelectCurrency = {
  event: "select-currency";
  name: string;
};
type ImportCustomToken = {
  event: "import-custom-token";
  l1: string;
  l2: string;
  name: string;
  l1Address: string;
  l2Address: string;
};
type ProveWithdrawal = {
  event: "prove-withdrawal";
  network: string;
  withdrawalTransactionHash: string;
};
type FinalizeWithdrawal = {
  event: "finalize-withdrawal";
  network: string;
  withdrawalTransactionHash: string;
};
type CctpMint = {
  event: "cctp-mint";
  network: string;
  burnTransactionHash: string;
};

export const trackEvent = (
  args:
    | FromChainSelect
    | ToChainSelect
    | TokenSelect
    | TokenBannerClick
    | Bridge
    | OpenActivity
    | CloseActivity
    | ClickDeposit
    | ClickWithdraw
    | SelectLanguage
    | SelectExplorer
    | SelectCurrency
    | ImportCustomToken
    | ProveWithdrawal
    | FinalizeWithdrawal
    | CctpMint
) => {
  if (isSuperbridge) {
    sendGAEvent("event", args.event, args);
  }
};
