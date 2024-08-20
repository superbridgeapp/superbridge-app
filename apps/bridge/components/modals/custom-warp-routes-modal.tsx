import { useEffect, useState } from "react";

import { useModal } from "@/hooks/use-modal";
import { useSettingsState } from "@/state/settings";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export const CustomWarpRoutesModal = () => {
  const modal = useModal("CustomWarpRoutes");

  const saved = useSettingsState.useCustomWarpRoutes();
  const setSaved = useSettingsState.useSetCustomWarpRoutes();

  const [data, setData] = useState("");

  useEffect(() => {
    setData(saved);
  }, [modal.isOpen, saved]);

  const onSave = () => {
    setSaved(data);
    modal.close();
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <textarea
            className="text-black p-2"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          <Button onClick={onSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
