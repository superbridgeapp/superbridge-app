import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Checkbox } from "@/components/ui/checkbox";

import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import Link from "next/link";

export const SupportModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
}) => {
  const { t } = useTranslation();

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

  const mailLink = "mailto:support@superbridge.app";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex flex-col p-6 pt-8">
          <h1 className="font-bold text-xl tracking-tight">
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
                className="text-sm font-medium text-muted-foreground"
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
                className="text-sm font-medium text-muted-foreground"
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
              <label
                htmlFor="speed"
                className="text-sm font-medium text-muted-foreground"
              >
                Withdrawals take 7 days from the time of proving until they can
                be finalized on Ethereum
              </label>
            </div>
            <div className="flex gap-2">
              <Checkbox
                id="gas"
                checked={checkbox4}
                onCheckedChange={(c) => setCheckbox4(c as boolean)}
              />
              <label
                htmlFor="gas"
                className="text-sm font-medium text-muted-foreground"
              >
                You need gas on the Rollup and Ethereum to complete a withdrawal
              </label>
            </div>
          </div>
          {checkbox1 && checkbox2 && checkbox3 && checkbox4 ? (
            <Button asChild>
              <Link href={mailLink}>Contact us</Link>
            </Button>
          ) : (
            <div className="bg-muted text-muted-foreground rounded-full h-12 flex justify-center items-center text-sm font-bold ">
              Contact us
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
