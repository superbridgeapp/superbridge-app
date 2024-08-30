import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

import { useHyperlaneControllerResolveWarpRouteYamlFile } from "@/codegen/index";
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
  const modal = useModal("CustomWarpRoutes");

  const saved = useHyperlaneState.useCustomWarpRoutesFile();
  const setSaved = useHyperlaneState.useSetCustomWarpRoutesFile();
  const setMailboxes = useHyperlaneState.useSetCustomMailboxes();
  const setTokens = useHyperlaneState.useSetCustomTokens();

  const resolveWarpRoutes = useHyperlaneControllerResolveWarpRouteYamlFile();

  const [data, setData] = useState("");

  useEffect(() => {
    setData(saved);
  }, [modal.isOpen, saved]);

  const onSave = async () => {
    setSaved(data);

    const result = await resolveWarpRoutes.mutateAsync({
      data: { file: data },
    });

    setMailboxes(result.data.mailboxes);
    setTokens(result.data.tokens);

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
            <Label htmlFor="warproutes">YAML</Label>
            <Textarea
              id="warproutes"
              value={data}
              className="min-h-56 text-xs p-4"
              onChange={(e) => setData(e.target.value)}
              placeholder="Paste your YAML Hyperlane routes"
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={resolveWarpRoutes.isPending} onClick={onSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
