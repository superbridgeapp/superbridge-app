import PageNav from "@/components/page-nav";
import PageFooter from "@/components/page-footer";

export default function Privacy() {
  return (
    <div className="w-screen h-screen overflow-y-auto">
      <PageNav />
      <div className="bg-zinc-50 dark:bg-zinc-950 w-full">
        <div className="max-w-2xl mx-auto py-40 px-8 ">
          <h1>Privacy Policy</h1>
        </div>
        <PageFooter />
      </div>
    </div>
  );
}
