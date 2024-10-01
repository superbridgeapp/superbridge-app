import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const LidoBanner = () => {
  return (
    <Alert>
      <AlertTitle>Please note</AlertTitle>
      <AlertDescription>
        From 7th of October the availability for wstETH Ethereum to Optimism
        bridge deposits will be paused.{" "}
        <a
          href="https://lido.fi/lido-multichain"
          target="_blank"
          className="underline"
        >
          Learn more
        </a>
      </AlertDescription>
      {/* After 7th Oct */}
      {/* <AlertTitle>wstETH Deposits Paused</AlertTitle> */}
      {/* <AlertDescription>
        Please note that wstETH Ethereum to Optimism bridge deposits are paused
        and unavailable{" "}
        <a
          href="https://lido.fi/lido-multichain"
          target="_blank"
          className="underline"
        >
          Learn more
        </a>
      </AlertDescription> */}
    </Alert>
  );
};
