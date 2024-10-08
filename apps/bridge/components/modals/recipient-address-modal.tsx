import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";
import { useDebounce } from "use-debounce";
import { Address, isAddress, isAddressEqual } from "viem";
import { useAccount } from "wagmi";

import { Input } from "@/components/ui/input";
import { getTxRecipient } from "@/hooks/activity/use-tx-recipient";
import { useToChain } from "@/hooks/use-chain";
import { useIsContractAccount } from "@/hooks/use-is-contract-account";
import { useModal } from "@/hooks/use-modal";
import { useTransactions } from "@/hooks/use-transactions";
import { resolveAddress, resolveName } from "@/services/ens";
import { useConfigState } from "@/state/config";

import {
  IconAlert,
  IconCheckCircle,
  IconCloseCircle,
  IconSpinner,
} from "../icons";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ProfileProps {
  name: string | null;
  address: string | null;
  avatar: string | null;
}

const Profile = ({
  data,
  showName,
}: {
  data: ProfileProps | null;
  showName: boolean;
}) => {
  if (!data?.address) {
    return null;
  }

  if (showName && !data.name) {
    return null;
  }

  return (
    <div
      className={clsx(
        "flex items-center space-x-1 px-2 py-1 border rounded-full",
        data.avatar && "pr-1"
      )}
    >
      <div className="text-xs">
        {showName
          ? data.name
          : data.address.slice(0, 5) +
            "..." +
            data.address.slice(data.address.length - 5)}
      </div>
      {data.avatar && (
        <img src={data.avatar} alt="avatar" className="rounded-full h-4 w-4" />
      )}
    </div>
  );
};

export const RecipientAddressModal = () => {
  const toChain = useToChain();
  const recipientName = useConfigState.useRecipientName();
  const recipientAddress = useConfigState.useRecipientAddress();
  const isContractAccount = useIsContractAccount();
  const account = useAccount();
  const modal = useModal("RecipientAddress");

  const [input, setInput] = useState("");

  useEffect(() => {
    setInput(recipientName || recipientAddress || "");
  }, [recipientName, recipientAddress, modal.isOpen]);

  const [debouncedInput] = useDebounce(input, 750);

  const setRecipientName = useConfigState.useSetRecipientName();
  const setRecipientAddress = useConfigState.useSetRecipientAddress();
  const transactions = useTransactions();
  const { t } = useTranslation();

  const profile = useQuery({
    queryKey: [`profile-${debouncedInput}`],
    queryFn: async () => {
      if (debouncedInput.endsWith(".eth")) {
        const profile = await resolveName(debouncedInput);
        if (!profile) {
          return null;
        }

        return {
          name: debouncedInput,
          address: profile.address,
          avatar: profile.avatar,
        };
      }

      if (!isAddress(debouncedInput)) {
        return null;
      }

      const profile = await resolveAddress(debouncedInput as Address);
      if (profile) {
        return profile;
      }

      return {
        address: debouncedInput,
        name: null,
        avatar: null,
      };
    },
    enabled: isAddress(debouncedInput) || debouncedInput.endsWith(".eth"),
  });

  const onSave = async () => {
    if (profile.isLoading || !profile.data) {
      return;
    }

    setRecipientName(profile.data.name || "");
    setRecipientAddress(profile.data.address);

    modal.close();
  };

  return (
    <>
      <Dialog open={modal.isOpen} onOpenChange={modal.close}>
        <DialogContent
          onOpenAutoFocus={(event: Event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{t("recipient.bridgeDestination")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm mb-2">
                    {t("recipient.toAddress")}
                  </h3>
                  <Profile
                    data={profile.data ?? null}
                    showName={!debouncedInput.endsWith(".eth")}
                  />
                </div>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="mt-2">
                  {match({
                    transactions,
                    debouncedInput,
                    profile: profile.data,
                    isLoading:
                      profile.isLoading && profile.fetchStatus !== "idle",
                    isValidProfile:
                      !!profile.data?.address &&
                      isAddress(profile.data.address),
                    isContractAccount: isContractAccount.data,
                    account: account.address,
                  })
                    .with({ isLoading: true }, () => (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                        <IconSpinner className="w-3.5 h-3.5 text-foreground" />
                        <span className="text-xs leading-none text-muted-foreground">
                          {t("recipient.checkingAddress")}
                        </span>
                      </div>
                    ))
                    .with({ debouncedInput: "" }, () => null)
                    .with({ isValidProfile: false }, () => (
                      <div className="inline-flex items-center gap-1 pr-2 pl-1 py-1 rounded-full bg-muted">
                        <IconCloseCircle className="w-3.5 h-3.5 fill-red-400" />
                        <span className="text-xs leading-none text-red-400">
                          {t("recipient.invalidAddress")}
                        </span>
                      </div>
                    ))
                    .with({ transactions: { isLoading: true } }, () => null)
                    .when(
                      (x) =>
                        x.isContractAccount === false &&
                        !!x.profile?.address &&
                        !!x.account &&
                        isAddressEqual(x.account, x.profile.address),
                      () => (
                        <div className="inline-flex items-center gap-1 pr-2 pl-1 py-1 rounded-full bg-muted">
                          <IconCheckCircle className="w-3.5 h-3.5 fill-primary" />
                          <span className="text-xs leading-none text-primary">
                            {t("recipient.yourChainAddress", {
                              chain: toChain?.name,
                            })}
                          </span>
                        </div>
                      )
                    )
                    .with(
                      { transactions: { isLoading: false, isError: false } },
                      ({ transactions, profile }) => {
                        const count = transactions.transactions.reduce(
                          (accum, tx) => {
                            const recipient = getTxRecipient(tx);
                            if (!recipient) {
                              return accum;
                            }

                            if (!isAddress(recipient)) {
                              return accum;
                            }

                            if (
                              profile?.address &&
                              isAddressEqual(
                                profile.address as Address,
                                recipient
                              )
                            ) {
                              return accum + 1;
                            }
                            return accum;
                          },
                          0
                        );

                        if (count === 1) {
                          return (
                            <div className="inline-flex gap-1 pr-2 pl-1 py-1 rounded-full bg-muted">
                              <IconCheckCircle className="w-3.5 h-3.5 fill-primary" />
                              <span className="text-xs leading-none text-green-500">
                                {t("recipient.usedBefore")}
                              </span>
                            </div>
                          );
                        }

                        if (count > 1) {
                          return (
                            <div className="inline-flex gap-1 pr-2 pl-1 py-1 rounded-full bg-muted">
                              <IconCheckCircle className="w-3.5 h-3.5 fill-primary" />
                              <span className="text-xs leading-none text-primary">
                                {t("recipient.usedBeforeMultiple", { count })}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div className="inline-flex gap-1 pr-2 pl-1 py-1 rounded-full bg-muted">
                            <IconAlert className="w-3.5 h-3.5 fill-orange-500" />
                            <span className="text-xs leading-none text-orange-500">
                              {t("recipient.newAddress")}
                            </span>
                          </div>
                        );
                      }
                    )
                    .otherwise(() => null)}
                </div>
              </div>

              <Button disabled={profile.isLoading} onClick={onSave}>
                {t("save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
