import { useSettingsState } from "@/state/settings";

import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";

export const TosModal = () => {
  const dismiss = useSettingsState.useDismissTos();
  const hasViewedTos = useSettingsState.useHasViewedTos();

  return (
    <Dialog open={!hasViewedTos} onOpenChange={() => {}}>
      <DialogContent>
        <h2 className="font-bold pb-4 border-b border-zinc-50 dark:border-zinc-900 p-6">
          ToS
        </h2>
        <div className="space-y-6 p-6">
          <div>Lorem ipsum</div>
          <Button className="w-full" onClick={dismiss}>
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
