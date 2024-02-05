import { useConfigState } from "@/state/config";

import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

export const ConfirmWithdrawalModal = ({
  onConfirm,
}: {
  onConfirm: () => void;
}) => {
  const open = useConfigState.useDisplayWithdrawalModal();
  const setOpen = useConfigState.useSetDisplayWithdrawalModal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <h2 className="font-bold pb-4 border-b border-zinc-50 dark:border-zinc-900 p-6">
          Confirm withdrawal?
        </h2>
        <div className="space-y-6 p-6">
          <div>This will take 7 days</div>
          <Button
            className="w-full"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
