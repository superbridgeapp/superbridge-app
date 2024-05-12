import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useState } from "react";
import { match } from "ts-pattern";

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
import { defaultImages } from "@/hooks/use-theme";

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

  const navIcon = isSuperbridge
    ? "/img/logo.svg"
    : deployment?.theme?.theme.imageLogo ?? defaultImages.nav;
  const backgroundIcon = isSuperbridge
    ? null
    : deployment?.theme?.theme.imageBackground;

  const backgroundImageBlendMode =
    deployment?.theme?.theme.backgroundImageBlendMode;

  const backgroundImageOpacity =
    deployment?.theme?.theme.backgroundImageOpacity;

  const backgroundImageSize = deployment?.theme?.theme.backgroundImageSize;

  const backgroundImagePosition =
    deployment?.theme?.theme.backgroundImagePosition;
  const backgroundImageRepeat = deployment?.theme?.theme.backgroundImageRepeat;

  const what = match({ isSuperbridge })
    .with({ isSuperbridge: true }, () => ({
      title: "What is Superbridge?",
      description: (
        <div className="prose">
          <p>
            Superbridge is a pretty user interface over the{" "}
            <a href="https://docs.optimism.io/builders/app-developers/bridging/standard-bridge">
              Native Bridge contracts
            </a>{" "}
            for Optimism Superchain rollups.
          </p>
          <p>
            Please note Superbridge does not control or contribute to the Native
            Bridge contracts. The Native Bridges are a set of smart contracts
            owned and operated by the respective Optimism Superchain teams.
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
      ),
    }))
    .with({ isSuperbridge: false }, () => ({
      title: `What is the ${rollupChain} bridge?`,
      description: (
        <div className="prose">
          <p>
            The {rollupChain} bridge is a pretty user interface over the{" "}
            <a
              href={
                deployment.family === DeploymentFamily.optimism
                  ? "https://docs.optimism.io/builders/app-developers/bridging/standard-bridge"
                  : "https://docs.arbitrum.io/build-decentralized-apps/cross-chain-messaging"
              }
            >
              Native Bridge contracts
            </a>
            .
          </p>
          <p>
            The {rollupChain} bridge is provided by{" "}
            <a href="https://superbridge.app">Superbridge</a>, Superbridge does
            not control or contribute to the Native Bridge contracts. The Native
            Bridges are a set of smart contracts owned and operated by the{" "}
            {rollupChain} team.
          </p>
          <p className="font-bold">
            Here’s some of the benefits of using the Native Bridge:
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
      ),
    }))
    .exhaustive();

  const fees = match({ isSuperbridge })
    .with({ isSuperbridge: true }, () => ({
      title: "Does Superbridge charge any extra fees?",
      description: (
        <div className="prose">
          <p>
            Superbridge does not charge any extra fees for using the Superchain
            Native Bridge contracts. However, standard network fees still apply.
            These fees are not collected by Superbridge. The specific
            transaction fee can vary depending on the transaction type and the
            current network congestion.
          </p>
        </div>
      ),
    }))
    .with({ isSuperbridge: false }, () => ({
      title: `Does ${rollupChain} bridge charge any extra fees?`,
      description: (
        <div className="prose">
          <p>
            {rollupChain} bridge does not charge any extra fees for using the
            Native Bridge contracts. However, standard network fees still apply.
            These fees are not collected by {rollupChain} bridge. The specific
            transaction fee can vary depending on the transaction type and the
            current network congestion.
          </p>
        </div>
      ),
    }))
    .exhaustive();

  const speed = match({ isSuperbridge })
    .with({ isSuperbridge: true }, () => ({
      description: (
        <div className="prose">
          <p>
            If you have already started a bridge with Superbridge, then you
            cannot speed it up.{" "}
          </p>
          <p>
            You will need to complete all required steps and wait periods to
            receive your tokens.
          </p>
          <p>
            If you need a faster bridge transaction you might be able to use a{" "}
            <Link href="/alternative-bridges">third party bridge.</Link> They
            provide faster bridging services (but charge a small extra fee).
            They also usually support multiple networks.
          </p>
          <p>Please note that their token selection may be more limited.</p>
        </div>
      ),
    }))
    .with({ isSuperbridge: false }, () => ({
      description: (
        <div className="prose">
          <p>
            If you have already started a bridge with the {rollupChain} bridge,
            then you cannot speed it up.{" "}
          </p>
          <p>
            You will need to complete all required steps and wait periods to
            receive your tokens.
          </p>
          <p>
            If you need a faster bridge transaction you might be able to use a{" "}
            <Link href="/alternative-bridges">third party bridge.</Link> They
            provide faster bridging services (but charge a small extra fee).
            They also usually support multiple networks.
          </p>
          <p>Please note that their token selection may be more limited.</p>
        </div>
      ),
    }))
    .exhaustive();
  const whatIfIDontProve = match({
    isSuperbridge,
    isOptimism: deployment?.family === DeploymentFamily.optimism,
  })
    .with({ isSuperbridge: true }, () => ({
      title: `What happens if I don’t prove or finalize my withdrawal to Ethereum Mainnet?`,
      description: (
        <div className="prose">
          <p>
            If you don't prove or finalize the withdrawal your funds will remain
            in the bridge until you do so.
          </p>
          <p>
            Before initiating a bridge we try to be as clear as possible about
            the potential network fees, wait periods, and the extra steps needed
            to complete a bridge.
          </p>
        </div>
      ),
    }))
    .with({ isOptimism: true }, (w) => ({
      title: `What happens if I don’t prove or finalize my withdrawal to ${settlementChain}?`,
      description: (
        <div className="prose">
          <p>
            If you don't prove or finalize the withdrawal your funds will remain
            in the bridge until you do so.
          </p>
          <p>
            Before initiating a bridge we try to be as clear as possible about
            the potential network fees, wait periods, and the extra steps needed
            to complete a bridge.
          </p>
        </div>
      ),
    }))
    .with({ isSuperbridge: false, isOptimism: false }, () => ({
      title: `What happens if I don’t finalize my withdrawal to ${settlementChain}?`,
      description: (
        <div className="prose">
          <p>
            If you don't finalize the withdrawal your funds will remain in the
            bridge until you do so.
          </p>
          <p>
            Before initiating a bridge we try to be as clear as possible about
            the potential network fees, wait periods, and the extra steps needed
            to complete a bridge.
          </p>
        </div>
      ),
    }))
    .exhaustive();

  const finalizationPeriod = getFinalizationPeriod(deployment, false);

  return (
    <div className="w-screen h-screen overflow-y-auto bg-purple-100">
      <PageNav />
      <main>
        <section className="max-w-3xl mx-auto p-8">
          <header className="py-16">
            <h1 className="font-bold text-6xl tracking-tighter">
              FAQs &amp; Support
            </h1>
          </header>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{what.title}</AccordionTrigger>
              <AccordionContent>{what.description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>{fees.title}</AccordionTrigger>
              <AccordionContent>{fees.description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Can I cancel a bridge once it has started?
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose">
                  <p>No, a bridge cannot be cancelled once submitted.</p>
                  <p>
                    Before initiating a bridge we try to be as clear as possible
                    about the potential network fees, wait periods, and the
                    extra steps needed to complete a bridge.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I speed up my bridge?</AccordionTrigger>
              <AccordionContent>{speed.description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>{whatIfIDontProve.title}</AccordionTrigger>
              <AccordionContent>
                {whatIfIDontProve.description}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>
                Why does it take {finalizationPeriod?.value}{" "}
                {finalizationPeriod?.period} to withdraw to {settlementChain}?
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose">
                  <p>
                    Because of the way the {isSuperbridge ? "Superchain" : ""}{" "}
                    Native Bridge operates, users are required to wait when
                    moving assets out of{" "}
                    {isSuperbridge
                      ? "Optimism Superchains into the Ethereum Mainnet"
                      : `${rollupChain} into ${settlementChain}`}
                    . This period of time is called the{" "}
                    <span className="font-bold">Challenge Period</span> and
                    serves to help secure the assets stored on{" "}
                    {isSuperbridge ? "Optimism Superchains" : rollupChain}. You
                    can find more information about the Challenge Period{" "}
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
                <div className="prose">
                  <p>
                    Superbridge uses the {isSuperbridge ? "Superchain " : ""}
                    Native Bridge contracts which are highly secure, and require
                    a lot of processing. They are also trustless, which is why
                    multiple transactions and wait periods are required.
                  </p>
                  <h4 className="font-bold">Required steps to withdraw:</h4>
                  <ol>
                    <li>
                      Initiate the withdrawal on{" "}
                      {isSuperbridge ? "a Superchain Rollup" : rollupChain}.
                    </li>

                    {(isSuperbridge ||
                      deployment.family === DeploymentFamily.optimism) && (
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
                <div className="prose">
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
                <div className="prose">
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
          </Accordion>
          <div className=" py-8 flex gap-8 items-start justify-between">
            <div>
              <h3 className="font-bold tracking-tight text-2xl">
                Have more questions?
              </h3>
              <p>If you have additional questions, feel free to reach out.</p>
            </div>
            <Button onClick={() => setOpen(true)}>Contact us</Button>
          </div>

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
  query,
}: GetServerSidePropsContext) => {
  if (!req.url || !params?.name) {
    return { props: { deployment: null } };
  }
  const { data } = await bridgeControllerGetDeployments({
    names: [params.name as string],
  });

  return { props: { deployment: data[0] } };
};
