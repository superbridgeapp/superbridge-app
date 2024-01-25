import { useQuery } from "@tanstack/react-query";
import { Axios } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { match } from "ts-pattern";
import { Address } from "viem";

import {
  useBridgeControllerAdminAddDeployment,
  useBridgeControllerAdminGetDeployments,
} from "@/codegen/index";
import { DeploymentType } from "@/codegen/model";
import { Button } from "@/components/ui/button";
import { baseURL } from "@/utils/query-client";

import { ErrorComponent } from "./Error";
import { Loading } from "./Loading";

interface IdProps {
  id: string;
}

const isBaseChain = (baseChainId: string) =>
  ["1", "42161", "42170"].includes(baseChainId);

const CustomButton = ({ id }: IdProps) => {
  const addDeployment = useBridgeControllerAdminAddDeployment();

  useEffect(() => {
    if (addDeployment.isSuccess) {
      setTimeout(() => {
        window.location.href = addDeployment.data.data.id;
      }, 1000);
    }
  }, [addDeployment]);

  return (
    <Button
      disabled={addDeployment.isLoading || addDeployment.isSuccess}
      onClick={() => addDeployment.mutate({ data: { id } })}
      className="w-full rounded-full"
    >
      {match(addDeployment)
        .with({ isLoading: true }, () => "Creating...")
        .with({ isSuccess: true }, () => "Created, redirecting...")
        .with({ isError: true }, () => "An error occurred")
        .otherwise(() => "Create")}
    </Button>
  );
};

const axios = new Axios({ baseURL });

interface ConduitConfig {
  slug: string;
  rpcUrl: string;
  blockExplorerUrl: string;
  l1ChainId: string;
  l2ChainId: string;
  l1Addresses: {
    AddressManager: Address;
    BondManager: Address;
    CanonicalTransactionChain: Address;
    L1CrossDomainMessenger: Address;
    L1StandardBridge: Address;
    L2OutputOracle: Address;
    OptimismPortal: Address;
    StateCommitmentChain: Address;
  };
  l1BlockNumber: string;
}

const TEST_CONDUIT_ID = "test-conduit-id";
const TEST_L1_CONDUIT_ID = "test-l1-conduit-id";

function useConduitConfig(id: string) {
  return useQuery([`conduit-${id}`], () =>
    axios
      .get(
        `https://api.conduit.xyz/public/network/indexingMetadata/${
          [TEST_CONDUIT_ID, TEST_L1_CONDUIT_ID].includes(id)
            ? "orderly-l2-4460-sepolia-8tc3sd7dvy"
            : id
        }`
      )
      .then((x) => JSON.parse(x.data))
  );
}

