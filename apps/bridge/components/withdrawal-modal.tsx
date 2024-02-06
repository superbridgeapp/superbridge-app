import { useConfigState } from "@/state/config";

import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

import { deploymentTheme } from "@/config/theme";
import Link from "next/link";
import { isSuperbridge } from "@/config/superbridge";

export const ConfirmWithdrawalModal = ({
  onConfirm,
}: {
  onConfirm: () => void;
}) => {
  const open = useConfigState.useDisplayWithdrawalModal();
  const setOpen = useConfigState.useSetDisplayWithdrawalModal();

  const deployment = useConfigState.useDeployment();
  const theme = deploymentTheme(deployment);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex flex-col gap-6 p-6 align-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            fill="none"
            viewBox="0 0 60 60"
            className="w-24 min-w-24 h-24 min-h-24 mx-auto mt-8"
          >
            <path
              fill="#fff"
              d="M29.82 56.07c14.498 0 26.25-11.753 26.25-26.25 0-14.498-11.752-26.25-26.25-26.25-14.497 0-26.25 11.752-26.25 26.25 0 14.497 11.753 26.25 26.25 26.25z"
            ></path>
            <path
              fill="#000"
              d="M47.35 29.82c0 .64.51 1.18 1.18 1.18h4.87c.64 0 1.18-.54 1.18-1.18 0-.64-.54-1.18-1.18-1.18h-4.87c-.67 0-1.18.51-1.18 1.18zm-2.36-8.78c.21.39.64.61 1.03.61.21 0 .42-.06.61-.15l4.21-2.42c.58-.33.76-1.06.42-1.63-.34-.57-1.06-.76-1.6-.42l-4.21 2.42c-.58.33-.79 1.06-.45 1.6l-.01-.01zm0 17.53c-.33.58-.12 1.3.45 1.63l4.21 2.42c.18.12.39.15.58.15.42 0 .82-.21 1.03-.58.33-.58.15-1.3-.42-1.63l-4.21-2.42c-.58-.33-1.3-.15-1.63.42l-.01.01zm-6.85-25.55c-.33.58-.12 1.3.42 1.63.21.09.39.15.61.15.39 0 .82-.21 1.03-.61l2.42-4.21c.33-.58.15-1.3-.42-1.6-.58-.33-1.3-.15-1.63.42l-2.42 4.21-.01.01zm0 33.6l2.42 4.21c.21.36.64.58 1.03.58.21 0 .42-.03.61-.15.58-.33.76-1.06.42-1.63l-2.42-4.21c-.33-.54-1.06-.76-1.63-.42-.54.33-.76 1.06-.42 1.63l-.01-.01zM17.01 9.99l2.42 4.21c.21.39.61.61 1.03.61.21 0 .39-.06.61-.15.54-.33.76-1.06.42-1.63l-2.42-4.21c-.33-.58-1.06-.76-1.63-.42-.58.3-.76 1.03-.42 1.6l-.01-.01zm0 39.63c-.33.58-.15 1.3.42 1.63.18.12.39.15.61.15.39 0 .82-.21 1.03-.58l2.42-4.21c.33-.58.12-1.3-.42-1.63-.58-.33-1.3-.12-1.63.42l-2.42 4.21-.01.01zm-.54-27.64c-.48.82-.21 1.97.67 2.48l11.84 6.93c.12.09.27.15.39.18.18.06.36.09.54.09 1 0 1.82-.82 1.82-1.79V6.15c0-.97-.76-1.79-1.76-1.79s-1.82.76-1.82 1.76v20.62l-9.2-5.39c-.82-.45-2-.21-2.48.64v-.01zm-8.08-4.54c-.33.58-.15 1.3.42 1.63l4.21 2.42c.18.09.39.15.61.15.39 0 .82-.21 1.03-.61.33-.54.12-1.27-.45-1.6L10 17.01a1.16 1.16 0 00-1.6.42l-.01.01zm0 24.76c.21.36.61.58 1.03.58.18 0 .39-.03.58-.15l4.21-2.42c.58-.33.79-1.06.45-1.63-.34-.57-1.06-.76-1.63-.42l-4.21 2.42c-.58.33-.76 1.06-.42 1.63l-.01-.01zM5.06 29.82c0 .64.54 1.18 1.18 1.18h4.87c.67 0 1.18-.54 1.18-1.18 0-.64-.51-1.18-1.18-1.18H6.24c-.64 0-1.18.51-1.18 1.18zm-1.49 0c0-14.5 11.75-26.25 26.25-26.25s26.25 11.75 26.25 26.25-11.75 26.25-26.25 26.25S3.57 44.32 3.57 29.82zm-3.57 0c0 16.44 13.38 29.82 29.82 29.82 16.44 0 29.82-13.38 29.82-29.82C59.64 13.38 46.26 0 29.82 0 13.38 0 0 13.38 0 29.82zm29.82 24.76c.67 0 1.18-.54 1.18-1.21v-4.84c0-.67-.51-1.21-1.18-1.21-.67 0-1.18.54-1.18 1.21v4.84c0 .67.51 1.21 1.18 1.21z"
            ></path>
          </svg>
          <div className="flex flex-col gap-2 p-4 align-center">
            <h1 className="font-bold text-2xl text-center tracking-tight">
              Withdrawals take 7 days
            </h1>
            <p className="text-sm text-center">
              Native withdrawals are a multi step process and take{" "}
              <span className="font-bold"> 7 days</span> to complete once
              proved. Once a withdrawal is commenced it cannot be sped up.
            </p>
            <p className="text-sm text-center">
              <Link
                href={
                  isSuperbridge
                    ? "https://docs.rollbridge.app/superbridge"
                    : "https://docs.rollbridge.app"
                }
                className="underline font-bold"
              >
                Learn more
              </Link>
            </p>
          </div>
          <Button
            className={`flex w-full justify-center rounded-full px-3 py-6 text-sm font-bold leading-6 text-white shadow-sm ${theme.accentText} ${theme.accentBg}`}
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Continue withdraw
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
