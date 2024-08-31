import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSaveWarpRouteFile } from "@/hooks/hyperlane/use-save-warp-route-file";
import { useModal } from "@/hooks/use-modal";
import { useHyperlaneState } from "@/state/hyperlane";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";

export const CustomWarpRoutesModal = () => {
  const modal = useModal("CustomWarpRoutes");

  const saved = useHyperlaneState.useCustomWarpRoutesFile();

  const saveWarpRouteFile = useSaveWarpRouteFile();

  const [data, setData] = useState("");

  useEffect(() => {
    setData(saved);
  }, [modal.isOpen, saved]);

  const onSave = async () => {
    if (data) {
      await saveWarpRouteFile.mutateAsync(data);
    }

    modal.close();
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custom Warp Routes</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col px-6">
          <div className="grid w-full gap-2">
            <Label htmlFor="warproutes">Warp route YAML</Label>
            <Textarea
              id="warproutes"
              value={data}
              className="min-h-56 text-xs p-4"
              onChange={(e) => setData(e.target.value)}
              placeholder="Paste in your warp route deployment YAML file"
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={saveWarpRouteFile.isPending} onClick={onSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