export function ErrorPage() {
  const router = useRouter();

  const id = router.query.id;
  const conduit = useConduitConfig(id as string);
  const deployments = useBridgeControllerAdminGetDeployments();

  if (conduit.isLoading) {
    return <Loading />;
  }

  if (!conduit.data) {
    return <ErrorComponent />;
  }

  const deployment = deployments.data?.data.find((x) => x.conduitId === id);
  if (deployment && id !== TEST_CONDUIT_ID) {
    window.location.href = `https://${id}.${
      deployment.type === DeploymentType.devnet ? "devnets" : "testnets"
    }.rollbridge.app`;
    return <Loading />;
  }

  if (
    isBaseChain(conduit.data.l1ChainId) ||
    router.asPath.endsWith(TEST_L1_CONDUIT_ID)
  ) {
    return (
      <main
        className="flex items-center justify-center w-screen h-screen fixed inset-0"
        key="mainNetDeploymentMain"
      >
        <div className="h-screen flex-1 flex-col">
          <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
              <div className="bg-white dark:bg-zinc-900 px-6 py-12 shadow rounded-[32px] sm:px-12 dark:text-zinc-200 border-black/[0.0125] dark:border-white/[0.0125] dark:border dark:border-zinc-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  data-name="Layer 2"
                  viewBox="0 0 35.61 24.13"
                  className="fill-zinc-900 dark:fill-zinc-100 w-16 h-auto mx-auto mb-8"
                >
                  <path
                    d="M8.06 21.66l-6.4-7.24C.92 13.58 0 12.1 0 10.48s.93-3.1 1.66-3.94l3.61-4.08C6.65.91 8.23-.01 9.97-.01c1.38 0 2.56.49 3.45 1.3 1.01.93 1.64 2.25 1.72 3.68h2.13c.08-2.62 2.12-4.98 5.19-4.98 1.74 0 3.32.92 4.7 2.47l6.67 7.56c.85.96 1.79 2.31 1.79 3.92 0 1.49-.96 2.85-1.66 3.64l-3.61 4.08c-1.38 1.55-2.96 2.47-4.7 2.47a5.09 5.09 0 01-4.74-3.38c-1.03-.3-1.77-.77-2.56-1.69-.08 2.77-2.12 5.08-5.19 5.08-1.9 0-3.67-.85-5.09-2.47zm-5.21-8.28l3.61 4.08c1.12 1.26 2.29 1.93 3.51 1.93 2.21 0 3.61-1.68 3.61-3.51 0-1.15-.71-1.69-1.6-2.31a.824.824 0 01-.36-.66c0-.43.35-.79.77-.79.17 0 .36.06.59.21.68.41 1.57 1.31 1.91 2.09h2.66c.35-.77 1.23-1.68 1.91-2.09.22-.14.41-.21.59-.21.43 0 .77.36.77.79 0 .27-.16.52-.36.66-.89.62-1.6 1.15-1.6 2.31 0 1.83 1.39 3.51 3.61 3.51 1.22 0 2.39-.66 3.51-1.93l3.61-4.08c.59-.66 1.26-1.8 1.26-2.89s-.68-2.23-1.26-2.89l-3.61-4.08c-1.12-1.26-2.29-1.93-3.51-1.93-2.21 0-3.61 1.68-3.61 3.51 0 1.15.71 1.69 1.6 2.31.21.14.36.4.36.66 0 .43-.35.79-.77.79-.17 0-.36-.06-.59-.21-.68-.41-1.57-1.31-1.91-2.09h-2.66c-.35.77-1.23 1.68-1.91 2.09-.22.14-.41.21-.59.21-.43 0-.77-.36-.77-.79 0-.27.16-.52.36-.66.89-.62 1.6-1.15 1.6-2.31 0-1.83-1.39-3.51-3.61-3.51-1.22 0-2.39.66-3.51 1.93L2.85 7.6c-.59.66-1.26 1.8-1.26 2.89s.68 2.23 1.26 2.89zM5.87 6l1.66-1.85c.35-.38.87-.44 1.2-.13.35.28.28.81 0 1.14L7.07 7.04c-.33.36-.87.4-1.2.11-.35-.3-.28-.84 0-1.15zm15.72-3.04c.11-.05.24-.06.35-.08.52-.03.9.3.92.79.02.36-.24.7-.6.77-.21.03-.27.14-.3.33-.03.35-.35.62-.73.63-.47.02-.82-.33-.84-.81 0-.77.52-1.41 1.2-1.64z"
                    data-name="Layer 1"
                  ></path>
                </svg>

                <h1 className="font-bold text-2xl text-center">Hello {":)"}</h1>
                <p className="text-sm text-center my-4">
                  For mainnet deployments of Rollbridge, please register via our
                  TypeForm{" "}
                </p>
                <Link
                  className="w-full rounded-full inline-flex items-center justify-center text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 transition-all bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full rounded-full"
                  href={`https://r9vkbxvmyui.typeform.com/to/ThwS75xW#conduitid=${conduit.data.slug}`}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex items-center justify-center w-screen h-screen fixed inset-0"
      key="createInstanceMain"
    >
      <div className="justify-center align-center item-center flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white dark:bg-zinc-900 px-6 py-12 shadow rounded-[32px] sm:px-12 dark:text-zinc-200 border-black/[0.0125] dark:border-white/[0.0125]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                data-name="Layer 2"
                viewBox="0 0 35.61 24.13"
                className="fill-zinc-900 dark:fill-zinc-100 w-16 h-auto mx-auto mb-8"
              >
                <path
                  d="M8.06 21.66l-6.4-7.24C.92 13.58 0 12.1 0 10.48s.93-3.1 1.66-3.94l3.61-4.08C6.65.91 8.23-.01 9.97-.01c1.38 0 2.56.49 3.45 1.3 1.01.93 1.64 2.25 1.72 3.68h2.13c.08-2.62 2.12-4.98 5.19-4.98 1.74 0 3.32.92 4.7 2.47l6.67 7.56c.85.96 1.79 2.31 1.79 3.92 0 1.49-.96 2.85-1.66 3.64l-3.61 4.08c-1.38 1.55-2.96 2.47-4.7 2.47a5.09 5.09 0 01-4.74-3.38c-1.03-.3-1.77-.77-2.56-1.69-.08 2.77-2.12 5.08-5.19 5.08-1.9 0-3.67-.85-5.09-2.47zm-5.21-8.28l3.61 4.08c1.12 1.26 2.29 1.93 3.51 1.93 2.21 0 3.61-1.68 3.61-3.51 0-1.15-.71-1.69-1.6-2.31a.824.824 0 01-.36-.66c0-.43.35-.79.77-.79.17 0 .36.06.59.21.68.41 1.57 1.31 1.91 2.09h2.66c.35-.77 1.23-1.68 1.91-2.09.22-.14.41-.21.59-.21.43 0 .77.36.77.79 0 .27-.16.52-.36.66-.89.62-1.6 1.15-1.6 2.31 0 1.83 1.39 3.51 3.61 3.51 1.22 0 2.39-.66 3.51-1.93l3.61-4.08c.59-.66 1.26-1.8 1.26-2.89s-.68-2.23-1.26-2.89l-3.61-4.08c-1.12-1.26-2.29-1.93-3.51-1.93-2.21 0-3.61 1.68-3.61 3.51 0 1.15.71 1.69 1.6 2.31.21.14.36.4.36.66 0 .43-.35.79-.77.79-.17 0-.36-.06-.59-.21-.68-.41-1.57-1.31-1.91-2.09h-2.66c-.35.77-1.23 1.68-1.91 2.09-.22.14-.41.21-.59.21-.43 0-.77-.36-.77-.79 0-.27.16-.52.36-.66.89-.62 1.6-1.15 1.6-2.31 0-1.83-1.39-3.51-3.61-3.51-1.22 0-2.39.66-3.51 1.93L2.85 7.6c-.59.66-1.26 1.8-1.26 2.89s.68 2.23 1.26 2.89zM5.87 6l1.66-1.85c.35-.38.87-.44 1.2-.13.35.28.28.81 0 1.14L7.07 7.04c-.33.36-.87.4-1.2.11-.35-.3-.28-.84 0-1.15zm15.72-3.04c.11-.05.24-.06.35-.08.52-.03.9.3.92.79.02.36-.24.7-.6.77-.21.03-.27.14-.3.33-.03.35-.35.62-.73.63-.47.02-.82-.33-.84-.81 0-.77.52-1.41 1.2-1.64z"
                  data-name="Layer 1"
                ></path>
              </svg>

              <h1 className="font-bold text-2xl text-center">
                Welcome to Rollbridge!
              </h1>
              <p className="text-sm text-center my-4">
                Would you like to create a Rollbridge instance for the following
                Conduit deployment?
              </p>
              <div className="flex items-center justify-center mt-6 text-violet-500">
                <code>{conduit.data.slug}</code>
              </div>
              <div className="mt-8">
                <CustomButton id={conduit.data.slug} />
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-800 dark:text-zinc-200">
              For mainnet deployments,{" "}
              <a
                href="mailto:alex@fugu.works"
                className="font-semibold leading-6 text-violet-600 hover:text-violet-500"
              >
                please reach out!
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
