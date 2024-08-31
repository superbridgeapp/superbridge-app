import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useHyperlaneControllerSaveWarpRouteYamlFile } from "@/codegen/index";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const router = useRouter();
  const modal = useModal("CustomWarpRoutes");

  const saveWarpRouteFile = useHyperlaneControllerSaveWarpRouteYamlFile();
  const setCustomRoutesId = useHyperlaneState.useSetCustomRoutesId();

  const [file, setFile] = useState("");

  useEffect(() => {
    setFile("");
  }, [modal.isOpen]);

  const onSave = async () => {
    if (file) {
      const result = await saveWarpRouteFile.mutateAsync({ data: { file } });
      setCustomRoutesId(result.data.id);

      router.push(
        "/",
        {
          pathname: "/",
          query: {
            hyperlaneWarpRoutes: result.data.id,
          },
        },
        { shallow: true }
      );
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
              value={file}
              className="min-h-56 text-xs p-4"
              onChange={(e) => setFile(e.target.value)}
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
