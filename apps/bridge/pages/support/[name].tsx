import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useState } from "react";
import { isPresent } from "ts-is-present";

import {
  bridgeControllerGetCctpDomains,
  bridgeControllerGetDeployments,
} from "@/codegen/index";
import { DeploymentFamily } from "@/codegen/model";
import PageFooter from "@/components/page-footer";
import PageNav from "@/components/page-nav";
import { SupportModal } from "@/components/support-modal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { isSuperbridge } from "@/config/superbridge";
import { getFinalizationPeriod } from "@/hooks/use-finalization-period";

export default function Support({
  deployment,
  cctpDomains,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [open, setOpen] = useState(false);

  if (!deployment) {
    return <div>Not Found</div>;
  }

  const settlementChain = deployment.l1.name;
  const rollupChain = deployment.l2.name;

  const supportsCctp = !!(
    cctpDomains.find((x) => x.chainId === deployment.l1.id) &&
    cctpDomains.find((x) => x.chainId === deployment.l2.id)
  );

  const whatIsTheNativeBridge = {
    title: `What is the ${rollupChain} native bridge`,
    description: (
      <>
        <div className="prose dark:prose-invert">
          <p>
            The {rollupChain} native bridge contracts are deployed as part of{" "}
            the {rollupChain} rollup. They control the flow of funds to and from{" "}
            {settlementChain} and {rollupChain}.
          </p>
          <p>
            More details can be found in the official{" "}
            <a
              href={
                deployment.family === DeploymentFamily.optimism
                  ? "https://docs.optimism.io/builders/app-developers/bridging/standard-bridge"
                  : "https://docs.arbitrum.io/build-decentralized-apps/cross-chain-messaging"
              }
            >
              Native Bridge contracts documentation
            </a>{" "}
            for {rollupChain}.
          </p>
        </div>
      </>
    ),
  };

  const whatIsSuperbridge = {
    title: "What is Superbridge?",
    description: (
      <>
        <div className="prose dark:prose-invert">
          <p>
            Superbridge is a pretty user interface over the{" "}
            <a
              href={
                deployment.family === DeploymentFamily.optimism
                  ? "https://docs.optimism.io/builders/app-developers/bridging/standard-bridge"
                  : "https://docs.arbitrum.io/build-decentralized-apps/cross-chain-messaging"
              }
            >
              Native Bridge contracts
            </a>{" "}
            for {rollupChain}.
          </p>

          <p>
            Please note Superbridge does not control or contribute to the Native
            Bridge contracts. The Native Bridges are a set of smart contracts
            owned and operated by the {rollupChain} team.
          </p>
          <p className="font-bold">
            Here’s some of the benefits of using the Native Bridge via
            Superbridge:
          </p>
          <ul>
            <li>
              You get the canonical, native asset on the destination chain.
            </li>
            <li>
              It’s generally the most secure form of bridging, because by using
              the Native Bridge you have the same trust assumptions as using the
              rollup itself
            </li>
          </ul>
          <p>
            Using the Native Bridge does have some UX quirks, and for users
            moving smaller amounts (especially when withdrawing){" "}
            <Link href="/alternative-bridges">retail bridges</Link> may be a
            better choice. So please read on…
          </p>
        </div>
      </>
    ),
  };

  const cancel = {
    title: "Can I cancel a bridge once it has started?",
    description: (
      <div className="prose dark:prose-invert">
        <p>No, a bridge cannot be cancelled once submitted.</p>
        <p>
          Before initiating a bridge we try to be as clear as possible about the
          potential network fees, wait periods, and the extra steps needed to
          complete a bridge.
        </p>
      </div>
    ),
  };

  const fees = {
    title: "Does Superbridge charge any extra fees?",
    description: (
      <div className="prose dark:prose-invert">
        <p>
          Superbridge does not charge any extra fees for using the {rollupChain}{" "}
          Native Bridge contracts. However, standard network fees still apply.
          These fees are not collected by Superbridge. The specific transaction
          fee can vary depending on the transaction type and the current network
          congestion.
        </p>
      </div>
    ),
  };

  const speed = {
    title: "Can I speed up my bridge?",
    description: (
      <div className="prose dark:prose-invert">
        <p>
          If you have already started a bridge with Superbridge, then you cannot
          speed it up.{" "}
        </p>
        <p>
          You will need to complete all required steps and wait periods to
          receive your tokens.
        </p>
        <p>
          If you need a faster bridge transaction you might be able to use a{" "}
          <Link href="/alternative-bridges">third party bridge.</Link> They
          provide faster bridging services (but charge a small extra fee). They
          also usually support multiple networks.
        </p>
        <p>Please note that their token selection may be more limited.</p>
      </div>
    ),
  };

  const whatIfIDontProve =
    deployment?.family === DeploymentFamily.optimism
      ? {
          title: `What happens if I don’t prove or finalize my withdrawal to ${settlementChain}?`,
          description: (
            <div className="prose dark:prose-invert">
              <p>
                If you don't prove or finalize the withdrawal your funds will
                remain in the bridge until you do so.
              </p>
              <p>
                Before initiating a bridge we try to be as clear as possible
                about the potential network fees, wait periods, and the extra
                steps needed to complete a bridge.
              </p>
            </div>
          ),
        }
      : null;

  const finalizationPeriod = getFinalizationPeriod(deployment, false);

  return (
    <div className="w-screen h-screen overflow-y-auto bg-background">
      <PageNav />
      <main>
        <section className="max-w-3xl mx-auto p-8">
          <header className="flex flex-col items-center py-16 gap-4">
            <img
              src={deployment?.theme?.theme.imageNetwork}
              alt={rollupChain}
              className="w-24 h-24 rounded-full"
            />
            <h1 className="font-bold text-6xl tracking-tighter text-center">
              {rollupChain}
              <br />
              FAQs &amp; Support
            </h1>
            <Link
              className="rounded-full shadow-sm bg-white dark:bg-zinc-800 text-sm font-medium tracking-tighter py-2 px-4 hover:scale-105 transition-transform cursor-pointer grow-0 flex items-center leading-4"
              href="/support"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="fill-foreground mr-2"
              >
                <path d="M7 0.677246C6.70724 0.677246 6.41553 0.769919 6.1849 0.984753L0.523395 5.9849C0.246428 6.23133 0 6.55463 0 7.0001C0 7.44556 0.246428 7.76887 0.523395 8.01529L6.1849 13.0154C6.41553 13.2313 6.70829 13.323 7 13.323C7.67715 13.323 8.23108 12.769 8.23108 12.0919C8.23108 11.738 8.09312 11.4147 7.81616 11.1693L4.49361 8.23118H12.7689C13.4461 8.23118 14 7.67725 14 7.0001C14 6.32295 13.4461 5.76902 12.7689 5.76902H4.49255L7.8151 2.83085C8.09207 2.58442 8.23003 2.26217 8.23003 1.90833C8.23003 1.23118 7.67609 0.677246 6.99895 0.677246L7 0.677246Z" />
              </svg>
              <span>All chains</span>
            </Link>
          </header>
          <Accordion type="single" collapsible className="w-full">
            {[
              whatIsTheNativeBridge,
              whatIsSuperbridge,
              fees,
              cancel,
              speed,
              whatIfIDontProve,
            ]
              .filter(isPresent)
              .map(({ title, description }) => (
                <AccordionItem key={title} value={title}>
                  <AccordionTrigger>{title}</AccordionTrigger>
                  <AccordionContent>{description}</AccordionContent>
                </AccordionItem>
              ))}

            <AccordionItem value="item-6">
              <AccordionTrigger>
                Why does it take {finalizationPeriod?.value}{" "}
                {finalizationPeriod?.period} to withdraw to {settlementChain}?
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose dark:prose-invert">
                  <p>
                    Because of the way the {rollupChain} Native Bridge operates,
                    users are required to wait when moving assets out of{" "}
                    {`${rollupChain} into ${settlementChain}`}. This period of
                    time is called the{" "}
                    <span className="font-bold">Challenge Period</span> and
                    serves to help secure the assets stored on {rollupChain}.
                    You can find more information about the Challenge Period{" "}
                    <a href="https://docs.rollbridge.app/withdrawals">here</a>.
                  </p>
                  <p>
                    If you need a faster bridge transaction you might be able to
                    use a{" "}
                    <Link href="/alternative-bridges">third party bridge.</Link>{" "}
                    They provide faster bridging services (but charge a small
                    extra fee). They also usually support multiple networks.
                  </p>
                  <p>
                    Please note that their token selection may be more limited.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>
                Why does it take multiple transactions to withdraw to{" "}
                {settlementChain}?
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose dark:prose-invert">
                  <p>
                    Superbridge uses the {rollupChain}
                    Native Bridge contracts which are highly secure, and require
                    a lot of processing. They are also trustless, which is why
                    multiple transactions and wait periods are required.
                  </p>
                  <h4 className="font-bold">Required steps to withdraw:</h4>
                  <ol>
                    <li>Initiate the withdrawal on {rollupChain}.</li>

                    {deployment.family === DeploymentFamily.optimism && (
                      <>
                        <li>
                          Wait until the withdrawals root is published on{" "}
                          {settlementChain}, which is typically not longer than
                          an hour or two, but could take longer in the case of
                          an outage.
                        </li>
                        <li>Prove the withdrawal.</li>
                      </>
                    )}
                    <li>
                      Wait the verification challenge period, which is{" "}
                      {finalizationPeriod?.value} {finalizationPeriod?.period}{" "}
                      from the time the withdrawal is proved on Ethereum.
                    </li>
                    <li>Claim the withdrawal.</li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>

            {supportsCctp && (
              <AccordionItem value="item-8">
                <AccordionTrigger>
                  Why do USDC bridges via CCTP take multiple transactions?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose dark:prose-invert">
                    <p>
                      As opposed to native bridging with where funds are routed
                      through the rollup smart contracts, native USDC issuance
                      is a two step mint and burn process via Circle’s CCTP
                      smart contracts.
                    </p>
                    <p>
                      After initiating the burn transaction on the origin chain,
                      users are then able to mint the corresponding amount of
                      USDC on the destination chain.
                    </p>
                    <p>
                      Native USDC bridging takes around 15 minutes, regardless
                      of whether you’re bridging from or to Ethereum Mainnet.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="item-9">
              <AccordionTrigger>
                What are some alternatives to Superbridge?
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose dark:prose-invert">
                  <p>
                    When you’re in a hurry or only withdrawing small amounts, it
                    might make sense to use other bridges... So we put together
                    a handy list of alternative{" "}
                    <Link href="/alternative-bridges">third party bridges</Link>
                    .
                  </p>
                  <p>
                    They provide faster bridging services (but often charge a
                    small extra fee). They also usually support multiple
                    networks.
                  </p>
                  <p>
                    Please note that their token selection may be more limited.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-10">
              <AccordionTrigger>Have more questions?</AccordionTrigger>
              <AccordionContent>
                <div className="prose dark:prose-invert pb-2">
                  <p>
                    If you have additional questions, feel free to reach out.
                  </p>
                </div>
                <Button onClick={() => setOpen(true)}>Contact us</Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <SupportModal
            open={open}
            setOpen={setOpen}
            finalizationPeriod={finalizationPeriod}
            settlementChain={settlementChain}
            rollupChain={rollupChain}
          />
        </section>
      </main>
      <PageFooter />
    </div>
  );
}

export const getServerSideProps = async ({
  req,
  params,
}: GetServerSidePropsContext) => {
  if (!req.url || !params?.name || !isSuperbridge) {
    return { props: { deployment: null } };
  }

  const [{ data: deployments }, { data: cctpDomains }] = await Promise.all([
    bridgeControllerGetDeployments({
      names: [params.name as string],
    }),
    bridgeControllerGetCctpDomains(),
  ]);

  return { props: { deployment: deployments[0], cctpDomains } };
};
