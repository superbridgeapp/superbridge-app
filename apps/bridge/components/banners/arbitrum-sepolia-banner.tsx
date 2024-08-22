import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const ArbitrumSepoliaDelayedDepositsBanner = () => {
  return (
    <Alert>
      <AlertTitle>Deposits are delayed</AlertTitle>
      <AlertDescription>
        Finalization issues with Arbitrum Sepolia are causing some deposits to
        be delayed. Stay tuned for updates
      </AlertDescription>
    </Alert>
  );
};
