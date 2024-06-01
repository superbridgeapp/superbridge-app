import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";

import { bridgeControllerGetDeployments } from "@/codegen/index";
import PageFooter from "@/components/page-footer";
import PageNav from "@/components/page-nav";
import { isSuperbridge } from "@/config/superbridge";

import { SUPERCHAIN_MAINNETS, SUPERCHAIN_TESTNETS } from "../[[...index]]";
import { getServerSideProps as getServerSidePropsFromDomain } from "../client-terms";

export default function Support({
  deployments,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!isSuperbridge) {
    return <div>Not Found</div>;
  }

  return (
    <div className="w-screen h-screen overflow-y-auto bg-background">
      <PageNav />
      <main>
        <section className="max-w-3xl mx-auto p-8">
          <header className="py-16">
            <h1 className="font-bold text-6xl tracking-tighter">
              FAQs &amp; Support
            </h1>
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

export const getServerSideProps = async (args: GetServerSidePropsContext) => {
  if (!isSuperbridge) {
    const { props } = await getServerSidePropsFromDomain(args);
    if (props.deployment) {
      return {
        redirect: {
          destination: `https://superbridge.app/support/${props.deployment.name}`,
          permanent: false,
        },
      };
    }
  }
  const { data } = await bridgeControllerGetDeployments({
    names: [...SUPERCHAIN_MAINNETS, ...SUPERCHAIN_TESTNETS],
  });

  data.sort((a, b) => a.displayName.localeCompare(b.displayName));

  return { props: { deployments: data } };
};
