import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";

import PageFooter from "@/components/page-footer";
import PageNav from "@/components/page-nav";
import { isSuperbridge } from "@/config/superbridge";

import { bridgeControllerGetDeployments } from "@/codegen/index";
import { SUPERCHAIN_MAINNETS, SUPERCHAIN_TESTNETS } from "../[[...index]]";

export default function Support({
  deployments,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="w-screen h-screen overflow-y-auto bg-zinc-50">
      <PageNav />
      <main>
        <section className="max-w-3xl mx-auto p-8">
          <header className="py-16">
            <h1 className="font-bold text-6xl tracking-tighter">
              FAQs &amp; Support
            </h1>
          </header>
          <div className="rounded-xl bg-white">
            <ul>
              {deployments.map((d) => {
                const theme = d.theme?.theme;
                return (
                  <li className="border-b border-zinc-50 flex">
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
                      <h3 className="font-bold text-xl">{d.l2.name}</h3>
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
  );
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  // if (isSuperbridge) {
  const { data } = await bridgeControllerGetDeployments({
    names: [...SUPERCHAIN_MAINNETS, ...SUPERCHAIN_TESTNETS],
  });
  return { props: { deployments: data } };
  // }

  return { props: { deployments: [] } };
};
