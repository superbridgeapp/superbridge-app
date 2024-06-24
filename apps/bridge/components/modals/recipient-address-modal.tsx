import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";
import { useDebounce } from "use-debounce";
import { Address, isAddress, isAddressEqual } from "viem";
import { useAccount } from "wagmi";

import { Input } from "@/components/ui/input";
import { ModalNames } from "@/constants/modal-names";
import { useToChain } from "@/hooks/use-chain";
import { useIsContractAccount } from "@/hooks/use-is-contract-account";
import { useTransactions } from "@/hooks/use-transactions";
import { resolveAddress, resolveName } from "@/services/ens";
import { useConfigState } from "@/state/config";
import { isDeposit, isWithdrawal } from "@/utils/guards";

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
  const withdrawing = useConfigState.useWithdrawing();
  const toChain = useToChain();
  const recipientName = useConfigState.useRecipientName();
  const recipientAddress = useConfigState.useRecipientAddress();
  const isContractAccount = useIsContractAccount();
  const account = useAccount();
  const modals = useConfigState.useModals();

  const [input, setInput] = useState("");

  useEffect(() => {
    setInput(recipientName || recipientAddress || "");
  }, [recipientName, recipientAddress, modals.RecipientAddress]);

  const [debouncedInput] = useDebounce(input, 750);

  const setRecipientName = useConfigState.useSetRecipientName();
  const setRecipientAddress = useConfigState.useSetRecipientAddress();
  const removeModal = useConfigState.useRemoveModal();
  const transactions = useTransactions();
  const { t } = useTranslation();

  const profile = useQuery(
    [`profile-${debouncedInput}`],
    async () => {
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
    {
      enabled: isAddress(debouncedInput) || debouncedInput.endsWith(".eth"),
    }
  );

  const onSave = async () => {
    if (profile.isLoading || !profile.data) {
      return;
    }

    setRecipientName(profile.data.name || "");
    setRecipientAddress(profile.data.address);

    removeModal(ModalNames.RecipientAddress);
  };

  return (
    <>
      <Dialog
        open={modals.RecipientAddress}
        onOpenChange={() => removeModal(ModalNames.RecipientAddress)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {withdrawing
                ? t("recipient.withdrawDestination")
                : t("recipient.depositDestination")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm mb-2">To address</h3>
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
                      <div className="inline-flex gap-1 px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900">
                        <span className="text-xs leading-none text-muted-foreground">
                          Checking address…
                        </span>
                      </div>
                    ))
                    .with({ debouncedInput: "" }, () => null)
                    .with({ isValidProfile: false }, () => (
                      <div className="inline-flex gap-1 pr-2 pl-1 py-1 rounded-full bg-red-500/10">
                        <Image
                          alt="Address icon"
                          src={"/img/address-error.svg"}
                          height={14}
                          width={14}
                        />
                        <span className="text-xs leading-none text-red-500">
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
                      (x) => (
                        <div className="inline-flex gap-1 pr-2 pl-1 py-1 rounded-full bg-green-500/10">
                          <Image
                            alt="Address icon"
                            src={"/img/address-ok.svg"}
                            height={14}
                            width={14}
                          />
                          <span className="text-xs leading-none text-green-500">
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
                            // todo: make this work with ENS
                            if (
                              isDeposit(tx) &&
                              !!profile?.address &&
                              isAddressEqual(
                                tx.metadata.to as Address,
                                profile.address as Address
                              )
                            ) {
                              return isAddressEqual(
                                tx.metadata.to as Address,
                                profile.address as Address
                              ) ||
                                isAddressEqual(
                                  tx.metadata.from as Address,
                                  profile.address as Address
                                )
                                ? accum + 1
                                : accum;
                            }

                            if (isWithdrawal(tx) && !!profile?.address) {
                              return isAddressEqual(
                                tx.metadata.to as Address,
                                profile.address as Address
                              ) ||
                                isAddressEqual(
                                  tx.metadata.from as Address,
                                  profile.address as Address
                                )
                                ? accum + 1
                                : accum;
                            }

                            return accum;
                          },
                          0
                        );

                        if (count === 1) {
                          return (
                            <div className="inline-flex gap-1 pr-2 pl-1 py-1 rounded-full bg-green-100 dark:bg-green-950">
                              <Image
                                alt="Address icon"
                                src={"/img/address-ok.svg"}
                                height={14}
                                width={14}
                              />
                              <span className="text-xs leading-none text-green-500">
                                {t("recipient.usedBefore")}
                              </span>
                            </div>
                          );
                        }

                        if (count > 1) {
                          return (
                            <div className="inline-flex gap-1 pr-2 pl-1 py-1 rounded-full bg-green-100 dark:bg-green-950">
                              <Image
                                alt="Address icon"
                                src={"/img/address-ok.svg"}
                                height={14}
                                width={14}
                              />
                              <span className="text-xs leading-none text-green-500">
                                {t("recipient.usedBeforeMultiple", { count })}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div className="inline-flex gap-1 pr-2 pl-1 py-1 rounded-full bg-orange-100 dark:bg-orange-950">
                            <Image
                              alt="Address icon"
                              src={"/img/address-alert.svg"}
                              height={14}
                              width={14}
                            />
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
