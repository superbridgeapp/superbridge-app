import { useRouter } from "next/router";
import { useEffect } from "react";
import { isAddress } from "viem";
import { useAccount } from "wagmi";

import { resolveAddress, resolveName } from "@/services/ens";
import { useConfigState } from "@/state/config";

import { useIsContractAccount } from "../use-is-contract-account";

/**
 * Things handled in the useEffect
 *
 *   User connects as an EOA
 *    we save the address as resolved
 *    we save name if resolved
 *   User connects as a contract
 *    name and address are both set as ''
 *
 * Everything else handled in the address modal
 */
export const useInitialiseRecipient = () => {
  const router = useRouter();
  const account = useAccount();
  const isContractAccount = useIsContractAccount();

  const setRecipientName = useConfigState.useSetRecipientName();
  const setRecipientAddress = useConfigState.useSetRecipientAddress();

  useEffect(() => {
    const recipient = router.query.recipient as string | undefined;
    if (recipient) {
      if (isAddress(recipient)) {
        setRecipientAddress(recipient);
        resolveAddress(recipient).then((profile) => {
          if (profile?.name) setRecipientName(profile.name);
          else setRecipientName("");
        });
      } else if (recipient.endsWith(".eth")) {
        setRecipientName(recipient);
        resolveName(recipient).then((profile) => {
          if (profile?.address) setRecipientAddress(profile?.address);
          else setRecipientAddress("");
        });
      }
      return;
    }

    if (!account.address) {
      setRecipientName("");
      setRecipientAddress("");
      return;
    }

    // !isContract.data is not enough here, we need to be explicit
    if (isContractAccount.data === false && !!account.address) {
      setRecipientAddress(account.address);
      resolveAddress(account.address).then((profile) => {
        if (profile?.name) setRecipientName(profile.name);
        else setRecipientName("");
      });
    }

    // this is a little overbearing and means everytime you switch
    // between deposit and withdraw the recipient address disappears
    // when using a SC account, but probably better safe than sorry
    if (isContractAccount.data === true) {
      setRecipientAddress("");
      setRecipientName("");
    }
  }, [isContractAccount.data, account.address]);
};
