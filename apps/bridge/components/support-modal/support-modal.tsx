import Link from "next/link";
import { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { isSuperbridge } from "@/config/app";
import { Period } from "@/utils/get-period";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export const SupportModal = ({
  open,
  setOpen,

  rollupChain,
  settlementChain,
  finalizationPeriod,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;

  rollupChain: string;
  settlementChain: string;
  finalizationPeriod: Period;
}) => {
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);
  const [checkbox4, setCheckbox4] = useState(false);

  useEffect(() => {
    setCheckbox1(false);
    setCheckbox2(false);
    setCheckbox3(false);
    setCheckbox4(false);
  }, [open]);

  const body = [
    "Hi there,",
    "",
    `I'm having an issue with ${
      isSuperbridge ? "Superbridge" : `${rollupChain} bridge`
    }`,
    "",
    "- The problem I'm having:",
    "- The address of my wallet:",
    `- The wallet I'm using (eg MetaMask):`,
    "- The network I'm bridging from is:",
    "- The network I'm bridging to is:",
    "- The token I'm bridging:",
    "- The website I'm using:",
    "- The browser I'm using is:",
    "- The device I'm using is:",
    "",
    "Thanks",
  ];

  const email = "support@superbridge.app";
  const mailLink = `mailto:${email}?subject=${
    isSuperbridge ? "Superbridge" : `${rollupChain} bridge`
  } support query&body=${body.join("%0D%0A")}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex flex-col p-6 pt-8">
          <h1 className="font-heading text-xl ">
            Hey!
            <br />
            Please acknowledge that you understand the following:
          </h1>
          <div className="flex flex-col gap-4 py-6">
            <div className="flex gap-2 items-center">
              <Checkbox
                id="cancel"
                checked={checkbox1}
                onCheckedChange={(c) => setCheckbox1(c as boolean)}
              />
              <label
                htmlFor="cancel"
                className="text-sm  text-muted-foreground"
              >
                A bridge cannot be cancelled or reversed
              </label>
            </div>
            <div className="flex gap-2  items-center">
              <Checkbox
                id="multistep"
                checked={checkbox2}
                onCheckedChange={(c) => setCheckbox2(c as boolean)}
              />
              <label
                htmlFor="multistep"
                className="text-sm  text-muted-foreground"
              >
                Withdrawing is a multi-step process
              </label>
            </div>
            <div className="flex gap-2">
              <Checkbox
                id="speed"
                checked={checkbox3}
                onCheckedChange={(c) => setCheckbox3(c as boolean)}
              />
              <label htmlFor="speed" className="text-sm  text-muted-foreground">
                Withdrawals take {finalizationPeriod?.value}{" "}
                {finalizationPeriod?.period} from the time of proving until they
                can be finalized on Ethereum
              </label>
            </div>
            <div className="flex gap-2">
              <Checkbox
                id="gas"
                checked={checkbox4}
                onCheckedChange={(c) => setCheckbox4(c as boolean)}
              />
              <label htmlFor="gas" className="text-sm  text-muted-foreground">
                You need gas on{" "}
                {isSuperbridge
                  ? "the rollup and Ethereum Mainnet"
                  : `${rollupChain} and ${settlementChain}`}{" "}
                to complete a withdrawal
              </label>
            </div>
          </div>
          {checkbox1 && checkbox2 && checkbox3 && checkbox4 ? (
            <Button asChild>
              <Link href={mailLink}>Contact {email}</Link>
            </Button>
          ) : (
            <div className="bg-muted text-muted-foreground rounded-full h-12 flex justify-center items-center text-sm font-heading ">
              Contact us
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
