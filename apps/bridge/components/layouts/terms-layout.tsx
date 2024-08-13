import PageFooter from "@/components/page-footer";
import PageNav from "@/components/page-nav";

import { SuperbridgeHead } from "../superbridge/superbridge-head";

export function TermsLayout({ children }: { children: JSX.Element }) {
  return (
    <div className="w-screen h-screen overflow-y-auto">
      <SuperbridgeHead
        title="Superbridge"
        description="Superchain bridge"
        icon=""
        og=""
      />
      <PageNav />
      <div className="bg-background w-full">
        {children}

        <PageFooter />
      </div>
    </div>
  );
}
