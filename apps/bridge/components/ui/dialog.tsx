import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "@/utils";

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
      "fixed inset-0 z-50 backdrop-blur-lg bg-background mix-blend-hue data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    hideCloseButton?: boolean;
  }
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          `flex flex-col backdrop-blur-lg fixed left-[50%] bottom-[0] md:bottom-auto  md:top-[50%] z-50 h-auto max-h-[96dvh] md:max-h-[80vh] w-screen md:w-[50vw] md:max-w-[420px] translate-x-[-50%] md:translate-y-[-50%]  p-0  shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-bottom-[48%] rounded-t-[21px] md:rounded-[32px] bg-card overflow-hidden overflow-y-auto`,
          className
        )}
        {...props}
      >
        {children}
        {props.hideCloseButton ? null : (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full w-10 h-10 shrink-0 flex items-center justify-center bg-muted transition-opacity hover:scale-105 transition-all focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="fill-foreground w-3.5 h-3.5"
            >
              <path d="M0.562404 13.4244C-0.205637 12.6425 -0.187241 11.8653 0.617592 11.0697L4.68315 7.00411L0.617592 2.95695C-0.178043 2.14752 -0.205637 1.37028 0.589998 0.574646C1.38563 -0.220989 2.13528 -0.193394 2.95851 0.616038L7.01027 4.6678L11.062 0.629835C11.8577 -0.179597 12.6349 -0.193394 13.4167 0.574646C14.2124 1.37028 14.1848 2.16132 13.3891 2.97075L9.33738 7.00871L13.3891 11.0329C14.1986 11.8561 14.1986 12.6196 13.4167 13.4152C12.6349 14.197 11.8577 14.1832 11.0482 13.3876L7.01027 9.33583L2.95851 13.4014C2.14907 14.197 1.35804 14.2108 0.562404 13.429V13.4244Z" />
            </svg>
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
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
    className={cn("flex flex-col text-left px-6 py-6 gap-1", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-3 px-6 py-6", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-heading leading-none ", className)}
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
