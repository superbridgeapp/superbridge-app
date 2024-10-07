import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const LidoBanner = () => {
  return (
    <Alert>
      <AlertTitle>wstETH Deposits Paused</AlertTitle>
      <AlertDescription>
        Please note that wstETH Ethereum to OP Mainnet bridge deposits are
        paused and unavailable{" "}
        <a
          href="https://research.lido.fi/t/lip-22-steth-on-l2/6855"
          target="_blank"
          className="underline"
        >
          Learn more
        </a>
      </AlertDescription>
    </Alert>
  );
};
