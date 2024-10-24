import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils";

const alertVariants = cva(
  "relative shadow w-full px-4 md:px-6 py-3 md:py-4 rounded-[16px] md:rounded-[20px] [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground",
        destructive: "bg-card text-red-500 [&>svg]:text-destructive",
        lg: "text-sm",
        horizontal:
          "bg-card text-foreground md:pr-4 flex justify-between items-center [&>svg]:translate-y-[3px]",
      },
      size: {
        default: "text-xs [&>h5]:text-sm [&_p]:leading-relaxed [&_p]:mb-1",
        lg: "text-sm [&>h5]:text-base [&_p]:leading-relaxed [&_p]:mb-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant, size }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-heading leading-none  text-sm", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("  text-muted-foreground", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
