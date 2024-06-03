import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useState } from "react";
import { isPresent } from "ts-is-present";

import { bridgeControllerGetDeployments } from "@/codegen/index";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Support({
  deployment,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [open, setOpen] = useState(false);

  if (!deployment) {
    return <div>Not Found</div>;
  }

  const settlementChain = isSuperbridge
    ? "Ethereum Mainnet"
    : deployment.l1.name;
  const rollupChain = deployment.l2.name;

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

  const reprove = {
    title: "Why do I need to prove my withdrawal again?",
    description: (
      <div className="prose dark:prose-invert">
        <p>
          Due to the{" "}
          <a href="#" target="_blank" className="underline">
            Fault Proof upgrade
          </a>{" "}
          on OP Mainnet on July 10 2024, withdrawals that we not yet finzalized
          in the 7 days leading up to the upgrade need to proved again to adhere
          to the new security policy. You can find out more about the upgrade
          here:{" "}
          <a href="#" target="_blank" className="underline">
            OP Mainnet Fault Proof upgrade
          </a>{" "}
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
            {/* Start Fault Proof Alert */}
            <Alert size={"lg"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="w-6 h-6"
              >
                <path
                  d="M10.9641 8.63807C10.9641 8.13825 11.1894 7.86018 11.6575 7.86018C12.1257 7.86018 12.3615 8.13825 12.3615 8.63807C12.3615 9.1379 11.8511 13.5413 11.742 14.372C11.7315 14.467 11.7103 14.562 11.6575 14.562C11.6047 14.562 11.5836 14.4881 11.5731 14.3579C11.478 13.5378 10.9641 9.11678 10.9641 8.63455V8.63807ZM10.9641 18.2474C10.9641 17.8743 11.2739 17.5645 11.6575 17.5645C12.0412 17.5645 12.3404 17.8743 12.3404 18.2474C12.3404 18.6205 12.0306 18.9408 11.6575 18.9408C11.2844 18.9408 10.9641 18.631 10.9641 18.2474ZM2.65015 21.9996H20.6473C22.0342 21.9996 22.7029 20.9014 22.0553 19.7081L13.0092 2.99921C12.2841 1.66869 11.0486 1.66869 10.3235 2.98865L1.24571 19.6976C0.605095 20.8908 1.26683 21.9996 2.65367 21.9996H2.65015Z"
                  fill="#FFFF55"
                />
                <path
                  d="M9.68292 8.63813C9.68292 9.20132 10.2355 13.6258 10.3763 14.5727C10.4925 15.3822 10.9958 15.8398 11.6541 15.8398C12.358 15.8398 12.8051 15.3189 12.9212 14.5727C13.1571 13.1014 13.6358 9.20132 13.6358 8.63813C13.6358 7.58217 12.8262 6.58252 11.6541 6.58252C10.4819 6.58252 9.68292 7.59625 9.68292 8.63813ZM11.6646 20.2291C12.7417 20.2291 13.6252 19.3456 13.6252 18.2369C13.6252 17.1281 12.7417 16.2763 11.6646 16.2763C10.5875 16.2763 9.67236 17.1598 9.67236 18.2369C9.67236 19.314 10.5559 20.2291 11.6646 20.2291Z"
                  fill="white"
                />
                <path
                  d="M10.9641 8.63807C10.9641 8.13825 11.1894 7.86018 11.6575 7.86018C12.1257 7.86018 12.3615 8.13825 12.3615 8.63807C12.3615 9.1379 11.8511 13.5413 11.742 14.372C11.7315 14.467 11.7103 14.562 11.6575 14.562C11.6047 14.562 11.5836 14.4881 11.5731 14.3579C11.478 13.5378 10.9641 9.11678 10.9641 8.63455V8.63807ZM10.9641 18.2474C10.9641 17.8743 11.2739 17.5645 11.6575 17.5645C12.0412 17.5645 12.3404 17.8743 12.3404 18.2474C12.3404 18.6205 12.0306 18.9408 11.6575 18.9408C11.2844 18.9408 10.9641 18.631 10.9641 18.2474ZM9.68288 8.63807C9.68288 9.20125 10.2355 13.6258 10.3763 14.5726C10.4925 15.3822 10.9958 15.8398 11.654 15.8398C12.358 15.8398 12.805 15.3188 12.9212 14.5726C13.157 13.1013 13.6357 9.20125 13.6357 8.63807C13.6357 7.58211 12.8261 6.58246 11.654 6.58246C10.4819 6.58246 9.68288 7.59619 9.68288 8.63807ZM9.67232 18.2368C9.67232 19.3456 10.5558 20.2291 11.6646 20.2291C12.7733 20.2291 13.6252 19.3456 13.6252 18.2368C13.6252 17.128 12.7417 16.2762 11.6646 16.2762C10.5875 16.2762 9.67232 17.1597 9.67232 18.2368ZM2.3756 20.3171L11.4534 3.60815C11.742 3.06609 11.5907 3.06609 11.8793 3.59759L20.9254 20.3065C21.1718 20.7535 21.1929 20.7218 20.6473 20.7218H2.65015C2.10809 20.7218 2.12921 20.7535 2.37208 20.3171H2.3756ZM2.65015 21.9996H20.6473C22.0342 21.9996 22.7029 20.9014 22.0553 19.7081L13.0092 2.99921C12.2841 1.66869 11.0486 1.66869 10.3235 2.98865L1.24571 19.6976C0.605095 20.8908 1.26683 21.9996 2.65367 21.9996H2.65015Z"
                  fill="black"
                />
              </svg>
              <AlertTitle>OP Mainnet Fault Proof upgrade</AlertTitle>
              <AlertDescription>
                <p>
                  The OP Mainnet Fault Proof upgrade has been targeted for June
                  10. What does that mean for you?
                </p>
                <h3>I want to make a withdrawal</h3>
                <p>You should wait until the upgade is complete.</p>
                <h3>Why should I wait until the upgrade is complete?</h3>
                <p>
                  The upgrade will essentally wipe the status of existing prove
                  operations. Any proves done now would need to be resubmitted
                  after the upgrade.
                </p>
                <h3>I have a withdrawal in progress</h3>
                <p>
                  If you can finalize your withdrawal before the upgrade is
                  comlete we highly recommend you do that.
                </p>
                <h3>What if I don't finalize withdrawals in progress?</h3>
                <p>
                  You will need to prove again, wait, and then finalize after
                  the upgrade is complete.
                </p>
                <p>
                  <a
                    href="#"
                    target="_blank"
                    className="underline text-foreground font-bold"
                  >
                    Get updates from Optimism.io
                  </a>
                </p>
              </AlertDescription>
            </Alert>
            {/* End Fault Proof Alert */}
          </header>

          <Accordion type="single" collapsible className="w-full">
            {[
              whatIsTheNativeBridge,
              whatIsSuperbridge,
              reprove,
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
            <AccordionItem value="item-8">
              <AccordionTrigger>
                Why do USDC bridges via CCTP take multiple transactions?
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose dark:prose-invert">
                  <p>
                    As opposed to native bridging with where funds are routed
                    through the rollup smart contracts, native USDC issuance is
                    a two step mint and burn process via Circle’s CCTP smart
                    contracts.
                  </p>
                  <p>
                    After initiating the burn transaction on the origin chain,
                    users are then able to mint the corresponding amount of USDC
                    on the destination chain.
                  </p>
                  <p>
                    Native USDC bridging only takes around 15 minutes,
                    regardless of whether you’re bridging from or too Ethereum
                    Mainnet.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
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

  const { data } = await bridgeControllerGetDeployments({
    names: [params.name as string],
  });

  return { props: { deployment: data[0] } };
};
