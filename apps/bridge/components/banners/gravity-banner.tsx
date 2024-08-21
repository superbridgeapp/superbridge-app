import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const GravityBanner = () => {
  return (
    <Alert>
      <AlertTitle>Bridging USDC, USDT, or WETH?</AlertTitle>
      <AlertDescription>
        Please visit{" "}
        <a
          href="https://stargate.finance/bridge"
          target="_blank"
          className="underline"
        >
          Stargate.
        </a>
      </AlertDescription>
    </Alert>
  );
};
