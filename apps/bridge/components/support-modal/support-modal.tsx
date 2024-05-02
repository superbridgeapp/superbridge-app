import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Checkbox } from "@/components/ui/checkbox";

import { Dialog, DialogContent } from "../ui/dialog";

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

  useEffect(() => {
    setCheckbox1(false);
    setCheckbox2(false);
    setCheckbox3(false);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex flex-col p-6 pt-8">
          Hello
          <div className="flex flex-col gap-2 py-4">
            <div className="pl-4 flex gap-2">
              <Checkbox
                id="timeframe"
                checked={checkbox1}
                onCheckedChange={(c) => setCheckbox1(c as boolean)}
              />
              <label
                htmlFor="timeframe"
                className="text-[11px] text-muted-foreground tracking-tight"
              >
                {"One"}
              </label>
            </div>
            <div className="pl-4 flex gap-2">
              <Checkbox
                id="speed"
                checked={checkbox2}
                onCheckedChange={(c) => setCheckbox2(c as boolean)}
              />
              <label
                htmlFor="speed"
                className="text-[11px] text-muted-foreground tracking-tight"
              >
                {"Two"}
              </label>
            </div>
            <div className="pl-4 flex gap-2">
              <Checkbox
                id="fees"
                checked={checkbox3}
                onCheckedChange={(c) => setCheckbox3(c as boolean)}
              />
              <label
                htmlFor="fees"
                className="text-[11px] text-muted-foreground tracking-tight"
              >
                {"Threee"}
              </label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
