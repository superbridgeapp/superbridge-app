import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "@/utils";
import { deploymentTheme } from "@/config/theme";
import { useConfigState } from "@/state/config";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({ ...props }: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal {...props} />
);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    id="overlay"
    className={cn(
      "fixed inset-0 z-50 backdrop-blur-sm  bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const deployment = useConfigState.useDeployment();
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          `backdrop-blur-lg fixed left-[50%] top-[50%] z-50 w-full max-h-[calc(100vh-112px)] lg:max-h-[540px]  md:max-w-[420px] translate-x-[-50%] translate-y-[-50%] gap-4 p-0 border border-black/[0.08] dark:border-white/[0.08] shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-[21px] md:rounded-[32px] overflow-hidden bg-white dark:bg-black/80`,
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            className={"fill-zinc-400"}
          >
            <g clipPath="url(#clip0_322_6261)">
              <path d="M11.991 0C5.381 0 0 5.38 0 11.991c0 6.61 5.38 11.991 11.991 11.991 6.61 0 11.991-5.38 11.991-11.99C23.982 5.38 18.62 0 11.992 0zm2.031 12.526l3.314 3.314c.214.213.321.48.321.748 0 .588-.481 1.069-1.087 1.069a.998.998 0 01-.748-.32l-3.314-3.297a.713.713 0 00-1.016 0l-3.314 3.296c-.196.214-.48.321-.748.321a1.072 1.072 0 01-1.07-1.069c0-.285.09-.552.304-.748l3.314-3.314a.713.713 0 00.213-.517.674.674 0 00-.213-.499L6.664 8.196a1.047 1.047 0 01-.303-.766A1.06 1.06 0 017.43 6.36c.285 0 .552.108.748.322l3.314 3.314c.143.142.32.213.517.213a.647.647 0 00.499-.213l3.314-3.314c.214-.214.48-.321.748-.321.642 0 1.087.517 1.087 1.069 0 .285-.125.552-.32.766l-3.315 3.314a.703.703 0 00-.213.499c0 .178.07.374.213.517z"></path>
            </g>
            <defs>
              <clipPath id="clip0_322_6261">
                <path fill="#fff" d="M0 0H24V24H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
