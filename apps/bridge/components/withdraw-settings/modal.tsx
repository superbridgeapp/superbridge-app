import { Dialog, DialogContent } from "../ui/dialog";
import { SettingsModalProps } from "./types";
import { WithdrawSettings } from "./withdraw-settings";

export const WithdrawSettingsModal = (props: SettingsModalProps) => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent>
        <WithdrawSettings />
      </DialogContent>
    </Dialog>
  );
};
