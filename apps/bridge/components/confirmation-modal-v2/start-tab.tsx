import { Button } from "../ui/button";

export const ConfirmationModalStartTab = ({
  onNext,
}: {
  onNext: () => void;
}) => {
  return (
    <div>
      <div>Start</div>

      <Button onClick={onNext}>Continue</Button>
    </div>
  );
};
