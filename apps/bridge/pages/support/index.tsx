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
    <div className="w-screen h-screen overflow-y-auto bg-purple-100">
      <PageNav />
      <main>
        {deployments.map((d) => {
          const theme = d.theme?.theme;
          return (
            <div>
              <div>{d.l2.name}</div>
              <img src={theme?.imageLogo} alt="" />

              <Link href={`/support/${d.name}`} prefetch={false}>
                View
              </Link>
            </div>
          );
        })}
      </main>
      <PageFooter />
    </div>
  );
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  if (isSuperbridge) {
    const { data } = await bridgeControllerGetDeployments({
      names: [...SUPERCHAIN_MAINNETS, ...SUPERCHAIN_TESTNETS],
    });
    return { props: { deployments: data } };
  }

  return { props: { deployments: [] } };
};
