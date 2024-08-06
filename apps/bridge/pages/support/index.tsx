import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";

import { bridgeControllerGetDeployments } from "@/codegen/index";
import PageFooter from "@/components/page-footer";
import PageNav from "@/components/page-nav";
import {
  SUPERCHAIN_MAINNETS,
  SUPERCHAIN_TESTNETS,
} from "@/constants/superbridge";

export default function Support({
  deployments,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (deployments.length > 1) {
    return <div>Not Found</div>;
  }

  return (
    <>
      {/* <StatelessHead deployment={deployments[0] ?? null} /> */}
      <div className="w-screen h-screen overflow-y-auto bg-background">
        <PageNav />
        <main>
          <section className="max-w-3xl mx-auto p-8">
            <header className="py-16">
              <h1 className="font-heading text-6xl ">FAQs &amp; Support</h1>
            </header>
            <div className="rounded-xl bg-card">
              <ul className="divide-y">
                {deployments.map((d) => {
                  const theme = d.theme?.theme;
                  return (
                    <li key={d.name} className="flex">
                      <Link
                        href={`/support/${d.name}`}
                        prefetch={false}
                        className="flex gap-2 items-center p-6 w-full"
                      >
                        <img
                          src={theme?.imageNetwork}
                          alt={d.l2.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <h3 className="font-heading text-xl">{d.l2.name}</h3>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </main>
        <PageFooter />
      </div>
    </>
  );
}

export const getServerSideProps = async (args: GetServerSidePropsContext) => {
  const { data } = await bridgeControllerGetDeployments({
    names: [...SUPERCHAIN_MAINNETS, ...SUPERCHAIN_TESTNETS],
  });

  data.sort((a, b) => a.displayName.localeCompare(b.displayName));

  return { props: { deployments: data } };
};
