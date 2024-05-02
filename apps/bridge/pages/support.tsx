import { useState } from "react";

import { SupportModal } from "@/components/support-modal";

export default function Support() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h1>Support</h1>

      <SupportModal open={open} setOpen={setOpen} />
      <button onClick={() => setOpen(true)}>Open modal</button>
    </div>
  );
}
