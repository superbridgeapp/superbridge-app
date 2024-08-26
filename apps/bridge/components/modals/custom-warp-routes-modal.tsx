import { useEffect, useState } from "react";

import { useHyperlaneControllerResolveWarpRouteYamlFile } from "@/codegen/index";
import { useModal } from "@/hooks/use-modal";
import { useHyperlaneState } from "@/state/hyperlane";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

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
        <div className="flex flex-col gap-8 p-6">
          <textarea
            className="text-black p-2"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          <Button disabled={resolveWarpRoutes.isPending} onClick={onSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
